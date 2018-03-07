const fs = require('fs');

const admin = require('firebase-admin');
const sharp = require('sharp');
const imagemin = require('imagemin');
const mozjpeg = require('imagemin-mozjpeg');
const Exif = require('./exif');

const picturePath = process.argv[2];
const title = process.argv[3];

const picture = sharp(picturePath);
const thumbnail = picture
  .clone()
  .resize(1600, 1600, { kernel: sharp.kernel.lanczos3 })
  .max();

console.log(Exif.fromSharp(picture));
