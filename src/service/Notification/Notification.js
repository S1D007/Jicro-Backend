const admin = require('firebase-admin');
const serviceAccount = require('./firebase.json');

const FCMinit = () => {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
}

module.exports = FCMinit