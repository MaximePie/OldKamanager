import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from "mongoose";

const mongod = await MongoMemoryServer.create();

/**
 * Connect to the database
 */
export async function connect() {
  const uri = mongod.getUri();
  const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
  await mongoose.connect(uri, mongooseOptions);
}

export async function closeDatabase() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
}

export async function clearDatabase() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
}

export default {
  connect,
  closeDatabase,
  clearDatabase
}