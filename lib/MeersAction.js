const request = require('request');
const config = process.env.NODE_ENV === 'production' ? require('./../config.sample') : require('./../config');

class MeersAction {
  static post(tweet) {
    const cleanTweet = tweet.text.replace(config.PARAMS.stream.track, '');
    const options = {
      url: config.URL.post,
      oauth: config.OAUTH,
      qs: {
        status: cleanTweet
      },
      json: true,
      encoding: 'utf8',
      method: 'POST'
    }
    
    request(options)
      .on('data', (chunk) => {
        console.log(`Post Data: ${chunk}`);
      })
      .on('error', error => console.error(error))
      .on('end', response => console.log('Posted'));
  }
}

module.exports = MeersAction