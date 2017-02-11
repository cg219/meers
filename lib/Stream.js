const request = require('request');
const config = process.env.NODE_ENV === 'production' ? require('./../config.sample') : require('./../config');

class Stream {
  constructor(){
    this.tweets = [];
  }

  connect(callback, onEnd){
    if(!callback){
      console.error(new Error('Callback must be passed to the Stream.connect() method.'));
      return;
    }

    const options = {
      url: config.URL.stream,
      oauth: config.OAUTH,
      qs: config.PARAMS.stream,
      json: true,
      encoding: 'utf8',
    };
    const endOfLength = '\r\n{';
    let tweetComplete = true;
    let totalChunkLength = 0;
    let tweetString = '';

    request(options)
      .on('data', (chunk) => {
        if (!chunk) {
          return;
        }

        if (tweetComplete) {
          let newLineIndex = chunk.indexOf(endOfLength);

          if (newLineIndex > 0) {
            totalChunkLength = parseInt(chunk.substring(0, newLineIndex), 10);
            tweetComplete = false;
          }
        }

        console.log('Status: Streaming...');
        // console.log(`Current Chunk Length: ${chunk.length}`);
        // console.log(`Total Chunk Length: ${totalChunkLength}`);
        tweetString = `${tweetString}${chunk}`;
        totalChunkLength -= chunk.length;

        if (totalChunkLength <= 0 && !tweetComplete){
          callback(tweetString);

          totalChunkLength = 0;
          tweetString = '';
          tweetComplete = true;
        }
      })
      .on('error', error => console.error(error))
  }
}

module.exports = Stream;