import React, { Component } from 'react';
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
      <Redirect to={'/'} />                                                              
    )                                                                                     
  }     

  return (
    <div className='app-loader'>
      <div className='app-loader-inner login-form'>
        <h2>Войти</h2>
        <small>Для регистрации или входа, напишите ваш адрес электронной почты</small>
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
