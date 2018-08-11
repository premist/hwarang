import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

exports.processPublish = functions.database.ref('/publish/{id}').onCreate((snap, context) => {
    let val = snap.val();

    admin.firestore().collection('photos').add({
        title: "Hello",
        original: 
    });
    
    console.log(snap.val());
});