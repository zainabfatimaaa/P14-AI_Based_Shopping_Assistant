import Tracking from '../models/Tracking.js';

export const trackBehavior = async (req, res) => {
    const { userId, productId, eventType, duration } = req.body;

    try {
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        let updateFields = { lastInteraction: new Date() };

        switch (eventType) {
            case 'click':
                updateFields.$inc = { totalClicks: 1 };
                break;
            case 'view':
                if (duration) {
                    updateFields.$inc = { totalViewTime: duration };
                }
                updateFields.$inc = { visitCount: 1 };
                break;
            case 'wishlist':
                updateFields.$inc = { wishlistCount: 1 };
                break;
            case 'redirection':
                updateFields.$inc = { redirectionClickCount: 1 };
                break;
            default:
                return res.status(400).json({ message: 'Invalid event type' });
        }

        
        await Tracking.findOneAndUpdate(
            { userId, productId },
            { $setOnInsert: { userId, productId }, ...updateFields },
            { upsert: true, new: true }
        );

        res.status(200).json({ message: 'Behavior tracked successfully' });

    } catch (error) {
        console.error('Error tracking behavior:', error);
        res.status(500).json({ message: 'Error tracking behavior', error });
    }
};
