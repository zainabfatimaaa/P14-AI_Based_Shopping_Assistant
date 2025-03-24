import express from 'express';
import Account from '../models/UserAccount.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const existingEmail = await Account.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const newUser = new Account({ fullName, email, password });
    await newUser.save();

    res.status(201).json({ message: 'Account created successfully' });
  } catch (error) {
    console.error('Error during account creation:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
