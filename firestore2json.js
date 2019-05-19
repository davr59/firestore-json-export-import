const admin = require('firebase-admin');
const fs = require('fs');

function firestore2json(serviceAccount, schema, outputFilePath) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

  const firestore2json = async (db, schema, current) => {
    await Promise.all(
      Object.keys(schema).map(collection => {
        return db
          .collection(collection)
          .get()
          .then(data => {
            let promises = [];
            data.forEach(doc => {
              if (!current[collection]) current[collection] = { __type__: 'collection' };
              current[collection][doc.id] = doc.data();
              promises.push(
                firestore2json(
                  db.collection(collection).doc(doc.id),
                  schema[collection],
                  current[collection][doc.id]
                )
              );
            });
            return Promise.all(promises);
          });
      })
    );
    return current;
  };

  firestore2json(admin.firestore(), { ...schema }, {}).then(res => {
    fs.writeFileSync(outputFilePath, JSON.stringify(res, null, 2), 'utf8');
    console.log('done');
  });
}

exports.firestore2json = firestore2json;
