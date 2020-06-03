const functions       = require('firebase-functions');
const admin           = require('firebase-admin');
const FieldValue      = require('firebase-admin').firestore.FieldValue;
const cors            = require('cors')({ origin: true });
const serviceAccount  = require('./key/swd6-mgmt-firebase-adminsdk-9gglw-88d9af865e.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://swd6-mgmt.firebaseio.com',
});
const db = admin.firestore();

exports.removeCharacter = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    let format = req.query.format;
    if (!format) {
      format = req.body.format;
    }

    const { characterId } = JSON.parse(req.body);

    //Removes the character reference from the campaign docment
    db.collection('campaigns')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          db.collection('campaigns')
            .doc(doc.id)
            .update({
              characters: FieldValue.arrayRemove(characterId),
            });
          });

          db.collection('characters')
            .doc(characterId)
            .delete();
          return true;
      })
      .catch((error) => {
        console.log('Error getting documents: ', error);
      });

    // Removes the character document from the characters collection


    return res.set('Access-Control-Allow-Origin', '*').send({ error: false });
  });
});
