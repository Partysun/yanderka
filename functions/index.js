const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const fetch = require('node-fetch');
const express = require('express');
const cors = require('cors')({origin: true});
const app = express();

const authenticate = (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    res.status(403).send('Unauthorized');
    return;
  }
  const idToken = req.headers.authorization.split('Bearer ')[1];
  admin.auth().verifyIdToken(idToken).then(decodedIdToken => {
    req.user = decodedIdToken;
    next();
  }).catch(error => {
    res.status(403).send('Unauthorized');
  });
};

app.use(cors);
app.use(authenticate);

const baseStreamlabUrl = 'https://streamlabs.com/api/v1.0';
const streamlabTokenUrl = baseStreamlabUrl + '/token';
const client_id = 'G5mP8C1oQUavrj7GIl8uxPhswcTRWaigR4VZsO3R';
const client_secret = 'UMWYzx4QHI1TaX0p2u3Am1BMPfcl7HqnHavKiW19';
const redirect_uri = 'https://yanderka-f39f7.firebaseapp.com/oauth/streamlabs';

const authorizationStreamLab = (code) => {
  return new Promise((resolve, rej) => {
    const body = { 
      grant_type: 'authorization_code',
      client_id: client_id,
      client_secret: client_secret,
      redirect_uri: redirect_uri,
      code: code 
    };
    fetch(streamlabTokenUrl, { 
      method: 'POST',
      body:    JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    }).then(res => resolve(res.json()));
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

const saveStreamLabToken = (uid, access_token, refresh_token) => {
  admin.database().ref(`/users/${uid}/streamlabs`).update({
    access_token,
    refresh_token,
    created_at: admin.database.ServerValue.TIMESTAMP,
    expires_in: 3600
  });
}

app.get('/getToken', (req, res) => {
  const uid = req.user.uid;
  admin.database().ref(`/users/${uid}/streamlabs`).once('value', (snap) => {
    const { access_token, refresh_token } = snap.val();
    if (!access_token && !refresh_token) {
      res.status(404).json({'status': 'not_found', 'message': 'access_token was not found'});  
    }
    if (!refresh_token) {
      authorizationStreamLab(access_token).then(({access_token, refresh_token}) => {
        console.log('authorization', access_token, refresh_token);
        saveStreamLabToken(uid, access_token, refresh_token);
        res.status(200).json({'status': 'ok', 'access_token': access_token});  
      }).catch((e) => {res.status(500).json({e})});
    } else {
      refreshToken(snap.val()).then(({access_token, refresh_token}) => {
        console.log('refreshToken', access_token, refresh_token);
        saveStreamLabToken(uid, access_token, refresh_token);
        res.status(200).json({'status': 'ok', 'access_token': access_token});  
      }).catch((e) => {res.status(500).json({e})});
    }
  });
});

app.get('/hello', (req, res) => {
  res.send(`Hello, ${req.user.name}`);
});

exports.actions = functions.https.onRequest(app);

exports.cleanupUserData = functions.auth.user().onDelete(event => {
  const uid = event.data.uid;
  return admin.database().ref(`/users/${uid}`).remove();
});
