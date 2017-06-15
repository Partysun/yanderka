import state from './state.js';
import signals from './signals.js';
import cloud from './cloud.js';

const donationsCursor = state.select('donations');
donationsCursor.select('loading').set(true);

const watch = () => {
  const uid = state.get('user', 'uid');
  if (!cloud.auth().currentUser) { return; }
  cloud.database().ref('donations').child(uid)
    .orderByChild('datetime')
    .limitToLast(10).on('value', (snapshot) => {
    donationsCursor.select('loading').set(true);
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
signals.on('donations:off', watchOff);
