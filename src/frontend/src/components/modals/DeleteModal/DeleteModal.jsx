import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const DeleteModal = ({ onDelete, show, onHide }) => {

    return (
        <Modal show={show} onHide={onHide} className='mt-5'>
            <Modal.Header closeButton>
                <Modal.Title>Подтвердить удаление?</Modal.Title>
            </Modal.Header>
            <Modal.Footer className='d-flex justify-content-between'>
                <Button 
                    variant="secondary"
                    onClick={onHide}>
                    Отмена
                </Button>
                <Button 
                    variant="danger"
                    onClick={onDelete}>
                    Удалить
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteModal;