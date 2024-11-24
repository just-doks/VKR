import Stack from 'react-bootstrap/Stack';
import Spinner from 'react-bootstrap/Spinner';

import './SecondWindow.css'
import {ReactComponent as ErrorSVG} from '#svg/error.svg'
import BottomBar from "#components/bars/BottomBar";

const SecondWindow = function(props) {
    const { className, gap, children } = props
    const { isLoading = false, error = false, errorMsg } = props
    if (error) {
        return (
            <>
            <div className="blank-window">
                <ErrorSVG className={'error-icon'}/>
                <p className="error-msg">{errorMsg}</p>
            </div>
            <BottomBar/>
            </> 
        )
    }

    if (isLoading) {
        return (
            <>
            <div className="blank-window">
                <Spinner className={'loader-icon'} animation="border" variant="primary"/> 
            </div>
            <BottomBar/>
            </>
        ) 
    }

    return (
        <>
        <Stack id='second-window' className={`${className} second-window-style`} gap={gap}>
            {children}
        </Stack>
        <BottomBar/>
        </>
    )
}

export default SecondWindow;