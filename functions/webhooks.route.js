const _ = require('lodash');
const express = require('express');
const admin = require('./cloud.js');
const makeStreamlabsDonation = require('./streamlabs.js').makeStreamlabsDonation;
const getStreamlabsToken = require('./streamlabs.js').getStreamlabsToken;
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

const processNotification = (notification, uid) => {
  return new Promise((resolve, reject) => {
    const donationsRef = admin.database().ref('donations');
    donationsRef.child(uid).child(notification.label).update({
      datetime: notification.datetime,
      sender: notification.sender || '',
      amount: notification.amount,
      email: notification.email,
      showed: false,
      unaccepted: notification.unaccepted,
      withdraw_amount: notification.withdraw_amount,
      notification_type: notification.notification_type
    }, (error) => {
      if (error) { reject(error); }
      resolve({name: notification.sender, identifier: notification.email, amount: notification.amount});
    });
  });
}

const completeNotificationSetting = (uid) => {
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
      if (req.body.test_notification) {
        console.log('this is the test notification');
        completeNotificationSetting(json.uid).then(() => {
          res.status(200).json(json);
        }).catch(e => {
          res.status(500).json({'error': e});
        });
      } else {
        processNotification(req.body, json.uid).then(donation => {
          getStreamlabsToken(json.uid).then((strealabsToken) => {
            //FIXME: add message data
            makeStreamlabsDonation(strealabsToken, donation.name, donation.identifier, donation.amount, '');
          });
          res.status(200).json(json);
        })
        .catch(e => {
          res.status(500).json({'error': e});
        });
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
