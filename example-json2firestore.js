const serviceAccount = require('./service-account.json');
const { schema } = require('./schema');
const inputFilePath = './db.json';

const json2firestore = require('./json2firestore');
json2firestore(serviceAccount, schema, inputFilePath);
