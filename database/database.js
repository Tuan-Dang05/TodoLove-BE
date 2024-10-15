const { MongoClient } = require('mongodb');

let client;
let db;

async function connectToDatabase() {
    if (!client) {
        client = new MongoClient(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
        });
    }

    if (!db) {
        try {
            await client.connect();
            db = client.db('TodoDB');
            console.log("Connected successfully to MongoDB");
        } catch (error) {
            console.error("Failed to connect to MongoDB:", error);
            throw error;
        }
    }

    return db;
}



module.exports = connectToDatabase;

