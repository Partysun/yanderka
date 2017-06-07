import state, { seed } from './state.js';
import signals from './signals.js';
import cloud from './cloud.js';

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
    var token = result.credential.accessToken;
    var user = result.user;
    state.select('app', 'ui', 'login').merge({
      pending: false,
    });
  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email;
    var credential = error.credential;
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

signals.on('user:auth', login);
signals.on('user:logout', logout);
signals.on('user:watch', watch);
signals.on('user:off', watchOff);
