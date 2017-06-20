import React, { Component } from 'react';
import { branch } from 'baobab-react/higher-order';   
import { 
  Route,
  Redirect,
  NavLink as Link
} from 'react-router-dom';
import { 
  pure,
  compose,
  lifecycle
} from 'recompose';
import signals from './signals.js';
import Yamoney from './settings/yamoney.js';
import Stats from './stats/stats.js';
import './App.css';
import './button.css';
import './streamlab.actions.js';
import './yamoney.actions.js';
import './donations.actions.js';
import './alertbox.actions.js';
import AlertboxSettings from './settings/alertbox-settings.js';

const AppNavigation = ({user}) => (
  <div className='app-navigation'>
    <Link 
      activeClassName='selected'
      exact
      to='/'>
      Статистика
    </Link>
    <Link 
      activeClassName='selected'
      exact
      to='/settings'>
      Настройки
    </Link>
  </div>
)

const AppHeader = ({user}) => (
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
)

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

  render() {
    const { user, donations, ui } = this.props;
    return (
      <div className='app'>
        <div className='app-inner'>
          <AppNavigation />
          <AppHeader user={user} />
          <br />
          <Route                                                                              
            path='/'                                                                     
            exact
            render={() => (
              <Stats donations={donations} />
            )}
          />
            <Route                                                                              
              path='/settings'                                                                     
              exact
              render={() => (
                <div>
                  <AlertboxSettings user={user} />
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
              )}
            />
        </div>
      </div>
    );
  }
}

const enhance = compose(
  pure,
  branch({                                                                  
    user: ['user'],                                                                           
    donations: ['donations'],                                                                           
    ui: ['app', 'ui']
  }),
  lifecycle({
    componentDidMount() {
      signals.emit('user:watch');  
      signals.emit('donations:get', {page: 1, perPage: 10});  
      signals.emit('donations:getStats');  
    },
    componentWillUnmount() {
      signals.emit('user:off');  
    }
  })
);

export default enhance(App);  
