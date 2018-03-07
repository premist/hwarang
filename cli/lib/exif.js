const exif = require('exif-reader');

class Exif {
  constructor(exif_buf) {
    this.exif_data = exif(exif_buf);

    this.camera = `${this.exif_data.image.Make} ${this.exif_data.image.Model}`;
    this.f_number = this.exif_data.exif.FNumber;
    this.exposure_time = this.exif_data.exif.ExposureTime;
    this.iso = this.exif_data.exif.ISO;
    this.focal_length_in_35 = this.exif_data.exif.FocalLengthIn35mmFormat;
    this.lens = this.exif_data.exif.LensModel;
  }

  static async fromSharp(sharp) {
    let metadata = await sharp.metadata();
    return new Exif(metadata.exif);
  }
}

module.exports = Exif;
