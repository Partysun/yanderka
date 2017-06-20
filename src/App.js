import React, { Component } from 'react';
import { branch } from 'baobab-react/higher-order';   
import { Route, Redirect } from 'react-router-dom';
import numeral from 'numeral';
import signals from './signals.js';
import Yamoney from './settings/yamoney.js';
import DonationsList from './donations-list.js';
import './App.css';
import './button.css';
import './streamlab.actions.js';
import './yamoney.actions.js';
import './donations.actions.js';
import './alertbox.actions.js';

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
    signals.emit('donations:get', {page: 1, perPage: 10});  
    signals.emit('donations:getStats');  
  }

  componentWillUnmount() {
    signals.emit('user:off');  
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (Object.is(nextProps.user, this.props.user)
      && Object.is(nextProps.ui, this.props.ui) 
        && Object.is(nextProps.donations, this.props.donations))
      {
      return false;  
    }
    return true;
  }

  render() {
    const { user, donations, ui } = this.props;
    return (
      <div className='app'>
        <div className='app-inner'>
          <section className='profile-settings'>                                                            
            <header>                                                                            
              <div className='copy'>                                                            
                <div className='avatar'>
                  <img src={user.photoURL} alt='avatar' />
                  <h2>{user.displayName}</h2>
                </div>
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
          </section>      
          <br />
          <section className='donations-stats'>                                                            
             { donations.statsLoading ? <main>Загрузка статистики...</main> : 
            <main>                                                                              
              Баланс - {numeral(donations.balance).format('0,0.00')} руб.
              <br />
              За неделю - {numeral(donations.week).format('0,0.00')} руб.
              <br />
              За день - {numeral(donations.day).format('0,0.00')} руб.
            </main>                                                                             
              }
          </section>      
          <br />
          <section className='donations-last'>                                                            
            <header>                                                                            
              <div className='copy'>                                                            
                <h2>Крайние донаты</h2>                                                            
              </div>                                                                            
            </header>                                                                           
            <main>                                                                              
              <DonationsList donations={donations} />
            </main>                                                                             
          </section>      
          <br />
          <section className='alertbox-settings'>                                                            
            <header>                                                                            
              <div className='copy'>                                                            
                <h2>Окно оповещений о донатах для видеопотока</h2>                                                            
              </div>                                                                            
            </header>                                                                           
            <main>                                                                              
              <div className='alertbox-link'>
                <input 
                  className='notification-link'
                  type='text'
                  readOnly
                  onFocus={event => event.target.select()}
                  value={`https://yanderka.ru/alertbox/${user.uid}`} />
                <button                                                                         
                  className='btn-action'                                                       
                  onClick={() => window.open(`/alertbox/${user.uid}`, 'newwindow', 'width=300, height=250')}> 
                  Открыть окно оповещений
                </button>
              </div>
              <br />
              <button                                                                         
                className='btn-secondary'                                                       
                onClick={() => signals.emit('alertbox:firetest')}> 
                Отправить тестовое сообщение
              </button>
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
          <Yamoney ui={ui} user={user} />
        </div>
      </div>
    );
  }
}

export default branch({                                                                  
  user: ['user'],                                                                           
  donations: ['donations'],                                                                           
  ui: ['app', 'ui']
}, App);  
