var dream = require('dreamjs');
var chance = require('chance');
var admin = require('firebase-admin');

var serviceAccount = require('./../yanderka-f39f7-firebase-adminsdk.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://yanderka-f39f7.firebaseio.com'
});
var db = admin.database();

const pushFixtureToFirebase = (json) => {
  const donationsRef = db.ref('donations').child('ogHbKJsPF4MCiG9LDV8q7HsiPUY2');
  json.forEach((donation) => {
    donationsRef.push(donation);
  });
}

dream.customType('amount', function (helper) {
  return helper.chance.integer({min: 5, max: 10000}) + '.00';
});

dream.customType('datetime', function (helper) {
  return helper.chance.date({year: 2017}) 
});

dream.customType('notification-type', /(card-incoming|p2p-incoming)/);

dream.customType('comment', function (helper) {
  return helper.chance.paragraph({sentences: 1}) 
});

dream
  .schema({
    amount: 'amount',
    comment: 'comment',
    datetime: 'datetime',
    email: 'email',
    nickname: 'first',
    notification_type: 'notification-type',
    sender: () => '',
    uid: 'wp8_anid2',
    unaccepted: 'bool',
    withdraw_amount: 'amount'
  })
  .generateRnd(305)
  .output((err, result) => {
    pushFixtureToFirebase(result);
  });
