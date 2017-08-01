const admin = require('./cloud.js');
const fetch = require('node-fetch');

const saveStreamLabToken = (uid, access_token, refresh_token) => {
  return admin.database().ref(`/users/${uid}/streamlabs`).update({
    access_token,
    refresh_token,
    created_at: admin.database.ServerValue.TIMESTAMP,
    expires_in: 3600
  });
}

const refreshToken = ({refresh_token, expires_in, created_at}) => {
  return new Promise((resolve, reject) => {
    const body = { 
      grant_type: 'refresh_token',
      client_id: client_id,
      client_secret: client_secret,
      redirect_uri: redirect_uri,
      refresh_token: refresh_token
    };
    fetch(streamlabTokenUrl, { 
      method: 'POST',
      body:    JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    }).then(res => resolve(res.json()));
  });
}

const makeStreamlabsDonation = (token, name, identifier, amount, message) => {
  console.log('make donation', name, identifier, amount, message);
  return fetch(baseStreamlabUrl + '/donations', {
    method: 'POST',
    body: JSON.stringify({
      name: name, 
      identifier: identifier, 
      amount: amount, 
      currency: 'RUB',
      message: message
    }),
    headers: { 
      'Content-Type':  'application/json',
      'Accept':        'application/json',
      'Authorization': 'Bearer ' + token
    }
  }).then(res => res.json());
}

const getStreamlabsToken = (uid) => {
  const uid = req.user.uid;
  return new Promise((resolve, reject) => {
    admin.database().ref(`/users/${uid}/streamlabs`).once('value', (snap) => {
      const { access_token, refresh_token, created_at, expires_in } = snap.val();
      if (created_at + expires_in * 1000 < new Date().getTime() - 5 * 1000) {
        refreshToken(snap.val()).then(({access_token, refresh_token}) => {
          console.log('refreshToken');
          saveStreamLabToken(uid, access_token, refresh_token).then(() => {
            resolve(access_token); 
          });
        }).catch(e => reject(e));
      } else {
        resolve(access_token); 
      }
    });
  });
}

module.exports = { makeStreamlabsDonation, getStreamlabsToken };
