import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

import Stack from 'react-bootstrap/Stack';

import '#css/Manage.css';
import TopBar from "#components/bars/TopBar";
import UserCard from '#components/cards/UserCard';
import BigButton from '#components/buttons/BigButton';
import { MANAGE_ROUTE, USER_ROUTE } from '#utils/constants';
import MainWindow from '#components/containers/MainWindow/MainWindow.jsx';
import SmallButton from '#components/buttons/SmallButton';
import UserModal from '#components/modals/UserModal';

import { fetchUsers, createUser, fetchGlobal, isUserExist } from '#http/userAPI';

const Manage = function() {
    
    const navigate = useNavigate()

    const [users, setUsers] = useState([])
    const [userModalVisible, setUserModalVisible] = useState(false)
    const [global, setGlobal] = useState({})

    useEffect(() => {
        fetchUsers()
            .then(data => setUsers(data))
        fetchGlobal()
            .then(data => setGlobal(data))
    }, [])

    const handleAddUser = (name, password) => {
        createUser(name, password)
            .then(data => {
                setUsers([...users, data])
            })
            .catch(error => console.log(error))
    }


    const handleAddUserCondition = async (uname) => {
        const isExist = await isUserExist(uname);
        return !isExist;
    }


    const handleGlobalOpen = () => {
        navigate(USER_ROUTE, {state: {
            title: "Глобальные настройки доступа",
            user: global,
            prevPage: MANAGE_ROUTE}})
    }
    const handleUserOpen = (user) => () => {
        navigate(USER_ROUTE, {state:{
            title: 'Настройки пользователя',
            user: user,
            prevPage: MANAGE_ROUTE
        }})
    }

    return (
        <>
            <TopBar title="Управление"/>
            <MainWindow className='mx-3 py-3'>
                <BigButton onClick={handleGlobalOpen}>
                    <label style={{fontSize: '18px'}}>Глобальные настройки доступа</label>
                </BigButton>
                <hr className='mt-3 mb-3'/>
                <Stack direction="horizontal" className="justify-content-between mb-3 align-content-center">
                    <h3 className="ms-0 mb-1">Пользователи</h3>
                    <SmallButton 
                        className={'users-add-btn py-1'} 
                        borderRadius='20px'
                        onClick={() => setUserModalVisible(true)}>
                        <label style={{fontSize: '18px', lineHeight: '16px'}}>Добавить</label>
                    </SmallButton>
                </Stack>
                {users.map(user => 
                    <UserCard key={user.id} className='mb-3' name={user.name}
                            onClick={handleUserOpen(user)}/>
                )}
            </MainWindow>
            <UserModal
                title='Новый пользователь'
                saveConditionAsync={handleAddUserCondition}
                onSave={handleAddUser}
                passRequired
                show={userModalVisible}
                onHide={() => setUserModalVisible(false)}/>
        </>
    )
}

export default Manage;