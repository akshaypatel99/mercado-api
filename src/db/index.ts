import dotenv from 'dotenv';
import { mongo } from '../config/environment'
import { connect } from 'mongoose';

dotenv.config();

// Mongoose Connection
const connectDB = async () => {
  try {
    if (!mongo.url) {
      process.exit(1);
    }
    const connected = await connect(mongo.url);
    console.log(`MongoDB Connected: ${connected.connection.host}`);
    return connected;
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
}

export default connectDB;