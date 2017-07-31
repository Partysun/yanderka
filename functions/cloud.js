const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Why I should use custom credentials? Read it on stackoverflow.
// https://stackoverflow.com/questions/42717540/firebase-cloud-functions-createcustomtoken
const serviceAccount = require("./service-account.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://yanderka-f39f7.firebaseio.com"
});

module.exports = admin;
