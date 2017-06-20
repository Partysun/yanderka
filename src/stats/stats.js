import React from 'react';
import numeral from 'numeral';
import DonationsList from './donations-list.js';

const Stats = ({donations}) => (
  <div className='app-stats'>
    <section className='donations-stats'>                                                            
      { donations.statsLoading 
      ? <main>Загрузка статистики...</main>
      : <main>                                                                              
        Баланс - {numeral(donations.balance).format('0,0.00')} руб.
        <br />
        За неделю - {numeral(donations.week).format('0,0.00')} руб.
        <br />
        За день - {numeral(donations.day).format('0,0.00')} руб.
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
