const { MongoClient } = require('mongodb');
const cron = require('node-cron');

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

// Kiểm tra và duy trì kết nối mỗi 1 phút
cron.schedule('* * * * *', async () => {
    try {
        const database = await connectToDatabase();
        await database.command({ ping: 1 });
        console.log("Database connection is alive");
    } catch (error) {
        console.error("Error in database connection check:", error);
        // Đặt db về null để kích hoạt kết nối lại trong lần gọi tiếp theo
        db = null;
    }
});

module.exports = connectToDatabase;