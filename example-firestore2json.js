const serviceAccount = require('./service-account.json');
const { schema } = require('./schema');
const outputFilePath = './db.json';

const firestore2json = require('./firestore2json');
firestore2json(serviceAccount, schema, outputFilePath);
