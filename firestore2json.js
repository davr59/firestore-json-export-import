const admin = require('firebase-admin');
const fs = require('fs');

async function firestore2json(serviceAccount, schema, outputFilePath) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

  const f2j_subcollection = async (doc, collection_id, _data, _schema) => {
    let data = _data;
    if (!_schema[collection_id] || Object.keys(_schema[collection_id]).length === 0) {
      return;
    }
    const subcollections = await doc.ref.listCollections();
    for (let subcollection of subcollections) {
      if (!_schema[collection_id][subcollection.id]) {
        continue;
      }
      const dbSubcollection = await subcollection.get();
      data[collection_id][doc.id][subcollection.id] = {};
      await f2j_collection(
        dbSubcollection,
        subcollection.id,
        data[collection_id][doc.id],
        _schema[collection_id][subcollection.id]
      );
    }
  };

  const f2j_collection = async (dbCollection, collection_id, _data, _schema) => {
    let data = _data;
    const promises = [];
    data[collection_id] = { __type__: 'collection' };
    dbCollection.forEach((doc) => {
      const docData = doc.data();
      Object.keys(docData).forEach((key) => {
        if (!docData[key] || !docData[key]._path) {
          return;
        }
        docData[key] = { _path: docData[key].path };
      });
      data[collection_id][doc.id] = docData;
      promises.push(f2j_subcollection(doc, collection_id, data, schema));
    });
    await Promise.all(promises);
  };

  const f2j = async (db, _schema) => {
    const data = {};
    for (let collection_id of Object.keys(_schema)) {
      const dbCollection = await db.collection(collection_id).get();
      await f2j_collection(dbCollection, collection_id, data, _schema);
    }
    return data;
  };

  const json = await f2j(admin.firestore(), schema);
  fs.writeFileSync(outputFilePath, JSON.stringify(json, null, 2), 'utf8');
  console.log('done');
}

exports.firestore2json = firestore2json;
