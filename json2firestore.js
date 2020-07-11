const admin = require('firebase-admin');
const fs = require('fs');

function json2firestore(serviceAccount, schema, inputFilePath) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

  const j2f = (json, db, _schema) =>
    Promise.all(
      Object.keys(_schema).map((collection) => {
        const promises = [];
        Object.keys(json[collection]).forEach((doc) => {
          const docId = doc;
          if (doc === '__type__') return;
          const docData = { ...json[collection][doc] };
          Object.keys(docData).forEach((data) => {
            if (docData[data] && docData[data].__type__) delete docData[data];
            if (docData[data]._path) {
              docData[data] = db.doc(docData[data]._path);
            }
          });
          promises.push(
            db
              .collection(collection)
              .doc(docId)
              .set(docData)
              .then(() =>
                j2f(
                  json[collection][doc],
                  db.collection(collection).doc(docId),
                  _schema[collection]
                )
              )
          );
        });
        return Promise.all(promises);
      })
    );

  j2f(JSON.parse(fs.readFileSync(inputFilePath, 'utf8')), admin.firestore(), {
    ...schema,
  }).then(() => console.log('done'));
}

exports.json2firestore = json2firestore;
