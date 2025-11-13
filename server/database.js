import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";
dotenv.config()

const uri = process.env.MONGODB_URL;

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
}

let client;
async function connectToMongoDB() {
  if (!client) {
    try {
      client = new MongoClient(uri, options)
      await client.connect();
      console.log("MongoDB Connected!")
    } catch (error) {
      console.error("MongoDB Connection Failed: ", error)
    }
  }
  return client;
}
const getConnectedClient = () => client;

export { connectToMongoDB, getConnectedClient };

