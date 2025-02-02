// import express from 'express';
// import Account from '../models/UserAccount.js';

// const router = express.Router();
// router.post('/', async (req, res) => {
//   const { fullName, username, email, password } = req.body;

//   try {
//     const existingUser = await Account.findOne({ username });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Username already exists' });
//     }

//     const existingEmail = await Account.findOne({ email });
//     if (existingEmail) {
//       return res.status(400).json({ message: 'Email already exists' });
//     }

//     const newUser = new Account({ fullName, username, email, password });
//     await newUser.save();
//     res.status(201).json({ message: 'Account created successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// });

// export default router;


import express from 'express';
import Account from '../models/UserAccount.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { fullName, username, email, password } = req.body;

  try {
    // Check if username already exists
    const existingUser = await Account.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Check if email already exists
    const existingEmail = await Account.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Create new user account
    const newUser = new Account({ fullName, username, email, password });
    await newUser.save();

    res.status(201).json({ message: 'Account created successfully' });
  } catch (error) {
    console.error('Error during account creation:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
