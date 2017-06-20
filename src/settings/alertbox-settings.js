import React from 'react';
import signals from './../signals.js';

const AlertboxSettings = ({user}) => (
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
)

export default AlertboxSettings;
