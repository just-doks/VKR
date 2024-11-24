import React from 'react';
import Switch from 'react-switch';

import './ToggleSwitch.css';
import {ReactComponent as LineSVG} from '#svg/linev.svg';
import {ReactComponent as CircleSVG} from '#svg/circle.svg';

const ToggleSwitch = ({checked, onChange}) => {

    return (
        <Switch checked={checked} 
                uncheckedIcon={
                    <div className='icon-box'>
                        <CircleSVG className='off-circle'/>
                    </div>}
                checkedIcon={
                    <div className='icon-box'>
                        <LineSVG className='on-line'/>
                    </div>}
                onChange={onChange} 
                handleDiameter={24} 
                onColor="#1cbc4c"
                offColor="#e6e6e6" 
                activeBoxShadow='0'
        />
    )
}

export default ToggleSwitch;