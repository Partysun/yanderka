const functions = require('firebase-functions');
const admin = require('./cloud.js');
const fetch = require('node-fetch');
const express = require('express');
const Chance = require('chance');
const cors = require('cors')({origin: true});
const yamoneyRoutes = require('./yamoney.route.js');
const app = express();

const authenticate = (req, res, next) => {
  if (req.path.split('/')[1] === 'hooks') { next(); }
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
app.use('/yamoney', yamoneyRoutes);

const baseStreamlabUrl = 'https://streamlabs.com/api/v1.0';
const streamlabTokenUrl = baseStreamlabUrl + '/token';
const client_id = functions.config().streamlabs.id;
const client_secret = functions.config().streamlabs.secret;
const redirect_uri = 'https://yanderka.ru/oauth/streamlabs';

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
  return admin.database().ref(`/users/${uid}/streamlabs`).update({
    access_token,
    refresh_token,
    created_at: admin.database.ServerValue.TIMESTAMP,
    expires_in: 3600
  });
}

app.get('/getToken', (req, res) => {
  const uid = req.user.uid;
  admin.database().ref(`/users/${uid}/streamlabs`).once('value', (snap) => {
    const { access_token, refresh_token, created_at, expires_in } = snap.val();
    if (!access_token && !refresh_token) {
      res.status(404).json({'status': 'not_found', 'message': 'access_token was not found'});  
    }
    if (!refresh_token) {
      authorizationStreamLab(access_token).then(({access_token, refresh_token}) => {
        console.log('authorization');
        saveStreamLabToken(uid, access_token, refresh_token).then(() => {
          res.status(201).json({'status': 'ok', 'access_token': access_token});  
        });
      }).catch((e) => {res.status(500).json({e})});
    } else {
      if (created_at + expires_in * 1000 < new Date().getTime() - 5 * 1000) {
        refreshToken(snap.val()).then(({access_token, refresh_token}) => {
          console.log('refreshToken');
          saveStreamLabToken(uid, access_token, refresh_token).then(() => {
            res.status(201).json({'status': 'ok', 'access_token': access_token});  
          });
        }).catch((e) => {res.status(500).json({e})});
      } else {
        res.status(200).json({'status': 'ok', 'access_token': access_token});  
      }
    }
  });
});

const makeStreamlabsAlert = (token, type, message) => {
  console.log(type, message);
  return fetch(baseStreamlabUrl + '/alerts', {
    method: 'POST',
    body: JSON.stringify({
      type: 'host', 
      message: message, 
      special_text_color: '#199dce'
    }),
    headers: { 
      'Content-Type':  'application/json',
      'Accept':        'application/json',
      'Authorization': 'Bearer ' + token
    }
  }).then(res => res.json());
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

app.post('/sendAlert', (req, res) => {
  const uid = req.user.uid;
  admin.database().ref(`/users/${uid}/streamlabs`).once('value', (snap) => {
    const { access_token, refresh_token, created_at, expires_in } = snap.val();
    //TODO: check expired and refresh
    if (created_at + expires_in * 1000 < new Date().getTime() - 5 * 1000) {
      refreshToken(snap.val()).then(({access_token, refresh_token}) => {
        console.log('refreshToken');
        saveStreamLabToken(uid, access_token, refresh_token).then(() => {
          makeStreamlabsAlert(access_token, req.body.type, req.body.message).then(json => {
            res.status(200).json({'status': 'ok'});  
          });
        });
      }).catch((e) => {res.status(500).json({e})});
    } else {
      makeStreamlabsAlert(access_token, req.body.type, req.body.message).then(json => {
        res.status(200).json({'status': 'ok'});  
      });
    }
  });
});

app.post('/sendDonation', (req, res) => {
  const uid = req.user.uid;
  admin.database().ref(`/users/${uid}/streamlabs`).once('value', (snap) => {
    const { access_token, refresh_token, created_at, expires_in } = snap.val();
    if (created_at + expires_in * 1000 < new Date().getTime() - 5 * 1000) {
      refreshToken(snap.val()).then(({access_token, refresh_token}) => {
        console.log('refreshToken');
        saveStreamLabToken(uid, access_token, refresh_token).then(() => {
          makeStreamlabsDonation(access_token,
            req.body.name,
            req.body.identifier,
            req.body.amount,
            req.body.message)
            .then(json => {
              console.log('made donation', json);
              res.status(201).json({'status': 'ok'});  
            });
        });
      }).catch((e) => {res.status(500).json({e})});
    } else {
      makeStreamlabsDonation(access_token,
        req.body.name,
        req.body.identifier,
        req.body.amount,
        req.body.message)
        .then(json => {
          console.log('made donation', json);
          res.status(201).json({'status': 'ok'});  
        });
    }
  });
});

app.post('/firetestDonation', (req, res) => {
  const uid = req.user.uid;
  const chance = new Chance();
  const testDonate = {
    amount: chance.integer({min: 5, max: 200}) + '.00',
    comment: chance.paragraph({sentences: 1}),
    datetime: new Date().toISOString(),
    email: chance.email(),
    nickname: chance.first(),
    notification_type:'card-incoming',
    sender:'',
    uid:'ogHbKJsPF4MCiG9LDV8q7HsiPUY2',
    unaccepted: false,
    showed: false,
    withdraw_amount:'5.00',
    test_donation: true
  }
  admin.database().ref('donations').child(uid).push(testDonate).then((snap) => {
    res.status(200).json({'key': snap.getKey()});  
  });
});

app.get('/hello', (req, res) => {
  res.send(`Hello, ${req.user.name}`);
});

module.exports = app;
