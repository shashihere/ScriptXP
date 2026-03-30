const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    // Try connecting to the configured MONGO_URI first
    if (process.env.MONGO_URI && process.env.MONGO_URI !== 'mongodb://localhost:27017/code-nexus') {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return;
    }

    // Fall back to in-memory MongoDB for local development
    console.log('⏳ Starting in-memory MongoDB server...');
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`✅ In-Memory MongoDB Connected: ${conn.connection.host}`);
    console.log('📝 Note: Data will not persist between restarts. Set MONGO_URI in .env for persistent storage.');
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
