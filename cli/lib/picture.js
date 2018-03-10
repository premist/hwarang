const sharp = require('sharp');
const imagemin = require('imagemin');
const mozjpeg = require('imagemin-mozjpeg');

const Exif = require('./exif');

class Picture {
  constructor(file_path_or_sharp) {
    if(typeof file_path_or_sharp === 'string') {
      this.sharp = sharp(file_path_or_sharp);
    } else {
      this.sharp = file_path_or_sharp;
    }
  }

  async getExif() {
    if(this.exif) { return this.exif };

    this.exif = await Exif.fromSharp(this.sharp);
    return this.exif;
  }

  async getBuffer() {
    if(this.buffer) { return this.buffer; }

    this.buffer = await this.sharp.toBuffer();
    return this.buffer;
  }

  async compressed(quality = 90) {
    let buf = await this.getBuffer();
    let new_buf = await imagemin.buffer(buf, {
      plugins: [mozjpeg({ quality: quality, progressive: true })]
    });

    return new_buf;
  }

  async jpegified() {
    return new Picture(this.sharp.jpeg({
      quality: 100
    }));
  }

  async resized(max_width = 1600, max_height = 1600) {
    return new Picture(
      this.sharp
        .clone()
        .resize(max_width, max_height, { kernel: sharp.kernel.lanczos3 })
        .max()
    );
  }
}

module.exports = Picture;
