import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const UserModal = (props) => {
     const { userName = '', title, saveCondition = () => (true), saveConditionAsync,
        onSave = () => {}, saveLabel, passRequired = false, show, onHide } = props;

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isUsernameInvalid, setIsUsernameInvalid] = useState(false)
    const [isPasswordValid, setIsPasswordValid] = useState(false)


    useEffect(() => {
        setUsername(userName)
        setPassword('')
        setIsUsernameInvalid(false)
        setIsPasswordValid(false)
    }, [show])

    const handleSave = () => {
        if (saveConditionAsync) {
            saveConditionAsync(username, password)
            .then(result => {
                console.log(result);
                if (result) {
                    onSave(username, password);
                    onHide();
                } else {
                    if (passRequired) setIsPasswordValid(true);
                    setIsUsernameInvalid(true);
                }
            })
            .catch(err => console.log(err))
        } else {
            if (saveCondition(username, password)) {
                onSave(username, password)
                onHide()
            } else {
                if (passRequired) setIsPasswordValid(true);
                setIsUsernameInvalid(true)
            }
        }
    }

    const handleKeyEnterDown = (e) => {
        if (e.keyCode === 13) {
            try {
                e.preventDefault ? e.preventDefault() : (e.returnValue = false);
            } catch(err){
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
                <Form noValidate>
                    <Form.Group className='mb-1' controlId='validation_form_1'>
                        <Form.Label>Имя пользователя</Form.Label>
                        <Form.Control
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder={"Введите имя пользователя"}
                            onKeyDown={e => handleKeyEnterDown(e)}
                            isInvalid={isUsernameInvalid}
                        />
                        <Form.Control.Feedback type="invalid">
                            Такое имя пользователя уже есть
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId='validation_form_2'>
                        <Form.Label>Пароль</Form.Label>
                        <Form.Control
                            type='password'
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder={"Введите пароль"}
                            onKeyDown={e => handleKeyEnterDown(e)}
                            required
                            isValid={isPasswordValid}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className='d-flex justify-content-between'>
                <Button 
                    variant="secondary"
                    onClick={onHide}>
                    Отмена
                </Button>
                <Button 
                    variant="primary"
                    onClick={handleSave}
                    {...( (username.length < 3 || (passRequired && password.length < 4))
                     ? {disabled: true} : {} )
                    }>
                    {saveLabel ? saveLabel : 'Сохранить'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UserModal;