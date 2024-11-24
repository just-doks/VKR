import { useNavigate } from 'react-router-dom';

import Stack from "react-bootstrap/Stack";

import './MenuButton.css';

const MenuButton = function({Icon, label, toRoute}) {
    const navigate = useNavigate()

    const mouseUp = function() {
        navigate(toRoute)
    }
    return (
        <Stack className="align-items-center menubttn-stack mx-3" 
            onMouseUp={mouseUp}
        >
            <Icon className="menubttn-icon"/>
            <label className="menubttn-label">{label}</label>
        </Stack>
    )
}

export default MenuButton;