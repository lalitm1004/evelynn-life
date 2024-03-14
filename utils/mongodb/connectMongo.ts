import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI as string;
const cached: { connection?: typeof mongoose; promise?: Promise<typeof mongoose>} = {};
async function connectMongo() {
  if (!MONGO_URI) throw new Error("Define MONGO_URI correctly in .env.local");

  if (cached.connection) return cached.connection;

  if (!cached.promise) {
    const opts = {
      dbName: 'evelynn',
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(MONGO_URI, opts);
  }

  try {
    cached.connection = await cached.promise;
  } catch (e) {
    cached.promise = undefined;
    throw e;
  }
  return cached.connection;
}

export default connectMongo;