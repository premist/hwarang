const exif = require('exif-reader');
const Fraction = require('fraction.js');

class Exif {
  constructor(exif_buf) {
    this.exif_data = exif(exif_buf);

    this.camera = `${this.exif_data.image.Make} ${this.exif_data.image.Model}`;
    this.lens = this.exif_data.exif.LensModel;

    this.f_number = this.exif_data.exif.FNumber;
    this.iso = this.exif_data.exif.ISO;
    this.focal_length_in_35 = this.exif_data.exif.FocalLengthIn35mmFormat;

    let cat = this.exif_data.exif.DateTimeOriginal;
    this.captured_at = Date.parse(cat)/1000;

    // Use fraction notication if numerator is not 1
    let et = new Fraction(this.exif_data.exif.ExposureTime);
    this.exposure_time = et.n == 1 ? et.toFraction() : et.toString()
  }

  simplified() {
    return {
      camera: this.camera,
      lens: this.lens,
      f_number: this.f_number,
      exposure_time: this.exposure_time,
      iso: this.iso,
      focal_length_in_35: this.focal_length_in_35
    }
  }

  static async fromSharp(sharp) {
    let metadata = await sharp.metadata();
    return new Exif(metadata.exif);
  }
}

module.exports = Exif;
