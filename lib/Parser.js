class Parser {
  static parse(tweet, username) {
    const endOfTweetIndex = tweet.indexOf('\r\n{');
    const cleanTweet = tweet.substring(endOfTweetIndex);
    let parsedData = JSON.parse(cleanTweet);

    if (parsedData.user && parsedData.user.screen_name.toLowerCase().indexOf(username) != -1) {
      return parsedData;
    }

    return false;
  }
}

module.exports = Parser;