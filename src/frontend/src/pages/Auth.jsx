import { useState } from 'react'
import { useNavigate } from 'react-router';
import { observer } from 'mobx-react-lite';
import Form from 'react-bootstrap/Form'

import '../css/Auth.css';
import BigButton from '#components/buttons/BigButton';
import { loginUser } from '#http/userAPI';
import { useAuth } from "#hooks/useAuth";

const Auth = observer (() => {
    const navigate = useNavigate()
    const [user, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { login } = useAuth();


    const handleClick = async () => {
        console.log("name: " + user);
        console.log("passwd: " + password);
        const data = await loginUser(user, password)
        await login(data)
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
        <div className='auth-window'>
            <h1 className='proxy-title'>Doks' Proxy</h1>

                <div className='login-card'>
                    <Form.Group className='mb-2'>
                        <Form.Label>Имя пользователя</Form.Label>
                        <Form.Control
                            value={user}
                            onChange={e => setUsername(e.target.value)}
                            placeholder={"Введите имя пользователя"}
                            onKeyDown={e => handleKeyEnterDown(e)}
                        />
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Label>Пароль</Form.Label>
                        <Form.Control
                            type='password'
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder={"Введите пароль"}
                            onKeyDown={e => handleKeyEnterDown(e)}
                        />
                    </Form.Group>
                    
                       <BigButton className={'mt-3 mb-1'}
                            onClick={handleClick}>
                            <label style={{fontSize: '20px'}}>Войти</label>
                        </BigButton>                
                </div>

        </div>
    )

})

export default Auth;