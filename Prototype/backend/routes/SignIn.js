import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import express from 'express';
import Account from '../models/UserAccount.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password } = req.body;
  console.log(email,password);

  try {
    const user = await Account.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, 'Ahmad Jabbar', { expiresIn: '1h' });
    console.log(token);

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
