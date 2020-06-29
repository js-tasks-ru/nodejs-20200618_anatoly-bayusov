const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.currentLength = 0;
    this.limit = options.limit;
  }

  _transform(chunk, encoding, callback) {
    const chunkLength = chunk.length;
    if (this.currentLength + chunkLength > this.limit) {
      const err = new LimitExceededError();
      callback(err);
    } else {
      this.currentLength += chunkLength;
      callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;
