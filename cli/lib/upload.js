class Upload {
  constructor(buffer, bucket, key) {
    this.buffer = buffer;
    this.bucket = bucket;
    this.key = key;
  }

  async perform() {
    await new Promise((resolve, reject) => {
      let file = this.bucket.file(this.key);
      let stream = file.createWriteStream({
        predefinedAcl: 'publicRead',
        metadata: {
          contentType: 'image/jpeg',
          cacheControl: 'public, max-age=2592000'
        }
      });

      stream.on('finish', resolve);
      stream.on('error', reject);
      stream.end(this.buffer);
    });
  }

  url() {
    return `https://storage.googleapis.com/${this.bucket.name}/${this.key}`;
  }
}

module.exports = Upload;
