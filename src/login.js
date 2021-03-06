import React from 'react';
import { branch } from 'baobab-react/higher-order';   
import { 
  Redirect,
} from 'react-router-dom';
import Spinner from 'react-spinkit';
import signals from './signals.js';

const Login = ({user, ui}) => {
  const { pending } = ui;
  if (user.loggedin) {                                                                  
    return (                                                                              
      <Redirect to={'/dashboard'} />                                                              
    )                                                                                     
  }     

  return (
    <div className='app-loader'>
      <div className='app-loader-inner login-form'>
        <h2>Войти в панель управления</h2>
        <small>Яндэра поможет заработать немного деньжат на стримах!</small>
        {pending 
        ? <Spinner name="double-bounce" /> 
        :
          <button
            className='btn-primary'
            onClick={() => signals.emit('user:auth')} >
            Войти через Google
          </button>
        }
      </div>
    </div>
  )
}

export default branch({                                                                  
  ui: ['app', 'ui', 'login'],                                                                           
}, Login);
