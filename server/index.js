import dotenv from "dotenv";
import express from 'express';
import path from "path";
import { fileURLToPath } from "url";
import { connectToMongoDB } from "./database.js";
import router from './routes.js';
dotenv.config()
const app = express();

app.use(express.json())
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "build")));

app.use('/api', router)

app.get('/hello', (req, res) => {
  res.status(200).json({ mssg: "Hello Peoples..." })
})

const port = process.env.PORT || 4000;

async function startServer() {
  await connectToMongoDB();
  app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`)
  })
}
startServer()