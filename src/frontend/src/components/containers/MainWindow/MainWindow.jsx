import Stack from "react-bootstrap/Stack"
import Spinner from "react-bootstrap/Spinner"

import './MainWindow.css'
import BottomBar from "#components/bars/BottomBar";
import {ReactComponent as ErrorSVG} from '#svg/error.svg';

const MainWindow = function(props) {
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
        <Stack className={`${className} main-window-style`} gap={gap}>
            {children}
        </Stack>
        <BottomBar/>
        </>
    )
}

export default MainWindow;
