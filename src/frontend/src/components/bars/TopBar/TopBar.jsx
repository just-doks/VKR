import { useNavigate } from 'react-router-dom';
import Stack from 'react-bootstrap/Stack';

import './TopBar.css';
import {ReactComponent as ArrowSVG} from '#svg/arrow.svg';


const TopBar = function(props) {
    const { title, backPanel = false, backTo, prevPageState, 
        saveButton = false, onClickSave } = props;
    const navigate = useNavigate()

    return (
        <>
            {backPanel === false 
            ? 
                <nav className='topbar-title'>
                    <h2 className='title-color mb-1'>{title}</h2>
                </nav>
            : 
                <Stack direction='vertical'>
                    <nav className='topbar-title'>
                        <h5 className='title-color mb-1'>{title}</h5>
                    </nav>
                    <nav className='topbar-backpanel'>
                        <button className='backbtn' 
                                onClick={() => 
                                    navigate(backTo, {state: prevPageState})
                                }
                        >
                                <ArrowSVG className='backbtn-svg'/>
                                <label className='backbtn-label'>{'назад'}</label>
                        </button>
                        { saveButton &&
                        <button className='savebtn' onClick={onClickSave}>
                            <label className='savebtn-label'>{'Сохранить'}</label>
                        </button>
                        }
                    </nav>
                </Stack>
            }
        </>
    )
}

export default TopBar;