const express = require('express');
const admin = require('./cloud.js');
const cors = require('cors')({origin: true});
const app = express();
app.use(cors);

const makeDonation = (req, res, next) => {
  const nickname = req.body.nickname;
  const comment = req.body.comment;
  const uid = req.body.uid;

  const ref = admin.database().ref('donations').child(uid);
  const newDonationId = ref.push({
    uid: uid,
    nickname: nickname,
    comment: comment
  }).key;
  res.status(200).json({
    id: newDonationId,
  });
}

app.post('/', makeDonation);
module.exports = app;
