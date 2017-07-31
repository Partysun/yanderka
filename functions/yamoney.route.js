const express = require('express');
const yandexMoney = require('yandex-money-sdk');
const functions = require('firebase-functions');
const admin = require('./cloud.js');
const crypto = require('crypto');
const router = express.Router();

const clientId = functions.config().yandexmoney.id;
const clientSecret = functions.config().yandexmoney.secret;
const redirectURI = 'https://yanderka.ru/oauth/yandexmoney';
const scope = ['account-info', 'operation-history'];

const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
}

const buildObtainTokenUrl = (req, res, next) => {
  url = yandexMoney.Wallet.buildObtainTokenUrl(clientId, redirectURI, scope);
  res.status(200).json({url: url});
}

const getAccessToken = (req, res, next) => {
  const code = req.body.code;
  const uid = req.user.uid;
  yandexMoney.Wallet.getAccessToken(clientId, code, redirectURI, clientSecret, (err, data) => {
    if(err) {
      next(err);
    }
    const access_token = data.access_token;
    if (!access_token) {
      res.status(200).json({status: 'warning', message: 'Regenerate token code'});
    }
    const token = generateToken();
    admin.database().ref('_yawebhooks').child(token).set(uid).then(() => {
      admin.database().ref(`/users/${uid}/hook_token`).set(token);
    });
    admin.database().ref('users').child(uid).child('yamoney').update({
      access_token,
      created_at: admin.database.ServerValue.TIMESTAMP,
    }).then(() => {
      res.status(200).json({status: 'ok', access_token: access_token});
    });
    //TODO: catch error
  });
}

router.route('/buildObtainTokenUrl')
  .get(buildObtainTokenUrl);

router.route('/getAccessToken')
  .post(getAccessToken);

module.exports = router;
