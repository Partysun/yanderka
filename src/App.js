import React, { Component } from 'react';
import { branch } from 'baobab-react/higher-order';   
import { Route, Redirect } from 'react-router-dom';
import signals from './signals.js';
import './App.css';
import './button.css';
import './streamlab.actions.js';

class StreamlabsOauth extends Component {

  componentDidMount() {
    const { location } = this.props;
    signals.emit('user:connect:streamlabs:saveToken', location.search);
  }

  render() {
    if (this.props.tokenSaved) {
      return (                                                                              
        <Redirect to='/' />                                                              
      )
    }
    return (
      <h2>
        Настраиваем Streamlabs...
      </h2>
    )
  }
}

class App extends Component {

  componentWillMount() {
    signals.emit('user:watch');  
  }

  componentWillUnmount() {
    signals.emit('user:off');  
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (Object.is(nextProps.user, this.props.user)
      && Object.is(nextProps.ui, this.props.ui)) {
      return false;  
    }
    return true;
  }

  render() {
    const { user, ui } = this.props;
    console.log('render');
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
              {ui.streamlabs.tokenSaved &&
                <div className='actions'>                                                            
                  <span className='label label-success'>Подключен</span>
                </div>                                                                            
              }
            </header>                                                                           
            <main>                                                                              
              {ui.streamlabs.tokenSaved ? 
                <div>
                  <button                                                                         
                    className='btn-secondary'                                                       
                    onClick={() => signals.emit('streamlabs:alert')}> 
                    Отправить тестовое сообщение
                  </button>
                  &nbsp;&nbsp;
                  <button                                                                         
                    className='btn-secondary'                                                       
                    onClick={() => signals.emit('streamlabs:makeDonation')}> 
                    Отправить тестовый донат
                  </button>
                </div>
              :
              <button                                                                         
                className='btn-primary'                                                       
                style={{'display': 'flex', 'alignItems': 'center'}}
                onClick={() => signals.emit('user:connect:streamlabs')}> 
                Подключить Streamlabs.com
                <img 
                  style={{'marginLeft': '1em'}}
                  src='https://cdn-images-1.medium.com/fit/c/25/25/1*XhBKvE_pXEEM2pVt2b5jSg.png' alt='логотип streamlabs '
                />
              </button>
              }
              <Route 
                path='/oauth/streamlabs'
                render={({location}) => (
                  <StreamlabsOauth 
                    tokenSaved={ui.streamlabs.tokenSaved} 
                    location={location}
                  />
                )}
              />
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
  ui: ['app', 'ui']
}, App);  
