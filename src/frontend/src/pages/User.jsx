import Stack from "react-bootstrap/Stack";
import { useNavigate, useLocation } from "react-router";
import { Navigate } from "react-router";
import { useState, useEffect } from "react";

import '#css/Rules.css';
import BigButton from "#components/buttons/BigButton";
import TopBar from "#components/bars/TopBar";
import SmallButton from "#components/buttons/SmallButton";
import SecondWindow from "#components/containers/SecondWindow/SecondWindow.jsx";
import ListModal from "#components/modals/ListModal";
import DeleteModal from "#components/modals/DeleteModal";

import { USER_ROUTE, HOME_ROUTE, LIST_ROUTE, RULE_ROUTE } from "#utils/constants.js";
import {fetchLists, createLists} from '#http/listAPI.js';
import { deleteUser, updateUser, isUserExist } from "#http/userAPI.js";
import UserModal from "#components/modals/UserModal";

const User = function() {
    const navigate = useNavigate()
    const location = useLocation()
    
    const title = location.state?.title ?? '';
    const [user, setUser] = useState(location.state?.user ?? {});
    const previousPage = location.state?.prevPage ?? '';
    const previousState = location.state?.prevState ?? {};
    const [isChanged, setIsChanged] = useState(false)

    // Состояния модальных окон
    const [addModalVisible, setAddModalVisible] = useState(false)
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [userModalVisible, setUserModalVisible] = useState(false)

    /** @type {List[]} */
    const listsEmpty = [];
    const [lists, setLists] = useState(listsEmpty);
    const [newLists, setNewLists] = useState([]);

    useEffect(() => {
        if (!location.state?.user) return;

        fetchLists(user.id)
            .then(data => {
                setLists(data);
            })
            .catch(err => console.log(err.message))
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (!location.state) return;
        
        if (newLists.length !== 0) {
            setIsChanged(true)
        } else if (isChanged) {
            setIsChanged(false)
        }
    }, [newLists, isChanged, location])

    if (!location.state) {
        return (<Navigate to={HOME_ROUTE}/>) 
    }

    // Функции перехода на другие страницы {
    const handleGeneralRuleOpen = () => {
        navigate(RULE_ROUTE, {state:
            {prevPage: USER_ROUTE,
             title: 'Правило доступа пользователя',
             ruleId: user.ruleId,
             prevState: location.state }})
    }
    const handleListOpen = (list) => () => {
        navigate(LIST_ROUTE, {state: {
            prevPage: USER_ROUTE, 
            list: list,
            prevState: location.state }})
    } 
    // }

    const handleSaveClick = async () => {
        if (newLists.length !== 0) {
            createLists(newLists, user.id) 
                .then(data => {
                    setLists(data.lists)
                    setNewLists([])
                })
        }
        setIsChanged(false)
    }

    function addNewList(listname) {
        setNewLists([...newLists, listname])
    }
    function addNewListCondition(listname) {
        const element = lists.find(el => el.name === listname);
        if (element) return false;
        else return true;
    }

    function handleSaveUser(name, password) {
        updateUser(user.id, name, (password !== '' ? password : undefined))
            .then(data => {
                setUser(data)
            })
            .catch(error => console.log(error))
    }

    async function handleSaveUserCondition(uname) {
        const isExist = await isUserExist(uname);
        return !isExist;
    }

    async function handleDeleteUser() {
        deleteUser(user.id)
            .catch(err => console.log(err.message))
            .finally(() => {
                setDeleteModalVisible(false)
                navigate(previousPage, {state: previousState})
            })
        
    }

    return (
        <> 
            <TopBar title={title}
                    backPanel 
                    backTo={previousPage} 
                    prevPageState={previousState} 
                    saveButton={isChanged}
                    onClickSave={handleSaveClick}/>
            <SecondWindow className="mx-3 py-3">
                {user.name && 
                    <Stack>
                        <h3 className="mb-3">{user.name}</h3>
                        <BigButton 
                            className={'mb-2'}
                            onClick={() => setUserModalVisible(true)}>
                            <label style={{fontSize: '18px'}}>Изменить учетные данные</label>
                        </BigButton>
                        <BigButton onClick={() => setDeleteModalVisible(true)}>
                            <label style={{fontSize: '18px'}}>Удалить пользователя</label>
                        </BigButton>
                        <hr/>
                    </Stack>
                }

                <h3 className="mb-2">Правила доступа</h3>

                <BigButton onClick={handleGeneralRuleOpen}>
                    <label style={{fontSize: '18px'}}>Общее правило доступа</label>
                </BigButton>

                <hr className="mt-3 mb-3"/>

                <Stack direction="horizontal" className="justify-content-between mb-3 align-content-center">
                    <h3 className="ms-0 mb-0">Списки правил:</h3>
                    <SmallButton 
                        className={'list-add-btn py-1'} 
                        borderRadius='20px'
                        onClick={() => setAddModalVisible(true)}>
                        <label style={{fontSize: '18px', lineHeight: '16px'}}>Добавить</label>
                    </SmallButton>
                </Stack>

                {lists.map(list => 
                    <BigButton key={list.name} className={'mb-2'}
                               onClick={handleListOpen(list)}>
                        <label style={{fontSize: '18px'}}>{list.name}</label>
                    </BigButton>
                )}
                {newLists.length > 0 && 
                    <h4 className="mb-1">Новые списки:</h4> 
                }
                { newLists.map(list => 
                    <BigButton key={list} className={'mb-2'} disabled>
                        <label style={{fontSize: '18px'}}>{list}</label>
                    </BigButton>
                )}
            </SecondWindow>
            <ListModal 
                title={'Добавить список'}
                saveCondition={addNewListCondition}
                onSave={addNewList}
                show={addModalVisible} 
                onHide={() => setAddModalVisible(false)}/>
            <DeleteModal
                onDelete={handleDeleteUser}
                show={deleteModalVisible}
                onHide={() => setDeleteModalVisible(false)}/>
            <UserModal
                title='Учетные данные'
                userName={user.name}
                onSave={handleSaveUser}
                saveConditionAsync={handleSaveUserCondition}
                show={userModalVisible}
                onHide={() => setUserModalVisible(false)}/>
        </>
    )
}

export default User;