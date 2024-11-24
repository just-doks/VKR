import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import clientStore from './store/clientStore';
import App from './App';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Context.Provider value={{
      client: new clientStore()
    }}>
      <BrowserRouter>
          <App />
      </BrowserRouter>
      
    </Context.Provider>
  </React.StrictMode>
    
  
);
