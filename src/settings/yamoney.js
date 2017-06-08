import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import signals from './../signals.js';

class YamoneyOAuth extends Component {

  componentDidMount() {
    const { location } = this.props;
    signals.emit('yamoney:connect:saveToken', location.search);
  }

  render() {
    if (this.props.tokenSaved) {
      return (                                                                              
        <Redirect to='/' />                                                              
      )
    }
    return (
      <h2>
        Настраиваем Yandex Money...
      </h2>
    )
  }
}

const Yamoney = ({ui}) => {
  return (
    <section className='yandex-settings'>                                                            
      <header>                                                                            
        <div className='copy'>                                                            
          <h2>Настройки Yandex.Денег</h2>                                                            
        </div>                                                                            
        {ui.yamoney.tokenSaved &&
        <div className='actions'>                                                            
          <span className='label label-success'>Подключен</span>
        </div>                                                                            
        }
      </header>                                                                           
      <main>                                                                              
        {ui.yamoney.tokenSaved || 
        <button                                                                         
          className='btn-primary'                                                       
          onClick={() => signals.emit('yamoney:connect')}>                                       
          Подключить Yandex Кошелёк
        </button>
        }
        <Route 
          path='/oauth/yandexmoney'
          render={({location}) => (
            <YamoneyOAuth 
              tokenSaved={ui.yamoney.tokenSaved} 
              location={location}
            />
          )}
        />
      </main>                                                                             
    </section>
  )
}

export default Yamoney;
