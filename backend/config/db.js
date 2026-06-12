const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/stellarmind', {
      serverSelectionTimeoutMS: 10000, // Timeout sau 10 giây nếu không kết nối được
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    console.error(`   MONGO_URI: ${process.env.MONGO_URI ? '***configured***' : 'NOT SET - using localhost'}`);
    // Không exit ngay, thử fallback sang localhost
    try {
      console.log('⏳ Trying fallback to localhost...');
      const fallback = await mongoose.connect('mongodb://127.0.0.1:27017/stellarmind');
      console.log(`✅ Fallback MongoDB Connected: ${fallback.connection.host}`);
    } catch (fallbackError) {
      console.error(`❌ Fallback also failed: ${fallbackError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
