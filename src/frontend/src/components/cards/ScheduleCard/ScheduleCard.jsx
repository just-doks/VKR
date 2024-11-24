import { ReactComponent as Trash } from '#svg/trash.svg';

import './css/RedButton.css';

import SwipeItem from './SwipeItem.jsx';
import Card from './Card.jsx';

function RedButton({className, onClick, children}) {
    return(
        <button 
            className={'red-button' + `${(className) ? (' ' + className) : ''}`} 
            onClick={onClick}
        >
            {children}
        </button>
    );
};

const ScheduleCard = ({className, onClick, onDelete, access, days, time, status}) => {
    return (
        <SwipeItem 
            className={className}
            content={<Card access={access} days={days} time={time} status={status}/>}
            hidden={
                <RedButton onClick={onDelete}>
                    <Trash/>
                </RedButton>}
            onClick={onClick}
        />
    );
};

export default ScheduleCard;
