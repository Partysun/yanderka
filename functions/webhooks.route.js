const _ = require('lodash');
const express = require('express');
const admin = require('./cloud.js');
const app = express();

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    const ref = admin.database().ref('_yawebhooks');
    ref.orderByKey().equalTo(token)
      .once('value', (snap) => {
        if (!snap.exists()) {
          resolve({uid: null});
        } else {
          const uid = _.values(snap.val())[0];
          resolve({uid: uid});
        }
      }, (e) => {
        reject(error);
      });
  });
}

const completeNotificationSetting = (uid, res) => {
  return new Promise((resolve, reject) => {
    const ref = admin.database().ref('users');
    ref.child(uid).child('yamoney/notifyTested').set(true, (error) => {
      if (error) { reject(error); }
      resolve();
    });
  });
}

const hooks = (req, res) => {
  const token = req.params.token;
  if (!token) {
    res.status(400).json({'status': 'not_found', 'message': 'Token not provided'});
  }
  verifyToken(token).then(json => {
    if (json.uid !== null) {
      console.log('hook activated for user with id ' + json.uid);
      console.log(req.body);
      if (req.body.test_notification) {
        console.log('this is the test notification');
        completeNotificationSetting(json.uid).then(() => {
          res.status(200).json(json);
        }).catch(e => {
          res.status(500).json({'error': e});
        });
      } else {
        res.status(200).json(json);
      }
    } else {
      console.log('hook activated, but user not found with token ' + token);
      res.status(404);
    }
  }).catch(e => {
    res.status(500).json({'error': e});
  });
}

app.post('/:token', hooks);

module.exports = app;
