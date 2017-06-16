var dream = require('dreamjs');
var chance = require('chance');
var admin = require('firebase-admin');

var serviceAccount = require('./../yanderka-f39f7-firebase-adminsdk.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://yanderka-f39f7.firebaseio.com'
});
var db = admin.database();

const randomDate = (start, end, startHour, endHour) => {
  var date = new Date(+start + Math.random() * (end - start));
  var hour = startHour + Math.random() * (endHour - startHour) | 0;
  date.setHours(hour);
  return date.toISOString();
}

const updateFixtureInFirebase = (json) => {
  const donationsRef = db.ref('donations').child('ogHbKJsPF4MCiG9LDV8q7HsiPUY2');
  donationsRef.once('value', (snap) => {
    snap.forEach(data => {
      const { amount, datetime } = data.val();
      if (!datetime) {
        const newdate = randomDate(new Date(2017, 0, 1, 2, 3, 4, 567), new Date(), 0, 12)
        donationsRef.child(data.getKey()).update({datetime: newdate});
      }
    });
  });
}

updateFixtureInFirebase();
