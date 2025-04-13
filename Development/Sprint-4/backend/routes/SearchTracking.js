import express from 'express';
import SearchHistory from '../models/SearchHistory.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { userId, query } = req.body;

    if (!userId || !query) {
      return res.status(400).json({ error: "User ID and query are required" });
    }

    const searchEntry = new SearchHistory({ userId, query });
    await searchEntry.save();

    res.status(200).json({ message: "Search query logged successfully" });
  } catch (error) {
    console.error("Error logging search query:", error);
    res.status(500).json({ error: "Failed to log search query" });
  }
});

export default router;
