const admin = require('firebase-admin');
const fs = require('fs');

async function json2firestore(serviceAccount, schema, inputFilePath) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

  const j2f = async (json, db, _schema) => {
    for (let collection of Object.keys(_schema)) {
      if (!json[collection]) {
        continue;
      }
      for (let doc of Object.keys(json[collection])) {
        if (doc === '__type__') continue;
        const docId = doc;
        const docData = { ...json[collection][doc] };
        Object.keys(docData).forEach((data) => {
          if (docData[data] && docData[data].__type__) {
            delete docData[data];
            return;
          }
          if (docData[data] && docData[data]._path && Object.keys(docData[data]).length === 1) {
            docData[data] = db.doc(docData[data]._path);
            return;
          }
          if (
            docData[data] &&
            docData[data]._latitude !== undefined &&
            docData[data]._longitude !== undefined &&
            Object.keys(docData[data]).length === 2
          ) {
            docData[data] = new admin.firestore.GeoPoint(
              docData[data]._latitude,
              docData[data]._longitude
            );
          }
        });
        await db.collection(collection).doc(docId).set(docData);
        await j2f(json[collection][doc], db.collection(collection).doc(docId), _schema[collection]);
      }
    }
  };

  await j2f(JSON.parse(fs.readFileSync(inputFilePath, 'utf8')), admin.firestore(), schema);
  console.log('done');
}

exports.json2firestore = json2firestore;
