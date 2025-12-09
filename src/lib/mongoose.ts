import mongoose from "mongoose";
import { MONGODB_URI } from "./constants";

declare global {
  var _mongooseConn: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

if (!global._mongooseConn) {
  global._mongooseConn = { conn: null, promise: null };
}

export default async function connectDB() {
  if (global._mongooseConn.conn) return global._mongooseConn.conn;

  if (!global._mongooseConn.promise) {
    const opts = {
      bufferCommands: false,
    };

    global._mongooseConn.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        return mongoose;
      });
  }

  try {
    global._mongooseConn.conn = await global._mongooseConn.promise;
  } catch (e) {
    global._mongooseConn.promise = null;
    throw e;
  }

  return global._mongooseConn.conn;
}
