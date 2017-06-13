const _ = require('lodash');
const express = require('express');
const admin = require('./cloud.js');
const cors = require('cors')({origin: true});
const app = express();
app.use(cors);

const verifyUid = (uid) => {
  return new Promise((resolve, reject) => {
    const ref = admin.database().ref('_yaaccounts');
    ref.orderByKey().equalTo(uid)
      .once('value', (snap) => {
        if (!snap.exists()) {
          resolve({uid: null});
        } else {
          const account = _.values(snap.val())[0];
          resolve({account: account});
        }
      }, (e) => {
        reject(error);
      });
  });
}

const getYaAccount = (req, res) => {
  const uid = req.params.uid;
  if (!uid) {
    res.status(400).json({'status': 'not_found', 'message': 'Uid not provided'});
  }
  verifyUid(uid).then(json => {
    if (json.account !== null) {
      res.status(200).json(json);
    } else {
      res.status(404);
    }
  }).catch(e => {
    res.status(500).json({'error': e});
  });
}

app.get('/:uid', getYaAccount);

module.exports = app;
