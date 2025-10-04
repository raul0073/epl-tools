// lib/db/mongodb.ts
import { MongoClient } from "mongodb";
import { config } from "../config";

const uri = config.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI not defined");

// --- Extend NodeJS global type ---
declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
}

let client: MongoClient;

if (process.env.NODE_ENV === "development") {
  // Prevent multiple connections in dev with hot reload
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri);
  }
  client = global._mongoClient;
} else {
  client = new MongoClient(uri);
}

export default client;
