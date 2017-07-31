import React, { Component } from 'react';
import { Route, Redirect, Link } from 'react-router-dom';
import signals from './../signals.js';

class YamoneyOAuth extends Component {

  componentDidMount() {
    alert('yamoney auth');
    const { location } = this.props;
    signals.emit('yamoney:connect:saveToken', location.search);
  }

  render() {
    if (this.props.tokenSaved) {
      return (                                                                              
        <Redirect to='/dashboard' />                                                              
      )
    }
    return (
      <h2>
        Настраиваем Yandex Money...
      </h2>
    )
  }
}

const Yamoney = ({user, ui}) => {
  return (
    <section className='yandex-settings'>                                                            
      <header>                                                                            
        <div className='copy'>                                                            
          <h2>Настройки Yandex.Денег</h2>                                                            
        </div>                                                                            
        {!ui.yamoney.tokenSaved &&
        <div className='actions'>                                                            
          <span className='label '>Не подключен</span>
        </div>                                                                            
        }
        {ui.yamoney.tokenSaved && ui.yamoney.notifyTested &&
        <div className='actions'>                                                            
          <span className='label label-success'>Подключен</span>
        </div>                                                                            
        }
        {ui.yamoney.tokenSaved && !ui.yamoney.notifyTested &&
        <div className='actions'>                                                            
          <span className='label label-warning'>В процессе</span>
        </div>                                                                            
        }
      </header>                                                                           
      <main>                                                                              
        {ui.yamoney.tokenSaved || 
        <button                                                                         
          className='btn-primary'                                                       
          onClick={() => signals.emit('yamoney:connect')}>                                       
          Подключить Yandex Кошелёк
        </button>}
        {ui.yamoney.tokenSaved && ui.yamoney.notifyTested &&
          <div>
            <small>Яндекс Деньги настроены! И теперь если, кто то сделает донат, то мы сообщим об этом вам.</small>
            <br />
            <Link to={`/donation/${user.uid}`}>
              Персональная страница донатов
            </Link>
          </div>
        }
        {ui.yamoney.tokenSaved && !ui.yamoney.notifyTested && 
          <div>
            <p>Осталось совсем чуть чуть ;)</p>
            <p>Настроим http уведомления о платежах в вашем Yandex кошельке.</p>
            <p>Для этого скопируйте ссылку</p>
              <input 
                className='notification-link'
                type='text'
                readOnly
                onFocus={event => event.target.select()}
                value={`https://us-central1-yanderka-f39f7.cloudfunctions.net/hooks/${user.hook_token}`} />
            <p>и добавьте её в настройке кошелька &nbsp;
              <a 
                href='https://money.yandex.ru/myservices/online.xml'
                rel='noopener noreferrer'
                target='_blank'>
                по этой ссылке
              </a>            
            </p>
            <hr />
            <small>{ui.yamoney.notifyTested ? 'Уведомления настроены!' : 'Ждём тестовое уведомление...'}</small>
          </div>}
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
