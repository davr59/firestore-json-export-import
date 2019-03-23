const admin = require('firebase-admin');
const fs = require('fs');

const serviceAccount = require('./service-account-firestore2json.json');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const schema = require('./schema').schema;

const firestore2json = (db, schema, current) => {
  return Promise.all(
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
  ).then(() => current);
};

firestore2json(admin.firestore(), { ...schema }, {}).then(res =>
  fs.writeFileSync('./db.json', JSON.stringify(res, null, 2), 'utf8')
);
