import userModel from '../models/model.js';

// Controller to get user details by userId from auth middleware
export const getUser = async (req, res) => {
    try {
        const userId = req.userId; // Get userId from middleware
        if (!userId) {
            return res.json({ success: false, message: 'User id is required' });
        }
        // Find user by ID
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        // Respond with user data
        return res.json({
            success: true,
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified,
            }
        });
    } catch (error) {
        // Handle errors during user fetch
        return res.json({ success: false, message: 'Error getting user', error: error.message });
    }
};