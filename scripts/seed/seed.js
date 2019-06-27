const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt')

const userData = require('./userData');
const customersData = require('./customersData')

const {
    DB_NAME = 'TAM',
    MONGO_DB_URI = 'mongodb://localhost:27017',
} = process.env;

async function seed() {
    const mongoUrl = `${MONGO_DB_URI}/${DB_NAME}`;
    const db = await MongoClient.connect(mongoUrl);

    await db.dropDatabase();
    
    const userCollection = db.collection('users')
    const customersCollection = db.collection('customers')

    userData.map(value =>{
        value.password = bcrypt.hashSync(value.password, 10)
    })

    await userCollection.insertMany(userData)
        .then(() => console.log("Inserted Users successfully"))
        .catch(() => {console.log('err')})

    await customersCollection.insertMany(customersData)
        .then(() => console.log("Inserted Customers successfully"))
        .catch(() => {console.log('err')})
    
    process.exit(0);
}

seed()