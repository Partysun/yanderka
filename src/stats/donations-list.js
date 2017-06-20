import React from 'react';
import moment from 'moment';
import 'moment/locale/ru.js';
import './donations-list.css';
import { FadeIn } from 'animate-components';
moment.locale('ru');

const offsetTime = (timeStr) => {
  return moment(timeStr).fromNow();
};

const DonationItem = ({donation, index}) => (
  <FadeIn duration='1s' timingFunction='ease-in' as='div'>
    <div className='donations-item'>
      <div className='donations-item-index'>{index + 1}</div>
      <div className='donations-item-detail'>
        <div className='donations-item-detail-amount'>{donation.amount} руб.</div>
        <div>{donation.nickname} | {donation.email}</div>
      </div>
      <div className='passedTime'>{offsetTime(donation.datetime)}</div>
    </div>
  </FadeIn>
)


const DonationsList = ({donations}) => {
  return (
    <div className='donations-list'>
      { donations.loading ? 'Загрузка' : 
        Object.keys(donations.items).reverse().slice(0, 10).map((key, index) => (
          <DonationItem
            key={key}
            index={index}
            donation={donations.items[key]} />
        ))
      }
    </div>
  )
}

export default DonationsList;
