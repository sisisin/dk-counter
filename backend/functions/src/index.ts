import * as functions from 'firebase-functions';
import * as express from 'express';
import * as twitterPin from 'twitter-pin';
import * as Twit from 'twit';
const app = express();

const config = functions.config();
const consumerKey = config.twitter.consumer_key;
const consumerSecret = config.twitter.consumer_secret;
const pin = twitterPin(consumerKey, consumerSecret);

app.get('/auth', (req, res) => {
  pin.getUrl((err, url) => {
    if (err) throw err;
    res.redirect(url);
  });
});
app.get('/auth/pin', (req, res) => {
  pin.authorize(req.query.pin, (err, result) => {
    if (err) throw err;
    console.log(result);

    res.json({
      token: result.token,
      secret: result.secret,
    });
  });
});

app.post('/tweet', (req, res) => {
  const { accessToken, accessSecret, message } = req.body;
  const T = new Twit({
    consumer_key: consumerKey,
    consumer_secret: consumerSecret,
    access_token: accessToken,
    access_token_secret: accessSecret,
    timeout_ms: 60 * 1000,
    strictSSL: true,
  });

  T.post('statuses/update', { status: message }, (err, data, response) => {
    if (err) {
      res.status(500);
      return;
    }

    res.status(200);
  });
});
export const twitter = functions.https.onRequest(app);
