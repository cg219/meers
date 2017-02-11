const configObject = {
  CONSUMER_KEY: process.env.CONSUMER_KEY || 'fill_in',
  CONSUMER_SECRET: process.env.CONSUMER_SECRET || 'fill_in',
  API_TOKEN: process.env.API_TOKEN || 'fill_in',
  API_TOKEN_SECRET: process.env.API_TOKEN_SECRET || 'fill_in',
  TWITTER_USERSTREAM: process.env.TWITTER_USERSTREAM || 'fill_in',
  TWITTER_UPDATE: process.env.TWITTER_UPDATE || 'fill_in',
  TWITTER_USERNAME: process.env.TWITTER_USERNAME || 'fill_in',
  TWITTER_HASHTAG: process.env.TWITTER_HASHTAG || 'fill_in',
}

class MeersConfig {
  constructor() {
    this.CONSUMER_KEY = configObject.CONSUMER_KEY;
    this.CONSUMER_SECRET = configObject.CONSUMER_SECRET;
    this.API_TOKEN = configObject.API_TOKEN;
    this.API_TOKEN_SECRET = configObject.API_TOKEN_SECRET;
    this.TWITTER_USERSTREAM = configObject.TWITTER_USERSTREAM;
    this.TWITTER_UPDATE = configObject.TWITTER_UPDATE;
    this.TWITTER_USERNAME = configObject.TWITTER_USERNAME;
    this.TWITTER_HASHTAG = configObject.TWITTER_HASHTAG;
    this.OAUTH = {
      consumer_key: this.CONSUMER_KEY,
      consumer_secret: this.CONSUMER_SECRET,
      token: this.API_TOKEN,
      token_secret: this.API_TOKEN_SECRET,
    };
    this.URL = {
      stream: this.TWITTER_USERSTREAM,
      post: this.TWITTER_UPDATE,
    };
    this.PARAMS = {
      stream: {
        track: this.TWITTER_HASHTAG,
        stringify_friend_ids: true,
        delimited: 'length',
        stall_warnings: true,
      },
      post: {
        status: ""
      },
    }
  }
}

module.exports = new MeersConfig();