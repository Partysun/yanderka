import React, {Component} from 'react';
import { 
  Route,
  Redirect,
} from 'react-router-dom';
import AlertboxSettings from './alertbox-settings.js';
import Yamoney from './yamoney.js';
import signals from './../signals.js';

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

const Settings = ({user, ui}) => (
  <div>
    <AlertboxSettings user={user} />
    <br />
    <Yamoney ui={ui} user={user} />
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
  </div>
)

export default Settings;
