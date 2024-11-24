import { useState, useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router";
import Stack from "react-bootstrap/Stack";

import '#css/RuleSettings.css';
import SecondWindow from "#components/containers/SecondWindow";
import TopBar from "#components/bars/TopBar";
import SmallButton from "#components/buttons/SmallButton";
import AddressModal from "#components/modals/AddressModal";
import ToggleSwitch from "#components/buttons/ToggleSwitch";
import ScheduleCard from "#components/cards/ScheduleCard";
import SheetModal from '#components/modals/SheetModal';
import AllowDenyButton from "#components/buttons/AllowDenyButton";

import { fetchRule, updateRule } from "#http/ruleAPI";
import { isAddrExist, patchAddr } from "#http/addressAPI";
import { HOME_ROUTE } from "#utils/constants";

const Rule = () => {
    const location = useLocation();
    const [title, setTitle] = useState(location.state?.title ?? '');

    /** @type {[Rule, React.Dispatch<React.SetStateAction<Rule>>]} */
    const [rule, setRule] = useState(undefined);
    const [access, setAccess] = useState('ALLOW');
    const [schedule, setSchedule] = useState('OFF');

    /** @type {React.MutableRefObject<Exception[]>} */
    const exceptionList = useRef([]);
    /** @type {React.MutableRefObject<Exception[]>} */
    const addList = useRef([]);
    /** @type {React.MutableRefObject<Exception[]>} */
    const updateList = useRef([]);
    /** @type {React.MutableRefObject<Exception[]>} */
    const removeList = useRef([]);

    const [add, setAdd] = useState(0);
    const [update, setUpdate] = useState(0);
    const [remove, setRemove] = useState(0);

    /** 
     * @type {[{status: string, ref: Exception, initIndex?: number}[], 
     * React.Dispatch<React.SetStateAction<{status: string, ref: Exception, prev?: Exception}[]>>]} 
     * */
    const [table, setTable] = useState([]);
    const ref = useRef(undefined);


    /** @type {[Address, React.Dispatch<React.SetStateAction<Address>>]} */
    const [address, setAddress] = useState(location.state?.address ?? undefined);
    const [newAddress, setNewAddress] = useState(address);

    const ruleId = location.state?.ruleId;

    const previousPage = location.state?.prevPage ?? '';
    const previousState = location.state?.prevState ?? {};
    
    const [isChanged, setIsChanged] = useState(false);
    
    const [renameModalVisible, setRenameVisible] = useState(false);

    const [sheetOpened, setSheetOpened] = useState(false);

    useEffect(() => {
        if (!address && !ruleId) return;

        fetchRule((address ? address.ruleId : ruleId))
        .then(data => {
            setRule(data.rule);
            setAccess(data.rule.access);
            setSchedule(data.rule.schedule);
            if (data.exceptions) {
                exceptionList.current = data.exceptions;
                setTable(exceptionList.current.map((ex, ind) => ({
                    status: '', ref: ex, initIndex: ind
                })));
            }
        })
        .catch(err => console.log(err.message))
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if ((rule && (access !== rule.access || schedule !== rule.schedule)) || 
            (address && (newAddress?.value !== address.value)) ||
            (add > 0) || 
            (update > 0) ||
            remove ) {
            setIsChanged(true)
        } else if (isChanged) {
            setIsChanged(false)
        }
        // eslint-disable-next-line
    }, [access, schedule, newAddress, add, update, remove])

    if (!location.state) {
        return (<Navigate to={HOME_ROUTE}/>) 
    }

    const handleSaveClick = () => {
        setIsChanged(false);
        if (address && (address.value !== newAddress.value)) {
            patchAddr(address.id, newAddress.type, newAddress.value)
            .then(data => {
                setAddress(data);
                setNewAddress(data);
            })
        }
        if (rule && ((access !== rule.access) || (schedule !== rule.schedule) || 
            add || update || remove)) {
            updateRule(rule.id, access, schedule, addList.current, updateList.current, removeList.current)
            .then(data => {
                if (data.rule) {
                    setRule(data.rule);
                    setAccess(data.rule.access);
                    setSchedule(data.rule.schedule);
                }
                if (data.exceptions) {
                    exceptionList.current = data.exceptions;
                    setTable(exceptionList.current.map((ex, ind) => ({
                        status: '', ref: ex, initIndex: ind
                    })));
                    addList.current = [];
                    updateList.current = [];
                    removeList.current = [];
                }
            })
        }
    }

    async function renameAddressCondition(type, value) {
        if (value !== address.value) {
            const result = await isAddrExist(address.listId, type, value);
            console.log(result);
            if (result) return false;
        }
        return true;
    }

    function handleAddException() {
        ref.current = {status: 'N'};
        setSheetOpened(true);
    }
    function handleOpenException(props) {
        return function() {
            ref.current = props;
            setSheetOpened(true);
        }
    }

    function handleDeleteException(props) {
        const {exception, initIndex, status, index} = props;
        return function() {
            if (status === '') {
                removeList.current.push(exception);
                setRemove(removeList.current.length);
            } else 
            if (status === 'U') {
                removeList.current.push(exceptionList.current[initIndex]);
                updateList.current = updateList.current.filter(el => el.id !== exception.id);
                setRemove(removeList.current.length);
                setUpdate(updateList.current.length);
            }
            if (status === 'A') {
                addList.current = addList.current.filter((el, ind) => ind !== initIndex);
                setAdd(addList.current.length);
            }
            setTable(table.filter((row, ind) => (ind !== index)));
        }
    }

    return (
        <>
        <TopBar title={title} 
                backPanel backTo={previousPage} 
                prevPageState={previousState}
                saveButton={isChanged}
                onClickSave={handleSaveClick}/>
        <SecondWindow className={'mx-3 py-2'}>
            {address && 
                <Stack>
                    <h4 className="ms-2 mb-1">Адрес:</h4>
                    <label  className="align-self-center mb-2" 
                            style={{fontSize: '22px'}}>
                        {newAddress.value}
                    </label>
                    <SmallButton 
                        className={'mx-auto px-4'} 
                        borderRadius={'18px'}
                        onClick={() => setRenameVisible(true)}>
                        <label style={
                            {fontSize: '16px', lineHeight: '30px', color: 'dimgray'}
                        }>
                            Изменить адрес
                        </label>
                    </SmallButton>
                    <hr className="mb-3"/>
                </Stack>  
            }
            <Stack className="mt-1 mb-3 justify-content-between" direction="horizontal">
                <h2 className="mb-1">Доступ:</h2>
                <AllowDenyButton state={access} setState={setAccess}/>
            </Stack>
             
            <hr className="mb-3 mt-1"/>

            <Stack direction="horizontal" className="justify-content-between">
                <label style={{fontSize: 18}}>Расписание:</label>
                <ToggleSwitch checked={schedule === 'ON'} onChange={
                    () => setSchedule((schedule === 'ON') ? 'OFF' : 'ON')
                }/>
            </Stack>

            { schedule === 'ON' && 
            <>
                {table.map((row, ind) => {
                    const extended = {
                        exception: row.ref, initIndex: row?.initIndex, 
                        status: row.status, index: ind
                    }
                    if (row.status !== 'D') return (
                        <ScheduleCard 
                            key={ind} 
                            className="mt-3" 
                            onClick={handleOpenException(extended)}
                            onDelete={handleDeleteException(extended)}
                            access={(access === 'ALLOW' ? false : true)}
                            days={row.ref?.days}
                            time={row.ref?.time}/>
                    )})
                }
                <div className="add-exceptiion-btn-box">
                    <button className='add-exception-btn' onClick={handleAddException}>
                        <span>Добавить</span>
                    </button>
                </div>
                
            </>
            }

            
        </SecondWindow>
       
        <AddressModal
            title='Изменить адрес'
            type={newAddress?.type}
            value={newAddress?.value}
            onSave={
                (type, value) => setNewAddress(
                    prevState => ({...prevState, type: type, value: value}))
            }
            saveConditionAsync={renameAddressCondition}
            show={renameModalVisible}
            onHide={() => setRenameVisible(false)}/>

        <SheetModal isOpen={sheetOpened} initDays={ref.current?.exception?.days} 
            initTime={ref.current?.exception?.time} 
            access={(access === 'ALLOW' ? false : true)}
            onClose={(days, time) => {
                console.log(days.length);
                console.log(time);
                const status = ref.current.status;
                const index = ref.current?.index;
                const refDays = ref.current.exception?.days;
                const refTime = ref.current.exception?.time;

                if ((refDays ? (days === refDays) : (!days.length)) && 
                    (refTime ? 
                        (time?.from === refTime.from && time?.to === refTime.to) : 
                        (!time))
                    ) {
                        setSheetOpened(false);
                        return;
                } else
                if (status === '') {
                    updateList.current.push({...ref.current.exception, days, time});
                    const l = updateList.current.length;
                    setUpdate(l);
                    setTable(prevState => {
                        prevState[index].ref = updateList.current[l - 1];
                        prevState[index].status = 'U';
                        return prevState;
                    });
                } else
                if (status === 'U') {
                    const exception = exceptionList.current[ref.current.initIndex];
                    const prevID = exception?.id;
                    const prevDays = exception?.days;
                    const prevTime = exception?.time;

                    const prevFrom = prevTime?.from;
                    const prevTo = prevTime?.to;
                    if ((prevDays ? (days === prevDays) : (!days)) && 
                        (prevTime ? (time?.from === prevFrom && time?.to === prevTo) : (!time))) {
                        setTable(prevState => {
                            prevState[index].ref = exception;
                            prevState[index].status = '';
                            return prevState;
                        })
                        updateList.current = updateList.current.filter(ex => ex.id !== prevID);
                        setUpdate(updateList.current.length);
                    } else {
                        setTable(prevState => {
                            prevState[index].ref.days = days;
                            prevState[index].ref.time = time;
                            return prevState;
                        })
                    }
                } else
                if (status === 'N') {
                    addList.current.push({
                        ...(days && {days}), ...(time && {time})
                    });
                    const l = addList.current.length;
                    setAdd(l);
                    setTable(prevState => [...prevState, {
                        ref: addList.current[l - 1], status: 'A', initIndex: l - 1
                    }])
                } else
                if (status === 'A') {
                    setTable(prevState => {
                        prevState[index].ref.days = days;
                        prevState[index].ref.time = time;
                        return prevState;
                    })
                }

                setSheetOpened(false)
            
        }}/>
        </>
    )
}

export default Rule;