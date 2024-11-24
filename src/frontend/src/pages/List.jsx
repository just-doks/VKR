// Импорт сторонних и нативных ресурсов
import { useLocation, useNavigate } from "react-router";
import Stack from "react-bootstrap/Stack";
import { Navigate } from "react-router";
import React, { useEffect, useState } from "react";

// Импорт собственных ресурсов
import '#css/RulesList.css';
import {ReactComponent as PencilSVG} from '#svg/pencil.svg';
import {ReactComponent as TrashSVG} from '#svg/trash.svg';
import { HOME_ROUTE, LIST_ROUTE, RULE_ROUTE } from "#utils/constants";

// Импорт компонентов
import SecondWindow from "#components/containers/SecondWindow/SecondWindow.jsx";
import TopBar from "#components/bars/TopBar";
import SmallButton from "#components/buttons/SmallButton";
import BigButton from "#components/buttons/BigButton";
import AddressCard from "#components/cards/AddressCard";
import AddressModal from "#components/modals/AddressModal";
import DeleteModal from "#components/modals/DeleteModal";
import ListModal from "#components/modals/ListModal";

// Импорт функций для общения с сервером
import { updateList, deleteList, isListExist } from "#http/listAPI";
import { fetchAddrs } from "#http/addressAPI";

const List = function() {
    const navigate = useNavigate();
    const location = useLocation();

    /** @type {[List, React.Dispatch<React.SetStateAction<List>>]} */
    const [list, setList] = useState(location.state?.list ?? null);

    const previousPage = location.state?.prevPage ?? '';
    const previousState = location.state?.prevState ?? {};
    const [listName, setListName] = useState(list?.name ?? '');
    const [isChanged, setIsChanged] = useState(false);

    const [listModalVisible, setListModalVisible] = useState(false)
    const [addModalVisible, setAddVisible] = useState(false)
    const [deleteListVisible, setDeleteListVisible] = useState(false)


    /** @typedef {[Address[], React.Dispatch<React.SetStateAction<Address[]>>]} AddrState */
    /** @type {AddrState} */
    const [addrList, setAddrList] = useState([]);
    ///** @type {AddrState} */

    const [newAddrList, setNewAddrList] = useState([]);
    /** @type {AddrState} */
    const [delAddrList, setDelAddrList] = useState([]);
    

    useEffect(() => {
        if (!location.state?.list) return;
        fetchAddrs(list.id)
            .then(data => {
                setAddrList(data)
            })
            .catch(err => console.log(err.message))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    useEffect(() => {
        if (!location.state?.list) return;
        if (listName !== list.name
            || newAddrList.length !== 0
            || delAddrList.length !== 0
        ) {
            setIsChanged(true)
        } else if (isChanged) {
            setIsChanged(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listName, newAddrList, delAddrList])


    if (!location.state) {
        return (<Navigate to={HOME_ROUTE}/>) 
    }

    // Функции навигации {
    const handleListRuleNavigate = () => {
        navigate(RULE_ROUTE, {state:{
            prevPage: LIST_ROUTE,
            title: 'Правило доступа списка',
            ruleId: list.ruleId,
            prevState: location.state }})
    }
    /** @param {Address} address */
    const handleAddressRuleNavigate = (address) => () => {
        navigate(RULE_ROUTE, { state:{
            prevPage: LIST_ROUTE,
            title: 'Правило доступа',
            address: address,
            prevState: location.state
        }})
    }
    // }

    const handleSaveClick = async () => {
        // if (window.confirm("save?"))
        updateList(list.id, listName, newAddrList, delAddrList)
            .then(data => {
                location.state.list = data.list
                setList(data.list)
                setAddrList(data.addresses)
                if (data.rejected?.add) setNewAddrList(data.rejected.add);
                else setNewAddrList([]);
                setDelAddrList([]);
                setIsChanged(false)
            })
            .catch(err => console.log(err.message))
    }

    const handleDeleteListClick = async () => {
        deleteList(list.id)
            .catch(err => console.log(err.message))
            .finally(() => {
                setDeleteListVisible(false)
                navigate(previousPage, {state: previousState})
            })
    }

    const addNewAddressCondition = (type, value) => {
        let index = addrList.findIndex(el => el.value === value)
        if (index > -1) {
            return false;
        }
        index = newAddrList.findIndex(el => el.value === value)
        if (index > -1) {
            return false;
        }
        //setNewAddrList([...newAddrList, address])
        return true;
    }

    async function renameListCondition(listname) {
        const result = await isListExist(listname, list.userId);
        if (result) return false;
        else return true;
    }

    const handleDeleteAddressClick = (address) => () => {
        const newAddrs = addrList.filter(el => el.id !== address.id)
        setAddrList(newAddrs)
        setDelAddrList([...delAddrList, address])
    }
    const handleDeleteNewAddressClick = (address) => () => {
        const newArr = newAddrList.filter(el => el.value !== address.value)
        setNewAddrList(newArr)
    }

    const handleRestoreAddressClick = (address) => () => {
        const index = delAddrList.findIndex(el => el.id === address.id)
        if (index > -1) {
            var newArr = delAddrList.filter(el => el.id !== address.id)
            setDelAddrList(newArr)
            newArr = [...addrList, address]
            newArr.sort((a, b) => { return (a.id - b.id) })
            setAddrList(newArr)
        }
    }

    return (
        <>
        <TopBar title='Список правил' backPanel saveButton={isChanged} onClickSave={handleSaveClick} 
        backTo={previousPage} prevPageState={previousState}/>
        
        <SecondWindow className='mx-3 py-3'>

            <Stack direction="horizontal" className="list-name-stack mb-3" gap={2}>
                <h2 className="rules-name mb-0 ms-1">{listName}</h2>
                <Stack direction="horizontal" gap={2} className="small-btns-stack">
                    <SmallButton className={'small-list-btn'} borderRadius={'12px'}
                        onClick={() => setListModalVisible(true)}>
                        <PencilSVG width='22px' height='22px' fill='gray'/>
                    </SmallButton>
                    <SmallButton className={'small-list-btn'} borderRadius={'12px'}
                        onClick={() => setDeleteListVisible(true)}>
                        <TrashSVG width='22px' height='22px' fill='gray'/>
                    </SmallButton>
                </Stack> 
            </Stack>

            <BigButton onClick={handleListRuleNavigate}>
                <label style={{fontSize: '18px'}}>Правило доступа списка</label>
            </BigButton>
            <hr/>
            <Stack direction="horizontal" className="justify-content-between mb-3 align-content-center">
                    <h4 className="ms-0 mb-0">Список адресов:</h4>
                    <SmallButton 
                        className={'add-btn py-1'} 
                        borderRadius='20px' 
                        onClick={() => setAddVisible(true)}
                    >
                        <label style={{fontSize: '18px', lineHeight: '16px'}}>Добавить</label>
                    </SmallButton>
            </Stack>
            
            {addrList.map((addr, ind) => 
                <AddressCard key={ind} 
                             address={addr.value}
                             className={'mb-2'}
                             prevPage={LIST_ROUTE}
                             prevState={location.state}
                             onClickSet={handleAddressRuleNavigate(addr)}
                             onClickDel={handleDeleteAddressClick(addr)}/>
            )}
            {newAddrList.map((addr, ind) => 
                <AddressCard key={ind}
                             address={addr.value}
                             className={'mb-2'}
                             added
                             onClickDel={handleDeleteNewAddressClick(addr)}/>
            )}
            {delAddrList.map((addr, ind) => 
                <AddressCard key={ind}
                             address={addr.value}
                             className={'mb-2'}
                             removed
                             onClickRes={handleRestoreAddressClick(addr)}/>
            )}
            
        </SecondWindow>
        
        <ListModal
            title='Переименовать'
            name={listName}
            onSave={(listname) => setListName(listname)}
            saveConditionAsync={renameListCondition}
            show={listModalVisible}
            onHide={() => setListModalVisible(false)}/>
        <DeleteModal 
            onDelete={handleDeleteListClick}
            show={deleteListVisible}
            onHide={() => setDeleteListVisible(false)}/>
        <AddressModal
            title={'Добавить адрес'}
            onSave={(type, addr) => setNewAddrList([...newAddrList, {type: type, value: addr}])}
            saveCondition={addNewAddressCondition}
            show={addModalVisible} 
            onHide={() => setAddVisible(false)}/>
        </>
    )
}

export default List;