import mongoose from 'mongoose';
import Event from './models/Event.js';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_CONNECTION_URL);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const checkEvents = async () => {
  await connectDB();
  try {
    const count = await Event.countDocuments();
    console.log(`Total events in database: ${count}`);
    const events = await Event.find({});
    console.log('Events:', JSON.stringify(events, null, 2));
  } catch (error) {
    console.error('Error fetching events:', error);
  } finally {
    mongoose.connection.close();
  }
};

checkEvents();
