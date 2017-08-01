import React from 'react';
import ReactDOM from 'react-dom';
import { 
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import { root } from 'baobab-react/higher-order';                                           
import { branch } from 'baobab-react/higher-order';   
import registerServiceWorker from './registerServiceWorker';
import App from './App';
import Login from './login.js';
import Spinner from 'react-spinkit';
import cloud from './cloud.js';
import state from './state.js';
import Donation from './donation.js';
import Landing from './landing.js'
import Alertbox from './alertbox.js';
import YamoneyOAuth from './yandexmoney-oauth.js';
import StreamlabsOauth from './streamlabs-oauth.js';
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
  const isAlertbox = /alertbox/.test(window.location.pathname);
  if (isAlertbox) {
    return (
      <Router>
        <Route                                                                              
          path='/alertbox/:token'                                                                     
          component={Alertbox}
        />
      </Router>
    );
  }

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
  //console.log(window.location.search); 

  return (
    <Router>
      <div>
        <Route                                                                              
          path='/login'                                                                     
          exact
          render={props => (
            <Login user={user} />
          )} />  
        <Switch>
          <Route                                                                              
            path='/'                                                                     
            exact
            component={Landing}
          />
          <Route                                                                              
            path='/donation/:user'                                                                     
            component={Donation}
          />
          <Route                                                                              
            path='/alertbox/:token'                                                                     
            component={Alertbox}
          />
          <ProtectedRoute                                                                              
            path='/dashboard'                                                                     
            component={App} />
          <ProtectedRoute
            path='/oauth/yandexmoney'
            component={YamoneyOAuth} />
          <ProtectedRoute 
            path='/oauth/streamlabs'
            component={StreamlabsOauth} />
          <Route 
            component={NoMatch} />
        </Switch>
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
