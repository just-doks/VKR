import { useRef } from 'react';

import './IPAddressForm.css';

function IPAddressForm(props) {
    const { className, address, setAddress } = props;

    const ipRef = [];
    ipRef[0] = useRef(null)
    ipRef[1] = useRef(null)
    ipRef[2] = useRef(null)
    ipRef[3] = useRef(null)

    const handleInput = (event, index) => {
        if (event.target.value.match(/^0[0-9]+/)) return;
        if (event.target.value >= 0 && event.target.value < 256) {
            setAddress(address.map((addr, ind) => {
                if (ind === index) {
                    return event.target.value;
                } else 
                    return addr;
            }))
        } else 
        if (index < 3 && event.target.value > 255) {
            const remainder = event.target.value.replace(address[index], '');
            const nextValue = ipRef[index + 1].current.value + remainder;
            if (nextValue < 256) {
                setAddress(address.map((addr, ind) => {
                    if (ind === index + 1) {
                        return nextValue;
                    } else 
                        return addr;
                }))
            }
            ipRef[index + 1].current.focus();
            return;
        }
    };

    const handleOnKey = (e, ref) => {
        if (e.keyCode === 13)
            ref.current.focus();
    }

    return(
        <form className={'ip-address-form' + (className ? ` ${className}` : '')}>
            <label onKeyDown={e => handleOnKey(e, ipRef[1])}>
                <input  ref={ipRef[0]} 
                        type='number' 
                        inputMode='numeric' 
                        maxLength={3} 
                        placeholder='255' 
                        value={address[0]} 
                        onChange={e => handleInput(e, 0)}
                        autoFocus/>
            </label>
            <span>.</span>
            <label onKeyDown={e => handleOnKey(e, ipRef[2])}>
                <input  ref={ipRef[1]} 
                        type='number' 
                        inputMode='numeric' 
                        maxLength={3} 
                        placeholder='255' 
                        value={address[1]} 
                        onChange={e => handleInput(e, 1)}/>
            </label>
            <span>.</span>
            <label onKeyDown={e => handleOnKey(e, ipRef[3])}>
                <input  ref={ipRef[2]} 
                        type='number' 
                        inputMode='numeric' 
                        maxLength={3} 
                        placeholder='255' 
                        value={address[2]} 
                        onChange={e => handleInput(e, 2)}/>
            </label>
            <span>.</span>
            <label>
                <input  ref={ipRef[3]} 
                        type='number' 
                        inputMode='numeric' 
                        maxLength={3} 
                        placeholder='255' 
                        value={address[3]} 
                        onChange={e => handleInput(e, 3)}/>
            </label>
        </form>
    );
};

export default IPAddressForm;