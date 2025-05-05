// const express = require('express');
// const bcrypt = require('bcrypt');
// const { MongoClient } = require('mongodb');
// const bodyParser = require('body-parser');
// const Chatbot = require('./chatbot'); // Assuming you have chatbot logic in a separate file

// const router = express.Router();

// // MongoDB setup
// const mongoClient = new MongoClient("mongodb+srv://AhmadJb:F6ndXplHiGRKfR56@products.btwmn.mongodb.net/");
// let usersCollection;

// mongoClient.connect()
//     .then(client => {
//         const db = client.db("LLMs_Project");
//         usersCollection = db.collection("Users");
//         console.log("Connected to MongoDB");
//     })
//     .catch(err => console.error("MongoDB connection error:", err));

// // Chatbot instance
// const chatbot = new Chatbot();

// // Middleware
// router.use(bodyParser.json());

// // Route for registering a user
// router.post('/register', async (req, res) => {
//     try {
//         const { username, password, email } = req.body;

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const user = {
//             username,
//             password: hashedPassword,
//             email,
//             preferences: {}
//         };

//         await usersCollection.insertOne(user);
//         res.status(201).json({ message: "User registered successfully" });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });

// // Route for logging in a user
// router.post('/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         const user = await usersCollection.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ error: "Invalid email or password." });
//         }

//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             return res.status(400).json({ error: "Invalid email or password." });
//         }

//         res.json({ message: "Login successful!" });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });

// // Route for registering with preferences
// router.post('/register_with_preferences', async (req, res) => {
//     try {
//         const { username, email, password, preferredColors, wearTypes, fashionStyles } = req.body;

//         const hashedPassword = await bcrypt.hash(password, 10);

//         await usersCollection.updateOne(
//             { username },
//             {
//                 $set: {
//                     preferences: {
//                         colors: preferredColors,
//                         wearTypes,
//                         fashionStyles
//                     },
//                     password: hashedPassword
//                 }
//             }
//         );

//         res.json({ message: "User registered with preferences successfully" });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });

// // Chatbot route
// router.post('/', async (req, res) => {
//     const { message } = req.body;

//     try {
//         const userMessages = [];
//         const chatbotResponses = [];
//         const conversationHistory = {};

//         for (let i = 0; i < userMessages.length; i++) {
//             conversationHistory[userMessages[i]] = chatbotResponses[i];
//         }

//         const retrievalChainResponse = chatbot.retrievalChain(conversationHistory, message);
//         const botResponse = chatbot.responseChain(message, retrievalChainResponse, conversationHistory);

//         chatbotResponses.push(botResponse);
//         userMessages.push(message);

//         const ids = chatbot.extractByKeyword(retrievalChainResponse);

//         console.log(conversationHistory);
//         res.json({ response: botResponse, ids });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: `Error: ${err.message}` });
//     }
// });

// module.exports = router;
