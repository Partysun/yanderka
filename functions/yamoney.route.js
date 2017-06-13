const express = require('express');
const yandexMoney = require('yandex-money-sdk');
const admin = require('./cloud.js');
const crypto = require('crypto');
const router = express.Router();

const clientId = '99B259E4ABD9367E2D018D773F1BD511E8AF6DECA1C63C87BC2D16EACE1CE779';
const clientSecret = 'EC04B9DB29C03A10FFB1B11D009C30B8A5F95DA251539C1D6D1D9B2F4F61DA43E380E52CC27D4A61115427915F04EE80739E071266C0BBF886031884F274AF52';
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
