import state from './state.js';
import signals from './signals.js';
import cloud from './cloud.js';
import axios from 'axios';
const alertItemsCursor = state.select('donations', 'alertItems');

const toggleDonation = (e) => {
  const key = e.data;
  const uid = cloud.auth().currentUser.uid;
  const donationCur = alertItemsCursor.select({key: key});
  if (donationCur.solvedPath) {
    const index = donationCur.solvedPath[2];
    alertItemsCursor.splice([index, 1]);
  }
  cloud.database().ref('donations')
    .child(uid).child(key).update({showed: true});
}

const watch = () => {
  const uid = cloud.auth().currentUser.uid;

  cloud.database().ref('donations').child(uid)
    .orderByChild('showed').equalTo(false)
    .limitToLast(1).on('child_added', (snap) => {
      const { amount } = snap.val();
      if (amount) {
        const _donate = Object.assign({}, { key: snap.getKey() }, snap.val());
        alertItemsCursor.push(_donate);
      }
  });
  
}

const watchOff = () => {
  cloud.database().ref('donations').off();
};

const firetest = async () => {
  const userToken = await cloud.auth().currentUser.getToken();
  const sendAlertUrl = state.get('app', 'apiUrl') + '/firetestDonation';
  axios.post(sendAlertUrl,
  {},
  {
    headers: { 
      'Content-Type':  'application/json',
      'Accept':        'application/json',
      'Authorization': 'Bearer ' + userToken
    },
  })
  .then( async (response) => {
    console.log(response.data);
    //const donation = await getDonationByKey(response.data);
    //state.select('app', 'lastDonation').set(donation);
  })
  .catch(function (error) {
    console.log(error);
  });
}

signals.on('alertbox:firetest', firetest);
signals.on('alertbox:toggleDonation', toggleDonation);
signals.on('alertbox:watch', watch);
signals.on('alertbox:off', watchOff);
