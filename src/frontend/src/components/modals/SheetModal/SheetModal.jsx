import React, { useEffect, useState } from 'react';
import { Sheet } from 'react-modal-sheet';

import './SheetModal.css';
import VStack from '#components/containers/VStack';
import HStack from '#components/containers/HStack';
import SmallButton from '#components/buttons/SmallButton';
import AccessBadge from '#components/badges/AccessBadge';


function DayButton(props) {
    const { onClick, className, isActive = false, fontSize, borderRadius, children } = props;
    const style = {
        borderRadius: borderRadius,
        fontSize: fontSize
    };
    return(
        <label className={'day-btn' + (className ? ` ${className}` : '')}>
            <input  type='checkbox' 
                    checked={isActive} 
                    onChange={onClick}/>
            <span style={style}>
                {children}
            </span>
        </label>
    );
};


const SheetModal = ({isOpen, onClose, initDays, initTime, access}) => {
    if (isOpen) {
        const tag = document.querySelector("meta[name='theme-color']")
        tag.content = "rgba(33, 33, 115, 1)";
    }

    const dayTable = [
        {code: 'M', name: 'Понедельник',   isActive: false},
        {code: 'T', name: 'Вторник',       isActive: false},
        {code: 'W', name: 'Среда',         isActive: false},
        {code: 'H', name: 'Четверг',       isActive: false},
        {code: 'F', name: 'Пятница',       isActive: false},
        {code: 'A', name: 'Суббота',       isActive: false},
        {code: 'S', name: 'Воскресенье',   isActive: false}
    ];

    const [week, setWeek] = useState({code: 'SMTWHFA', name: 'Все', isActive: false});
    const [days, setDays] = useState([
        {code: 'M', name: 'Понедельник',   isActive: false},
        {code: 'T', name: 'Вторник',       isActive: false},
        {code: 'W', name: 'Среда',         isActive: false},
        {code: 'H', name: 'Четверг',       isActive: false},
        {code: 'F', name: 'Пятница',       isActive: false},
        {code: 'A', name: 'Суббота',       isActive: false},
        {code: 'S', name: 'Воскресенье',   isActive: false}
    ]);
    const [addTime, setAddTime] = useState(false);
    const [time, setTime] = useState([ // ])
        {from: '00:00', to: '00:00'}
    ]);

    useEffect(() => {
        if (initDays) {
            const initDaysArray = initDays.split('');
            let counter = 0;
            setDays(days.map(day => {
                if (initDaysArray.includes(day.code)) {
                    counter += 1;
                    return {...day, isActive: true};
                }
                return {...day, isActive: false};
            }));
            if (counter === 7) setWeek({...week, isActive: true});
        } else  {
            setDays(dayTable);
            setWeek({code: 'SMTWHFA', name: 'Все', isActive: false})
        }
        
        if (initTime) {
            setTime([{...initTime}]);
            setAddTime(true);
        } else {
            setTime([{from: '00:00', to: '00:00'}]);
            setAddTime(false);
        }
        // eslint-disable-next-line
    },[isOpen]);

    function handleOnClose() {
        onClose(days.flatMap(d  => {
            if (d.isActive) return [d.code];
            else return [];
        }).join(''), (addTime ? time[0] : undefined));
        const tag = document.querySelector("meta[name='theme-color']")
        tag.content = "#2a2a90";
    }

    const toggleWeek = () => {
        if (week.isActive) {
            const newDays = days.map(day => ({...day, isActive: false}))
            setDays(newDays);
        } else {
            const newDays = days.map(day => ({...day, isActive: true}))
            setDays(newDays);
        }
        setWeek({...week, isActive: !week.isActive});
    }

    const toggleDay = (index) => () => {
        let isInactiveFlag = false;
        let newDays = days.map( (day, i) => {
            if (i === index) {
                if (!isInactiveFlag && day.isActive) {
                    isInactiveFlag = true;
                }
                return {...day, isActive: !day.isActive}
            } else {
                if (!isInactiveFlag && !day.isActive) {
                    isInactiveFlag = true;
                }
                return day;
            }
        })

        if (isInactiveFlag) {
            if (week.isActive)
                setWeek({...week, isActive: false});
        } 
        else {
            if (!week.isActive)
                setWeek({...week, isActive: true});
        }
        setDays(newDays);
    }

    const updateTimeFrom = (index) => (event) => {
        const newTime = [...time];
        if (event.target.value <= time[index].to || time[index].to === '00:00')
            newTime[index].from = event.target.value
        else
            newTime[index].from = time[index].from
        setTime(newTime);
    };

    const updateTimeTo = (index) => (event) => {
        const newTime = [...time];
        if (event.target.value >= time[index].from || event.target.value === '00:00')
            newTime[index].to = event.target.value
        else
            newTime[index].to = time[index].to
        setTime(newTime);
    };
    
    return(
        <Sheet isOpen={isOpen} onClose={handleOnClose}
            snapPoints={[-60, 0]} initialSnap={0}>
            <Sheet.Container>
                <Sheet.Header/>
                <Sheet.Content>
                    
                    <VStack className='sheet-modal' gap={'20px'}>
                        <HStack className='sm-window sm-hstack' gap={'10px'}>
                            <label>Доступ:</label>
                            <AccessBadge access={access}/>     
                        </HStack>
                        <VStack className='sm-window'>
                            <HStack className='sm-hstack' justifyContent='space-between'>
                                <label>Дни:</label>
                                <DayButton 
                                    isActive={week.isActive} 
                                    onClick={toggleWeek}>
                                    {week.name}
                                </DayButton>
                            </HStack>
                            <hr className='sm-hr'/>    
                            <HStack className='sm-hstack' gap='5px'>
                                {days.map((day, ind) => (
                                    <DayButton
                                        key={ind + day}
                                        fontSize='min(2.5vw + 6px, 16px)'
                                        isActive={day.isActive}
                                        onClick={toggleDay(ind)}
                                    >
                                        {day.name}
                                    </DayButton>
                                ))}
                            </HStack>
                        </VStack>
                        <VStack className='sm-window'>
                            <HStack className='sm-hstack' justifyContent='space-between'>
                                <label>Время:</label>
                                {addTime
                                ?
                                <SmallButton borderRadius={'16px'}
                                    onClick={() => setAddTime(false)}>
                                    <span style={{fontSize: '20px', padding: '10px'}}
                                    >Убрать</span>
                                </SmallButton>
                                :
                                <SmallButton borderRadius={'16px'}
                                    onClick={() => setAddTime(true)}>
                                    <span style={{fontSize: '20px', padding: '10px'}}
                                    >Добавить</span>
                                </SmallButton>
                                }
                            </HStack>
                            { addTime &&
                            <>
                                <hr className='sm-hr'/>
                                {time.length > 0 && time.map((t, ind) => (
                                    <HStack className='sm-hstack' key={ind} gap='20px'>
                                        <label className='sm-time-cell' tabIndex={0}>
                                            <span>от:</span>
                                            <input 
                                            type="time"
                                            name='from'
                                            className='time-cell'
                                            value={t.from}
                                            onChange={updateTimeFrom(ind)}
                                            />
                                        </label> 
                                        <label className='sm-time-cell' tabIndex={0}>
                                            <span>до:</span>
                                            <input 
                                            type="time"
                                            name='to'
                                            className='time-cell'
                                            value={t.to}
                                            onChange={updateTimeTo(ind)}
                                            />
                                        </label>
                                    </HStack>
                                ))}
                            </>}
                        </VStack>
                    </VStack>
                </Sheet.Content>
            </Sheet.Container>
            <Sheet.Backdrop onTap={handleOnClose}/>
        </Sheet>
    );
};

export default SheetModal;