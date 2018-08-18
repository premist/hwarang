import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { File } from '@google-cloud/storage';

admin.initializeApp();

function generateTempURL(file: File) {
    const expires_at = new Date();
    expires_at.setHours(expires_at.getHours() + 2);

    return file.getSignedUrl({
        action: 'read',
        expires: expires_at
    });
}

function moveAndMakePublic(file: File, destination: string): Promise<string> {
    return file.move(destination).then(([newFile, _]) => {
        return newFile.makePublic()
    }).then((_) => {
        return Promise.resolve(destination)
    })
}

exports.processPublish = functions.database.ref('/publish/{id}').onCreate((snap, context) => {
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    const bucket = admin.storage().bucket(firebaseConfig.storageBucket);    

    const val = snap.val();
    const thumb = bucket.file(val.thumb);
    const large = bucket.file(val.large);

    return Promise.all([generateTempURL(thumb), generateTempURL(large)])
        .then(([thumbUrl, largeUrl]) => {
            return admin.firestore().collection('photos').add({
                title: 'Upload from Uploader',
                exif: val.exif,
                captured_at: val.captured_at,
                created_at: val.created_at,
                thumbnail: thumbUrl[0],
                original: largeUrl[0]
            })
        }).then((ref) => {
            return Promise.all([
                moveAndMakePublic(thumb, `photos/${ref.id}/thumb.jpg`),
                moveAndMakePublic(large, `photos/${ref.id}/large.jpg`)
            ]).then((values) => {
                const [newThumbPath, newLargePath] = values.map((v) => v[0])
                return ref.update({
                    thumbnail: `https://${firebaseConfig.storageBucket}/${newThumbPath}`,
                    original: `https://${firebaseConfig.storageBucket}/${newLargePath}`
                })
            })
        })
});