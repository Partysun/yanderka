import signals from './signals.js';
import state from './state.js';
import axios from 'axios';

const streamlabsBaseUrl = 'https://streamlabs.com/api/v1.0';

const alert = (e) => {
  const token = state.get('user', 'streamlabs', 'access_token');
  axios.post(streamlabsBaseUrl + '/alerts',
  {},
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
