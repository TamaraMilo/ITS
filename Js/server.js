const cron = require('node-cron');

const admin = require('firebase-admin');
const serviceAccount = require('./onradar-fc5d3-firebase-adminsdk-m5fg3-4672d44b33.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://onradar-fc5d3-default-rtdb.europe-west1.firebasedatabase.app"
  });

const db = admin.database();

const oneHourInMillis = 3600000;
const currentTimeMillis = Date.now();


function checkIfPinIsValid() { 
    db.ref('pins').once('value').then((snapshot) => {
        const data = snapshot.val();

        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const timestampSeconds = data[key].timestamp; 
            const timestampMillis = timestampSeconds * 1000; 
        
            if (currentTimeMillis - timestampMillis > oneHourInMillis) {
                removePinWithID(data[key].id)
            } 
          }
        }
    });
};

function removePinWithID(id) {
    db.ref('pins/'+id).remove().then( () => {
        console.log(`One hour has passed for entry with ID: ${data[key].id}`);
    }).catch((error) => {
        console.log('Delete failed: ' + error.message);
    })
}
    
cron.schedule('0 * * * *', () => {
    checkIfPinIsValid();
});