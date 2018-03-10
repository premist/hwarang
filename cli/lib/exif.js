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

  simplified() {
    return {
      camera: this.camera,
      f_number: this.f_number,
      exposure_time: this.exposure_time,
      iso: this.iso,
      focal_length_in_35: this.focal_length_in_35,
      lens: this.lens
    }
  }

  static async fromSharp(sharp) {
    let metadata = await sharp.metadata();
    return new Exif(metadata.exif);
  }
}

module.exports = Exif;
