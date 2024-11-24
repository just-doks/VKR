import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import SyncLoader from 'react-spinners/SyncLoader.js'

import AppRouter from './components/AppRouter.jsx';
import './App.css';
import { checkAuth } from './http/userAPI.js';
import { AuthProvider } from './hooks/useAuth.jsx';
import { useLocalStorage } from "./hooks/useLocalStorage.jsx";

const App = observer (() => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useLocalStorage("user", null);

    useEffect(() => {
        checkAuth()
            .then(data => {
                setUser(data)
            })
            .catch(err => {
                setUser(null);
            })
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return (
          <div className='load-container'>
            <SyncLoader color='white' className={'align-self-center'} speedMultiplier={0.75} margin={4}/>
          </div>
            
        )
    }
    return (
        <AuthProvider>
          <AppRouter/>
        </AuthProvider>
    );
})

export default App;
