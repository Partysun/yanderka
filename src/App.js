import React, { Component } from 'react';
import './App.css';
import './button.css';

class App extends Component {
  render() {
    return (
      <div className='app'>
        <div className='app-inner'>
          <section className='streamlabs-settings'>                                                            
            <header>                                                                            
              <div className='copy'>                                                            
                <h2>Настройки Streamlabs.com</h2>                                                            
              </div>                                                                            
            </header>                                                                           
            <main>                                                                              
              <button                                                                         
                className='btn-primary'                                                       
                style={{'display': 'flex', 'alignItems': 'center'}}
                onClick={() => console.log('connection')}>                                       
                Подключить Streamlabs.com
                <img 
                  style={{'marginLeft': '1em'}}
                  src='https://cdn-images-1.medium.com/fit/c/25/25/1*XhBKvE_pXEEM2pVt2b5jSg.png' alt='логотип streamlabs '
                />
              </button>
            </main>                                                                             
          </section>      
          <br />
          <section className='streamlabs-settings'>                                                            
            <header>                                                                            
              <div className='copy'>                                                            
                <h2>Настройки Yandex.Денег</h2>                                                            
              </div>                                                                            
            </header>                                                                           
            <main>                                                                              
              <button                                                                         
                className='btn-primary'                                                       
                style={{'display': 'flex', 'alignItems': 'center'}}
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

export default App;
