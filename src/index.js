import React from 'react';
import ReactDOM from 'react-dom';
import { 
  BrowserRouter as Router,
  Redirect,
  Route
} from 'react-router-dom';
import { root } from 'baobab-react/higher-order';                                           
import { branch } from 'baobab-react/higher-order';   
import registerServiceWorker from './registerServiceWorker';
import App from './App';
import Login from './login.js';
import Spinner from 'react-spinkit';
import cloud from './cloud.js';
import state from './state.js';
import './user.actions.js';
import './index.css';

const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    cloud.auth().currentUser ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
);

const NoMatch = () => (
  <div className='app-loader'>
    <div className='app-loader-inner'>
      <h2>Нет такой страницы</h2>
    </div>
  </div>
)

const Index = ({user}) => {
  if (user.loading) {
    return (
      <div className='app-loader'>
        <div className='app-loader-inner'>
          <Spinner className='app-spinner' name='three-bounce' />
          <h2>Загрузка...</h2>
        </div>
      </div>
    ); 
  }

  return (
    <Router>
      <div>
        <Route                                                                              
          path='/login'                                                                     
          exact
          render={props => (
            <Login user={user} />
          )} />  
        <ProtectedRoute                                                                              
          path='/'                                                                     
          component={App} />
        <ProtectedRoute 
          component={NoMatch} />
      </div>
    </Router>
  )
}

const BranchedIndex = branch({                                                                  
  user: ['user'],                                                                           
  notifications: ['notifications']                                                          
}, Index);  

const RootedIndex = root(state, BranchedIndex);

ReactDOM.render(<RootedIndex />, document.getElementById('root'));
registerServiceWorker();
