
import jwt from 'jsonwebtoken';
import express from 'express';
import Account from '../models/UserAccount.js';

const router = express.Router();

const verifyToken = (req, res, next) => { // verifies the user
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
  console.log(token);

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'Ahmad Jabbar'); 

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ message: 'Unauthorized: Invalid token' });
  }
};

router.get('/', verifyToken, async (req, res) => { //fetches user info after verification
  try {
    const user = await Account.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      userId: user._id,
      email: user.email,
      fullName: user.fullName, 

    });
  } catch (error) {
    console.error('Error fetching user information:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
