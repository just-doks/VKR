import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import IPAddressForm from '#components/etc/IPAddressForm';
import DuoButton from '#components/buttons/DuoButton';
import VStack from '#components/containers/VStack';

const AddressModal = (props) => {
    const { title, type, value, show, onHide, 
        saveCondition = () => (true), saveConditionAsync, 
        onSave = () => {}, saveLabel } = props;

    const [addrType, setAddrType] = useState('DOMAIN');
    const [domain, setDomain] = useState('');
    const [ip, setIP] = useState(['','','','']);
    const [isInvalid, setIsInvalid] = useState(false);

    function ipStringToArray(ip) {
        let ipArray = ['','','',''];
        const regexp1 = 
        /^(?:(?:(?:[1-9]??\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(?:[1-9]??\d|1\d\d|2[0-4]\d|25[0-5]))$/;
        if (ip.match(regexp1)) {
            ipArray = ip.split('.');
        } 
        return ipArray;
    }
    function ipArrayToString(ip) {
        return ip.join('.');
    }

    useEffect(() => {
        if (value && type) {
            if (type === 'DOMAIN') {
                setAddrType(type);
                setDomain(value);
                setIP(['','','','']);
            } else
            if (type === 'IP') {
                setAddrType(type);
                setIP(ipStringToArray(value));
                setDomain('');
            }
        } else {
            setAddrType('DOMAIN')
            setDomain('');
            setIP(['','','','']);
        }
        setIsInvalid(false);
    }, [show])

    function handleSave () {
        let address = '';
        if (addrType === 'DOMAIN') {
            address = domain;
        } else 
        if (addrType === 'IP') {
            address = ipArrayToString(ip);
        }

        if (saveConditionAsync) {
            saveConditionAsync(addrType, address)
            .then(result => {
                if (result) {
                    onSave(addrType, address);
                    onHide();
                } else {
                    setIsInvalid(true);
                }
            })
            .catch(err => console.log(err))
        } else {
            if (saveCondition(addrType, address)) {
                onSave(addrType, address)
                onHide()
            } else {
                setIsInvalid(true);
            }
        }
    }

    const handleFiledEnterPress = (e) => () => {
        if (e.keyCode === 13) {
            try{
                e.preventDefault ? e.preventDefault() : (e.returnValue = false);
                handleSave()
            }catch(err){
                console.log(err.message); 
            }
        }
    }

    return (
        <Modal show={show} onHide={onHide} className='mt-5'>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <VStack alignItems='center' gap={'15px'}>
                    <DuoButton
                        width='100%'
                        valueLeft='DOMAIN' 
                        valueRight='IP' 
                        labelLeft='Доменное имя' 
                        labelRight='IP адрес'
                        state={addrType}
                        setState={setAddrType}/>
                    {addrType === 'IP' &&
                    <>
                    <IPAddressForm address={ip} setAddress={setIP}/>
                        {isInvalid && 
                        <p>Такой адрес уже есть в списке</p>}
                    </>
                    }
                    {addrType === 'DOMAIN' &&
                    <Form style={{width: '100%'}}>
                        <Form.Control
                            value={domain}
                            onChange={e => setDomain(e.target.value)}
                            placeholder={"Введите доменное имя"}
                            autoFocus
                            onKeyDown={handleFiledEnterPress}
                            isInvalid={isInvalid}
                        />
                        <Form.Control.Feedback type="invalid">
                            Такой адрес уже есть в списке
                        </Form.Control.Feedback>
                    </Form>
                    }
                </VStack>
            </Modal.Body>
            <Modal.Footer className='d-flex justify-content-between'>
                <Button 
                    variant="secondary"
                    onClick={onHide}>
                    Отмена
                </Button>
                <Button 
                    variant="primary"
                    onClick={handleSave}>
                    Применить
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddressModal;