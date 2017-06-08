import state, { seed } from './state.js';
import signals from './signals.js';
import cloud from './cloud.js';
import axios from 'axios';
import 'url-search-params-polyfill';

const userCursor = state.select('user');
userCursor.select('loading').set(true);

cloud.auth().onAuthStateChanged((user) => {
  if (!user) {
    console.log('user out');
    userCursor.select('loading').set(false);
  } else {
    console.log('user in');
    let _user = {};
    _user.uid = user.uid;
    _user.email = user.email;
    _user.loading = false;

    cloud.database().ref('users').child(user.uid).once('value', (snapshot) => {
      snapshot.forEach(data => {
        _user[`${data.getKey()}`] = data.val();
      });
      userCursor.merge(_user);
    });
  }
});

const login = (e) => {
  state.select('app', 'ui', 'login').merge({
    pending: true,
    error: ''
  });
  const provider = new cloud.auth.GoogleAuthProvider();
  cloud.auth().signInWithPopup(provider).then(function(result) {
    state.select('app', 'ui', 'login').merge({
      pending: false,
    });
  }).catch(function(error) {
    var errorMessage = error.message;
    state.select('app', 'ui', 'login').merge({
      pending: false,
      error: errorMessage
    });
  });
}

const logout = (e) => {
  cloud.auth().signOut().then(() => state.set(seed));
}

const watch = () => {
  const uid = state.get('user', 'uid');
  if (!cloud.auth().currentUser) { return; }
  cloud.database().ref('users').child(uid).on('value', (snapshot) => {
    snapshot.forEach(data => {
      state.select('user').set(data.getKey(), data.val());
    });
  });
}

const watchOff = () => {
  cloud.database().ref('users').off();
};

const connectStreamlabs = () => {
  const streamlabsClientId = 'G5mP8C1oQUavrj7GIl8uxPhswcTRWaigR4VZsO3R';
  const baseUrl = 'https://streamlabs.com/api/v1.0/authorize?';
  const redirect_uri = 'https://yanderka-f39f7.firebaseapp.com/oauth/streamlabs';
  const oauthUrl = `${baseUrl}client_id=${streamlabsClientId}&redirect_uri=${redirect_uri}&response_type=code&scope=legacy.token+donations.read`;
  window.location.replace(oauthUrl);
}

const streamlabsSaveToken = async (e) => {
  const uid = cloud.auth().currentUser.uid;
  const refreshTokenSnap = await cloud.database().ref('users').child(uid).child('streamlabs/refresh_token').once('value');
  if (refreshTokenSnap && refreshTokenSnap.val()) { return; }
  state.select('app', 'ui', 'streamlabs').merge({
    pending: true,
  });
  const search = e.data; 
  const streamlabsToken = new URLSearchParams(search).get('code');
  const userToken = await cloud.auth().currentUser.getToken();
  const getTokenUrl = state.get('app', 'apiUrl') + '/getToken';
  cloud.database().ref('users').child(uid).child('streamlabs').update({access_token: streamlabsToken}).then(() => {
    axios.get(getTokenUrl,
    {
      headers: { 
        'Content-Type':  'application/json',
        'Accept':        'application/json',
        'Authorization': 'Bearer ' + userToken
      },
    })
    .then((response) => {
      console.log(response.data);
      state.select('app', 'ui', 'streamlabs').merge({
        pending: false,
      });
    })
    .catch((error) => {
      console.log(error);
      state.select('app', 'ui', 'streamlabs').merge({error,});
    });
  });
}

const apiTest = (e) => {
  const getTestUrl = state.get('app', 'apiUrl') + '/hello';
  cloud.auth().currentUser.getToken().then( (token) => 
    axios.get(getTestUrl,
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
    })
  );
}

signals.on('user:auth', login);
signals.on('user:logout', logout);
signals.on('user:watch', watch);
signals.on('user:off', watchOff);
signals.on('user:api:test', apiTest);
signals.on('user:connect:streamlabs', connectStreamlabs);
signals.on('user:connect:streamlabs:saveToken', streamlabsSaveToken);
