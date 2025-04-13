import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Account from '../models/UserAccount.js';

const router = express.Router();
const JWT_SECRET = 'Ahmad Jabbar'; 


const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
  return passwordRegex.test(password);
};

router.post('/', async (req, res) => {
  try {
    const { currentPassword, newPassword, token } = req.body;

    if (!token) return res.status(401).json({ message: 'No token provided' });

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const userId = decoded.userId;

    const user = await Account.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });

    if (!isValidPassword(newPassword)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long and contain one uppercase letter, one lowercase letter, and one special character.',
      });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ message: 'New password cannot be the same as the old password' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    //user.password = newPassword;
    user.password = hashedPassword;

    await user.save();
    console.log("SAVED");

    res.json({ message: 'Password changed successfully', success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
