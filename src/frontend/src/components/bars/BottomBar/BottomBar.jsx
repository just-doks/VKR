import React, { useContext } from "react";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { observer } from "mobx-react-lite";

import './BottomBar.css';
import MenuButton from "#components/buttons/MenuButton";
import {ReactComponent as HomeSVG} from '#svg/home2.svg';
import {ReactComponent as ManageSVG} from '#svg/manage2.svg';
import {ReactComponent as SettingsSVG} from '#svg/settings2.svg';
import { HOME_ROUTE, MANAGE_ROUTE, SETTINGS_ROUTE } from "#utils/constants.js";
import { useAuth } from "#hooks/useAuth.jsx";

const BottomBar = observer( () => {
    const {user} = useAuth()
    return (
        <Navbar className="bottombar-style justify-content-center" fixed="bottom">
            <Container className="bottombar-btns justify-content-between">
                <MenuButton Icon={HomeSVG} label="Главная" toRoute={HOME_ROUTE}/>
                {user.role === 'ADMIN' && 
                    <MenuButton Icon={ManageSVG} label="Управление" toRoute={MANAGE_ROUTE}/>}
                <MenuButton Icon={SettingsSVG} label="Настройки" toRoute={SETTINGS_ROUTE}/>
            </Container>
        </Navbar>
    )
})

export default BottomBar;
