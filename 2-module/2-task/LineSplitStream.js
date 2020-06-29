const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.rest = '';
  }

  _transform(chunk, encoding, callback) {
    if (chunk.toString().indexOf(os.EOL) === -1) {
      this.rest += chunk.toString();
      callback(null);
    } else {
      const [part1, part2] = chunk.toString().split(os.EOL);
      const result = this.rest;
      if (typeof part2 !== 'undefined') {
        this.rest = chunk.toString().split(os.EOL)[1];
      }
      if (result !== '') {
        callback(null, result + part1);
      } else {
        callback(null, part1);
      }
    }
  }

  _flush(callback) {
    callback(null, this.rest);
  }
}

module.exports = LineSplitStream;
