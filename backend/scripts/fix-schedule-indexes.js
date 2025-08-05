import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const fixScheduleIndexes = async () => {
  try {
    const db = mongoose.connection.db;
    const collection = db.collection('schedules');
    
    // Get all indexes
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes);
    
    // Drop any unique indexes on provider, date, timeSlot
    for (const index of indexes) {
      if (index.unique && 
          index.key && 
          index.key.provider === 1 && 
          index.key.date === 1 && 
          index.key.timeSlot === 1) {
        console.log('Dropping unique index:', index.name);
        await collection.dropIndex(index.name);
      }
    }
    
    // Create non-unique index
    await collection.createIndex(
      { provider: 1, date: 1, timeSlot: 1 },
      { unique: false }
    );
    
    console.log('Schedule indexes fixed successfully');
  } catch (error) {
    console.error('Error fixing indexes:', error);
  }
};

const main = async () => {
  await connectDB();
  await fixScheduleIndexes();
  await mongoose.disconnect();
  console.log('Done');
};

main(); 