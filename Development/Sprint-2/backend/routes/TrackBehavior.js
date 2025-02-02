import Tracking from '../models/Tracking.js';

export const trackBehavior = async (req, res) => {
    const { userId, productId, eventType, duration } = req.body;

    try {
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        // Find the tracking record for this user-product pair
        const existingTracking = await Tracking.findOne({ userId, productId });

        if (existingTracking) {
            // Update the record based on the event type
            switch (eventType) {
                case 'click':
                    existingTracking.totalClicks += 1;
                    break;
                case 'view':
                    if (duration) {
                        existingTracking.totalViewTime += duration;
                    }
                    break;
                case 'wishlist':
                    existingTracking.wishlistCount += 1;
                    break;
                default:
                    return res.status(400).json({ message: 'Invalid event type' });
            }
            existingTracking.lastInteraction = new Date(); // Update last interaction timestamp
            await existingTracking.save();
        } else {
            // Create a new record if not found
            const newTracking = new Tracking({
                userId,
                productId,
                totalClicks: eventType === 'click' ? 1 : 0,
                totalViewTime: eventType === 'view' && duration ? duration : 0,
                wishlistCount: eventType === 'wishlist' ? 1 : 0,
            });
            await newTracking.save();
        }

        res.status(200).json({ message: 'Behavior tracked successfully' });
    } catch (error) {
        console.error('Error tracking behavior:', error);
        res.status(500).json({ message: 'Error tracking behavior', error });
    }
};
