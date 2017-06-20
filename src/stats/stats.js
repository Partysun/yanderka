import React from 'react';
import numeral from 'numeral';
import DonationsList from './donations-list.js';
import { Merge } from 'animate-components';
import { fadeIn, slideUp } from 'animate-keyframes';
import './stats.css';

const DonationStatsLabel = (props) => (
 <Merge
   one={{ name: fadeIn, duration: '0.3s', timingFunction: 'ease-in' }}
   two={{ name: slideUp, duration: '0.5s', timingFunction: 'ease-out' }}
   as='p'
 >
   {props.children}
 </Merge>
)

const Stats = ({donations}) => (
  <div className='app-stats'>
    <section className='donations-stats'>                                                            
      { donations.statsLoading 
      ? <main className='donations-stats-inner'>                                                                              
          <div>
            <strong>За всё время</strong>
            0 руб.
          </div>
          <div>
            <strong>За неделю</strong>
            0 руб.
          </div>
          <div>
            <strong>За день</strong>
            0 руб.
          </div>
        </main>
      : <main className='donations-stats-inner'>                                                                              
          <div>
            <strong>За всё время</strong>
            <DonationStatsLabel>
            {numeral(donations.balance).format('0,0.00')} руб.
            </DonationStatsLabel>
          </div>
          <div>
            <strong>За неделю</strong>
            <DonationStatsLabel>
            {numeral(donations.week).format('0,0.00')} руб.
            </DonationStatsLabel>
          </div>
          <div>
            <strong>За день</strong>
            <DonationStatsLabel>
            {numeral(donations.day).format('0,0.00')} руб.
            </DonationStatsLabel>
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
