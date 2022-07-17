/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-use-before-define */
/* eslint-disable no-continue */
/* eslint-disable no-console */
const admin = require('firebase-admin');
const fs = require('fs');

async function firestore2json(serviceAccount, schema, outputFilePath) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

  const f2jSubcollection = async (doc, collectionId, _data, _schema) => {
    const data = _data;
    if (
      !_schema[collectionId]
      || Object.keys(_schema[collectionId]).length === 0
    ) {
      return;
    }
    const subcollections = await doc.ref.listCollections();
    for (const subcollection of subcollections) {
      if (!_schema[collectionId][subcollection.id]) {
        continue;
      }
      const dbSubcollection = await subcollection.get();
      data[collectionId][doc.id][subcollection.id] = {};
      await f2jCollection(
        dbSubcollection,
        subcollection.id,
        data[collectionId][doc.id],
      );
    }
  };

  const f2jCollection = async (dbCollection, collectionId, _data) => {
    const data = _data;
    const promises = [];
    data[collectionId] = { __type__: 'collection' };
    dbCollection.forEach((doc) => {
      const docData = doc.data();
      Object.keys(docData).forEach((key) => {
        if (!docData[key] || !docData[key]._path) {
          return;
        }
        docData[key] = { _path: docData[key].path };
      });
      data[collectionId][doc.id] = docData;
      promises.push(f2jSubcollection(doc, collectionId, data, schema));
    });
    await Promise.all(promises);
  };

  const f2j = async (db, _schema) => {
    const data = {};
    for (const collectionId of Object.keys(_schema)) {
      const dbCollection = await db.collection(collectionId).get();
      await f2jCollection(dbCollection, collectionId, data, _schema);
    }
    return data;
  };

  const json = await f2j(admin.firestore(), schema);
  fs.writeFileSync(outputFilePath, JSON.stringify(json, null, 2), 'utf8');
  console.log('firestore2json done');
}

exports.firestore2json = firestore2json;
