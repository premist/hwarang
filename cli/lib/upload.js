const uuidv4 = require('uuid/v4');

class Upload {
  constructor(bucket, buffer) {
    this.bucket = bucket;
    this.buffer = buffer;
  }

  async perform(key = uuidv4()) {
    await new Promise((resolve, reject) => {
      let file = this.bucket.file(uuidv4());
      let stream = file.createWriteStream({
        metadata: { contentType: 'image/jpeg'}
      });

      stream.on('finish', resolve);
      stream.on('error', reject);
      stream.end(this.buffer);
    });
  }
}

module.exports = Upload;
