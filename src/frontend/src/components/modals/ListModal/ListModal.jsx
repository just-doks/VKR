import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const ListModal = (props) => {
    const { title, name = '', show, onHide, saveCondition = () => (true), 
        saveConditionAsync, onSave = () => {}, saveLabel } = props;

    const [value, setValue] = useState('')
    const [isInvalid, setIsInvalid] = useState(false)

    useEffect(() => {
        setValue(name)
        setIsInvalid(false)
        // eslint-disable-next-line
    }, [show])


    function handleSave () {
        if (saveConditionAsync) {
            saveConditionAsync(value)
            .then(result => {
                console.log(result);
                if (result) {
                    onSave(value);
                    onHide();
                } else {
                    setIsInvalid(true);
                }
            })
            .catch(err => console.log(err))
        } else {
            if (saveCondition(value)) {
                onSave(value)
                onHide()
            } else {
                setIsInvalid(true);
            }
        }
    }

    const enterSaveLeave = (e) => {
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
                <Form>
                    <Form.Control
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder={"Введите название"}
                        autoFocus
                        onKeyDown={e => enterSaveLeave(e)}
                        isInvalid={isInvalid}
                    />
                    <Form.Control.Feedback type="invalid">
                        Такое имя уже добавлено
                    </Form.Control.Feedback>
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
                    onClick={handleSave}>
                    Применить
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ListModal;