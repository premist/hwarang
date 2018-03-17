const fs = require('fs');

const uuidv4 = require('uuid/v4');
const admin = require('firebase-admin');
const imagemin = require('imagemin');
const mozjpeg = require('imagemin-mozjpeg');

const Picture = require('./picture');
const Upload = require('./upload');

const serviceAccount = require('../../.serviceaccount.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${project_id}.firebaseio.com`,
  storageBucket: `${project_id}.appspot.com`
});
const bucket = admin.storage().bucket();

const picture_path = process.argv[2];
const title = process.argv[3];

const picture = new Picture(picture_path);

(async function() {
  const exif = await picture.getExif();

  const original = await picture
    .resized(5000, 5000)
    .compressed(95);

  const thumbnail = await picture
    .resized(1600, 1600)
    .compressed(80);

  let uuid = uuidv4();

  let upload_original = new Upload(original, bucket, `${uuid}/original.jpg`);
  await upload_original.perform();

  let upload_thumbnail = new Upload(thumbnail, bucket, `${uuid}/thumbnail.jpg`);
  await upload_thumbnail.perform();

  admin.firestore().collection('photos').add({
    title: title,
    original: upload_original.url(),
    thumbnail: upload_thumbnail.url(),
    created_at: Math.round((new Date()).getTime()/1000),
    captured_at: exif.captured_at,
    exif: exif.simplified()
  });

  // const exif = await picture.getExif();
  // fs.writeFileSync('compressed.jpg', compressed);
})();

