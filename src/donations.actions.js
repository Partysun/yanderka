import state from './state.js';
import signals from './signals.js';
import cloud from './cloud.js';
import numeral from 'numeral';
import moment from 'moment';

const donationsCursor = state.select('donations');
donationsCursor.select('loading').set(true);

const createFullBalance = (amount, datetime) => {
  const prevBalance = donationsCursor.get('balance');
  donationsCursor.set('balance', amount + prevBalance);
}

const createWeekBalance = (amount, datetime) => {
  if (datetime && moment().diff(moment(datetime), 'days') < 7) {
    const prevBalance = donationsCursor.get('week');
    donationsCursor.set('week', amount + prevBalance);
  }
}

const createDayBalance = (amount, datetime) => {
  if (datetime && moment().diff(moment(datetime), 'hours') < 24) {
    const prevBalance = donationsCursor.get('day');
    donationsCursor.set('day', amount + prevBalance);
  }
}

const getStats = () => {
  if (!cloud.auth().currentUser) { return; }
  donationsCursor.select('statsLoading').set(true);
  const uid = cloud.auth().currentUser.uid;
  cloud.database().ref('donations').child(uid)
    .orderByChild('datetime').once('value', (snapshot) => {
    snapshot.forEach(data => {
      const { amount, datetime } = data.val();
      if (!amount) { return; }
      const _amount = numeral(amount).value();
      createFullBalance(_amount, datetime);
      createWeekBalance(_amount, datetime);
      createDayBalance(_amount, datetime);
    });
    donationsCursor.select('statsLoading').set(false);
  });
}

const get = (e) => {
  if (!cloud.auth().currentUser) { return; }
  donationsCursor.select('loading').set(true);
  const { page, perPage } = e.data;
  const uid = cloud.auth().currentUser.uid;
  cloud.database().ref('donations').child(uid)
    .orderByChild('datetime')
    .limitToLast(perPage * page).once('value', (snapshot) => {
    snapshot.forEach(data => {
      const { amount } = data.val();
      if (amount) {
        donationsCursor.select('items').set(data.getKey(), data.val());
      }
    });
    donationsCursor.select('loading').set(false);
  });
}

const watch = (e) => {
  if (!cloud.auth().currentUser) { return; }
  donationsCursor.select('loading').set(true);
  const { page, perPage } = e.data;
  const uid = cloud.auth().currentUser.uid;
  cloud.database().ref('donations').child(uid)
    .orderByChild('datetime')
    .limitToLast(perPage * page).on('value', (snapshot) => {
    snapshot.forEach(data => {
      const { amount } = data.val();
      if (amount) {
        donationsCursor.select('items').set(data.getKey(), data.val());
      }
    });
    donationsCursor.select('loading').set(false);
  });
}

const watchOff = () => {
  cloud.database().ref('donations').off();
};

signals.on('donations:watch', watch);
signals.on('donations:get', get);
signals.on('donations:getStats', getStats);
signals.on('donations:off', watchOff);
