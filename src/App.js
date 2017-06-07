import React, { Component } from 'react';
import { branch } from 'baobab-react/higher-order';   
import signals from './signals.js';
import './App.css';
import './button.css';

class App extends Component {

  componentWillMount() {
    signals.emit('user:watch');  
  }

  componentWillUnmount() {
    signals.emit('user:off');  
  }

  render() {
    const { user } = this.props;
    return (
      <div className='app'>
        <div className='app-inner'>
          <section className='profile-settings'>                                                            
            <header>                                                                            
              <div className='copy'>                                                            
                <h2>Профиль</h2>                                                            
              </div>                                                                            
              <div className='actions'>
                <button                                                                         
                  className='btn-primary'                                                       
                  style={{'display': 'flex', 'alignItems': 'center'}}
                  onClick={() => signals.emit('user:logout')}>                                       
                  Выйти
                </button>
              </div>
            </header>                                                                           
            <main>                                                                              
              Электронная почта - {user.email}
            </main>                                                                             
          </section>      
          <br />
          <section className='streamlabs-settings'>                                                            
            <header>                                                                            
              <div className='copy'>                                                            
                <h2>Настройки Streamlabs.com</h2>                                                            
              </div>                                                                            
            </header>                                                                           
            <main>                                                                              
              <button                                                                         
                className='btn-primary'                                                       
                style={{'display': 'flex', 'alignItems': 'center'}}
                onClick={() => console.log('connection')}>                                       
                Подключить Streamlabs.com
                <img 
                  style={{'marginLeft': '1em'}}
                  src='https://cdn-images-1.medium.com/fit/c/25/25/1*XhBKvE_pXEEM2pVt2b5jSg.png' alt='логотип streamlabs '
                />
              </button>
            </main>                                                                             
          </section>      
          <br />
          <section className='yandex-settings'>                                                            
            <header>                                                                            
              <div className='copy'>                                                            
                <h2>Настройки Yandex.Денег</h2>                                                            
              </div>                                                                            
            </header>                                                                           
            <main>                                                                              
              <button                                                                         
                className='btn-primary'                                                       
                style={{'display': 'flex', 'alignItems': 'center'}}
                onClick={() => console.log('connection')}>                                       
                Подключить Yandex Кошелёк
              </button>
            </main>                                                                             
          </section>
        </div>
      </div>
    );
  }
}

export default branch({                                                                  
  user: ['user'],                                                                           
}, App);  
