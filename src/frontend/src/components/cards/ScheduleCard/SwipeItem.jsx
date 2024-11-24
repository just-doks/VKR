import { createPortal } from 'react-dom';
import { useState } from 'react';
import { useSwipeable, LEFT, RIGHT } from 'react-swipeable';

import './css/SwipeItem.css';

function Background({onClick, zIndex}) {
    return(
        <div 
            className='swipe-item-bg' 
            onTouchEnd={onClick} 
            onMouseUp={onClick}
            style={{zIndex: zIndex}}/>
    );
}

function SwipeItem(props) {
    const {className, zIndex = 5, onClick, 
        content, hidden, offset = -100, threshold = -50} = props;

    const [translateX, setTranslateX] = useState(0)
    const [transition, setTransition] = useState('0.05s ease-out')
    const [startX, setStartX] = useState(0)
    const [dirFlag, setDirFlag] = useState(false)
    const [zindex, setZindex] = useState(zIndex)

    function resetItem() {
        setTransition('0.2s ease');
        setTranslateX(0);
        setStartX(0);
        setZindex(zIndex ?? 5);
    }

    const handlers = useSwipeable({
        onSwipeStart: (e) => {
            setTransition('0.05s ease-out')
            if (e.dir == LEFT || e.dir == RIGHT)
                setDirFlag(true)
            else
                setDirFlag(false)
        },
        onSwiping: (e) => {
            if (!dirFlag) return;
            const x = e.deltaX + startX;
            setTranslateX(x);
            if (startX == 0) { 
                if (x >= 0)  {
                    setTranslateX(0)
                } else 
                if (x > threshold) {
                    setTranslateX(x * x / threshold)
                } else
                if (x <= offset) {
                    setTranslateX(offset);
                }
            } else { 
                if (x < offset) {
                    setTranslateX(offset)
                } else
                if (x >= 0) {
                    setTranslateX(0)
                }
            }
        },
        onSwiped: () => {
            if (startX == 0) {
                if (translateX > 0) {
                    setTransition('0.1s ease-out')
                }
            }
            if (translateX < threshold) {
                setTranslateX(offset);
                setStartX(offset);
                setZindex(zindex + 10);
            } else {
                setTranslateX(0);
                setStartX(0);
                setZindex(zIndex);
            }
        },
        onTap: () => {
            if (startX != 0) {
                resetItem()
            } else
            if (onClick) {
                onClick();
            }
        },
        trackMouse: true,
        preventScrollOnSwipe: false,
        trackTouch: true,
        delta: 10
    });

    return (
        <>
        <div 
            className={`swipe-item-wrapper ${className}`}
            style={{zIndex: zindex + 1}}>
            <div 
                {...handlers}
                className='swipe-item-content'
                style={{
                    zIndex: zindex + 2,
                    transform: `translateX(${translateX}px)`,
                    transition: `${transition}`
            }}>   
                {content}
            </div> 
            <div 
                id='swipe-item-hidden' 
                className='swipe-item-hidden' 
                style={{zIndex: zindex + 1}}
            >
                {hidden}
            </div>
        </div>
        {startX != 0 && createPortal(
            <Background onClick={resetItem} zIndex={zindex}/>, 
            document.getElementById('second-window'))
        }
        </>
    );
}

export default SwipeItem;