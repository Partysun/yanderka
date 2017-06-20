import signals from './signals.js';
import state from './state.js';
import cloud from './cloud.js';
import axios from 'axios';

const alert = async (e) => {
  const userToken = await cloud.auth().currentUser.getIdToken();
  const sendAlertUrl = state.get('app', 'apiUrl') + '/sendAlert';
  axios.post(sendAlertUrl,
  {
    type: 'donation',
    message: 'Check this motherfucker!'
  },
  {
    headers: { 
      'Content-Type':  'application/json',
      'Accept':        'application/json',
      'Authorization': 'Bearer ' + userToken
    },
  })
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });
}

const makeDonation = async (e) => {
  const token = await cloud.auth().currentUser.getIdToken();
  const url = state.get('app', 'apiUrl') + '/sendDonation';
  axios.post(url,
  {
    name: 'Юрий',
    identifier: 'yura@yanderka.ru',
    amount: '20',
    message: 'Check this motherfucker!'
  },
  {
    headers: { 
      'Content-Type':  'application/json',
      'Accept':        'application/json',
      'Authorization': 'Bearer ' + token
    },
  })
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });
}

signals.on('streamlabs:alert', alert);
signals.on('streamlabs:makeDonation', makeDonation);
