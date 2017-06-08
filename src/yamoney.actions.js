import signals from './signals.js';
import state from './state.js';
import cloud from './cloud.js';
import axios from 'axios';
import 'url-search-params-polyfill';

const connect = async (e) => {
  const userToken = await cloud.auth().currentUser.getToken();
  const getTokenUrl = state.get('app', 'apiUrl') + '/yamoney/buildObtainTokenUrl';
  axios.get(getTokenUrl,
    {
      headers: { 
        'Content-Type':  'application/json',
        'Accept':        'application/json',
        'Authorization': 'Bearer ' + userToken
      },
    })
    .then((response) => {
      state.select('app', 'ui', 'yamoney').merge({ pending: false });
      window.location.replace(response.data.url);
    })
    .catch((error) => {
      console.log(error);
      state.select('app', 'ui', 'yamoney').merge({error,});
    });
};

const saveToken = async (e) => {
  const uid = cloud.auth().currentUser.uid;
  const tokenSnap = await cloud.database().ref('users').child(uid).child('yamoney/access_token').once('value');
  if (tokenSnap && tokenSnap.val()) { return; }
  state.select('app', 'ui', 'yamoney').merge({ pending: true });
  const search = e.data; 
  const code = new URLSearchParams(search).get('code');
  const token = await cloud.auth().currentUser.getToken();
  const url = state.get('app', 'apiUrl') + '/yamoney/getAccessToken';
  axios.post(url,
  { code: code },
  {
    headers: { 
      'Content-Type':  'application/json',
      'Accept':        'application/json',
      'Authorization': 'Bearer ' + token
    },
  })
  .then((response) => {
    console.log(response.data);
    state.select('app', 'ui', 'yamoney').merge({pending: false});
  })
  .catch((error) => {
    console.log(error);
    state.select('app', 'ui', 'yamoney').merge({error,});
  });
};


signals.on('yamoney:connect', connect);
signals.on('yamoney:connect:saveToken', saveToken);
