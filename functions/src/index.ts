import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { File } from '@google-cloud/storage';

admin.initializeApp();

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
const bucket = admin.storage().bucket(firebaseConfig.storageBucket);    

const firestore = admin.firestore();
firestore.settings({ timestampsInSnapshots: true });

exports.deleteFilesOnDocumentDeletion = functions.firestore.document('/photos/{id}').onDelete((snap, context) => {
    const data = snap.data();
    const thumb = bucket.file(getPathFromStorageURL(data.thumbnail));
    const original = bucket.file(getPathFromStorageURL(data.original));

    return Promise.all([thumb.delete(), original.delete()])
});

exports.processPublish = functions.database.ref('/publish/{id}').onCreate((snap, context) => {
    const val = snap.val();
    const thumb = bucket.file(val.thumb);
    const large = bucket.file(val.large);

    return thumb.download().then((buffer) => {
        // Temporary use base64 thumbnail image while the image itself gets copied and made public
        const encodedThumb = `data:image/jpeg;base64, ${buffer[0].toString('base64')}`;

        return firestore.collection('photos').add({
            title: 'Upload from Uploader',
            exif: val.exif,
            captured_at: new Date(val.captured_at*1000),
            created_at: new Date(),
            thumbnail: encodedThumb,
            original: encodedThumb
        })    
    }).then((ref) => {
        return Promise.all([
            moveAndMakePublic(thumb, `photos/${ref.id}/thumb.jpg`),
            moveAndMakePublic(large, `photos/${ref.id}/large.jpg`)
        ]).then((values) => {
            const [newThumbPath, newLargePath] = values
            return ref.update({
                thumbnail: `https://storage.googleapis.com/${firebaseConfig.storageBucket}/${newThumbPath}`,
                original: `https://storage.googleapis.com/${firebaseConfig.storageBucket}/${newLargePath}`
            })
        })
    }).then((_) => {
        return snap.ref.remove()
    })
});


// Remove prefixes (https://storage.googleapis.com/BUCKETNAME) from URL
function getPathFromStorageURL(url: string): string {
    return url.split("/").slice(4).join("/")
}

function moveAndMakePublic(file: File, destination: string): Promise<string> {
    return file.move(destination).then(([newFile, _]) => {
        return newFile.makePublic()
    }).then((_) => {
        return Promise.resolve(destination)
    })
}