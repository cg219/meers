const Stream = require('./lib/Stream');
const Parser = require('./lib/Parser');
const MeersAction = require('./lib/MeersAction');
const config = process.env.NODE_ENV === 'production' ? require('./config.sample') : require('./config');
const stream = new Stream();
const username = config.TWITTER_USERNAME;

stream.connect((tweet) => {
  let parsedTweet = Parser.parse(tweet, username);

  if (parsedTweet) {
    MeersAction.post(parsedTweet);
  }
});