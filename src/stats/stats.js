import React from 'react';
import numeral from 'numeral';
import DonationsList from './donations-list.js';
import './stats.css';

const Stats = ({donations}) => (
  <div className='app-stats'>
    <section className='donations-stats'>                                                            
      { donations.statsLoading 
      ? <main>Загрузка статистики...</main>
      : <main className='donations-stats-inner'>                                                                              
          <div>
            <strong>За всё время</strong>
            {numeral(donations.balance).format('0,0.00')} руб.
          </div>
          <div>
            <strong>За неделю</strong>
            {numeral(donations.week).format('0,0.00')} руб.
          </div>
          <div>
            <strong>За день</strong>
            {numeral(donations.day).format('0,0.00')} руб.
          </div>
        </main> }
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
  </div>
)

export default Stats;
