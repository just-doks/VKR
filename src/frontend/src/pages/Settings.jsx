import { useState } from "react";
import { observer } from "mobx-react-lite";

import MainWindow from "#components/containers/MainWindow/MainWindow.jsx";
import TopBar from "#components/bars/TopBar";
import BigButton from "#components/buttons/BigButton";
import { useAuth } from "#hooks/useAuth.jsx";
import { isUserExist } from "#http/userAPI.js";
import { resetProxy } from "../http/proxyAPI.js";
import UserModal from "#components/modals/UserModal";

const Settings = observer ( () => {
    const { user, setUser, logout } = useAuth();
    const [userModalVisible, setUserModalVisible] = useState(false)

    function handleUpdateUser(name, password) {
        updateUser(user.id, name, password)
            .then(data => {
                setUser(data)
            })
            .catch(err => console.log(err.message))
    }

    async function handleUpdateUserCondition(name) {
        const isExist = await isUserExist(name);
        return !isExist;
    }


    const handleResetClick = async () => {
        resetProxy()
            .catch(err => console.log(err.message))
            .finally(() => {
                localStorage.removeItem('token')
                logout()
            })
        
    }

    const logOut = () => {
        localStorage.removeItem('token')
        logout()
    }

    return (
        <div>
            <TopBar title="Настройки"/>
            <MainWindow className={'px-3'}>
                <h5 className="my-2">Имя пользователя:</h5>
                <h1 className="mx-1 mb-3">{user.name}</h1>
                <BigButton 
                    className={'mb-2'}
                    onClick={() => setUserModalVisible(true)}>
                    <label style={{fontSize: '18px'}}>Изменить учетные данные</label>
                </BigButton>
                <hr/>
                {user.role === "ADMIN" &&
                    <BigButton className={'my-2'}
                        onClick={handleResetClick}>
                        <label style={{fontSize: '18px'}}>Сбросить систему</label>
                    </BigButton>
                }
                <BigButton className={'my-2'}
                    onClick={logOut}>
                    <label style={{fontSize: '18px'}}>Выйти</label>
                </BigButton>
            </MainWindow>
            <UserModal
                title='Учетные данные'
                userName={user.name}
                onSave={handleUpdateUser}
                saveConditionAsync={handleUpdateUserCondition}
                show={userModalVisible}
                onHide={() => setUserModalVisible(false)}/>
        </div>
    )
})

export default Settings;