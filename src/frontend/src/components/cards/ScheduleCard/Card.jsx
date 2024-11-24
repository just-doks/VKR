import './css/Card.css';

import AccessBadge from '#components/badges/AccessBadge';
import DayBadge from '#components/badges/DayBadge';
import { useEffect, useState } from 'react';

function TimeRange({from, to}) {
    return (
        <div className='card-time-range'>
            <label className='card-time-range-label'>{from}</label>
            <label>–</label>
            <label className='card-time-range-label'>{to}</label>
        </div>
        
    );
}

function Card(props) {
    const initDays = [
        {code: 'M', name: 'Пн'}, 
        {code: 'T', name: 'Вт'}, 
        {code: 'W', name: 'Ср'}, 
        {code: 'H', name: 'Чт'}, 
        {code: 'F', name: 'Пт'}, 
        {code: 'A', name: 'Сб'}, 
        {code: 'S', name: 'Вс'}
    ];
    const initTimestamps = [{from: '00:00', to: '23:59'}]
    const { access, days, time, timestamps = initTimestamps, status} = props;
    const [dayIcons, setDayIcons] = useState([])
    useEffect(() => {
        if (days) {
            const darr = days.split('');
            setDayIcons(initDays.filter(d => darr.includes(d.code)));
        }
    }, [days])
    return(
        <div className='schedule-card'>
            <div className='sc-grid-wrapper'>
                <label className='schedule-card-label sc-grid-label'>Доступ:</label>
                {days && <label className='schedule-card-label sc-grid-label'>Дни:</label>}
                {time && <label className='schedule-card-label sc-grid-label'>Время:</label>}
                
                <div className='sc-grid-access-badge'>
                    <div style={{display: 'inline-flex'}}>
                    <AccessBadge className='sc-access-badge' access={access}/>
                    <span style={{marginLeft: '5px'}}>{status}</span>
                    </div>
                </div>
                {days &&
                    <div className='sc-grid-day-badges day-badges'>
                        {dayIcons.map((day, ind) => (
                            <DayBadge key={ind}>{day.name}</DayBadge>
                        ))}
                    </div>
                }
                {time &&
                    <div className='sc-grid-time-range'>
                        <TimeRange from={time.from} to={time.to}/>
                    </div>
                }
            </div>
        </div>
    );
};

export default Card;