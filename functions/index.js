const functions = require('firebase-functions');
const admin = require('./cloud.js');
const webhooksRoutes = require('./webhooks.route.js');
const actionsRoutes = require('./actions.route.js');

exports.actions = functions.https.onRequest(actionsRoutes);
exports.hooks = functions.https.onRequest(webhooksRoutes);

exports.cleanupUserData = functions.auth.user().onDelete(event => {
  const uid = event.data.uid;
  return admin.database().ref(`/users/${uid}`).remove();
});
