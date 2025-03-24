import express from 'express';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url'; 
import Routes from './routes/routes.js'; 

dotenv.config();

// Get the directory of the current module (ES module alternative to __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.static('Design'));
app.use(express.urlencoded({ extended: true }));
// Set up static file serving for images
const imagesDir = path.join(__dirname, '../frontend/public/images');
app.use('/images', express.static(imagesDir));

// const PORT = process.env.PORT || 10000;
const PORT = 10000;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
  console.error("MONGODB_URI is not defined in the .env file");
  process.exit(1);
}


mongoose.connect(mongoURI).then(() => {
  console.log("Connected to MongoDB Atlas");
  console.log('Connected Database:', mongoose.connection.db.databaseName);
}).catch((error) => {
  console.error("Error connecting to MongoDB Atlas:", error);
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use('/api', Routes);



export default app;
