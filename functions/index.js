const functions = require('firebase-functions');
const admin = require('./cloud.js');
const webhooksRoutes = require('./webhooks.route.js');
const yaaccountRoutes = require('./yaaccount.route.js');
const actionsRoutes = require('./actions.route.js');
const yandexMoney = require('yandex-money-sdk');

exports.actions = functions.https.onRequest(actionsRoutes);
exports.hooks = functions.https.onRequest(webhooksRoutes);
exports.yaaccount = functions.https.onRequest(yaaccountRoutes);

exports.yamoneyAccountInfo = functions.database.
    ref('/users/{userId}/yamoney/access_token').onWrite(event => {
      const userId =  event.params.userId;
      const api = new yandexMoney.Wallet(event.data.val());
      // get account info
      api.accountInfo(function infoComplete(err, data) {
          if(err) {
            // process error
          }
          const user_account = data.account;

          const updatedUserAccountInfo = {};
          updatedUserAccountInfo[`/users/${userId}/yamoney/account`] = user_account;
          updatedUserAccountInfo['_yaaccounts/' + userId] = user_account;

          admin.database().ref().update(updatedUserAccountInfo, function(error) {
            if (error) {
              console.log("Error updating data:", error);
            }
          });

      });
    });

exports.cleanupUserData = functions.auth.user().onDelete(event => {
  const uid = event.data.uid;
  return admin.database().ref(`/users/${uid}`).remove();
});
