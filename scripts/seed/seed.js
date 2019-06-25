const { MongoClient } = require('mongodb');

const userData = require('./userData');
const {
    DB_NAME = 'TAM',
    MONGO_DB_URI = 'mongodb://localhost:27017',
} = process.env;

async function seed() {
    const mongoUrl = `${MONGO_DB_URI}/${DB_NAME}`;
    const db = await MongoClient.connect(mongoUrl);

    await db.dropDatabase();
    
    const userCollection = db.collection('users')

    await userCollection.insertMany(userData)
        .then(() => console.log("Inserted successfully"))
        .catch(() => {console.log('err')})

    process.exit(0);

}

seed()