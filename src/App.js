import React from 'react';
import { 
  branch
} from 'baobab-react/higher-order';   
import { 
  Route,
  NavLink as Link
} from 'react-router-dom';
import { 
  pure,
  compose,
  lifecycle
} from 'recompose';
import signals from './signals.js';
import Stats from './stats/stats.js';
import Settings from './settings/settings.js';
import './App.css';
import './button.css';
import './streamlab.actions.js';
import './yamoney.actions.js';
import './donations.actions.js';
import './alertbox.actions.js';

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

const App = ({ user, donations, ui }) => {
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
          <Settings user={user} ui={ui} />
        )}
      />
    </div>
  </div>
  )
};

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
      signals.emit('donations:watch', {page: 1, perPage: 10});  
      signals.emit('donations:getStats');  
    },
    componentWillUnmount() {
      signals.emit('user:off');  
      signals.emit('donations:off');  
    }
  })
);

export default enhance(App);  
