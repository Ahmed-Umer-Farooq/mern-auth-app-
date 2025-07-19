// Import JWT for token verification
import jwt from 'jsonwebtoken';

// Middleware to authenticate user based on JWT token in cookies
const userAuth = async (req, res, next) => {
    // Get token from cookies
    const token = req.cookies.token;
    if(!token){
        // If no token, user is not authorized
        return res.json({ success: false, message: 'Unauthorized' });
    }
    try{
        // Verify the token using the secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Check if token contains a valid user id
        if (!decoded.id) {
            return res.json({ success: false, message: 'Not authorized, login again' });
        } else {
            // Attach userId to request for downstream use
            req.userId = decoded.id;
            next();
        }
    } catch(error) {
        // Handle invalid or expired token
        return res.json({ success: false, message: 'Not authorized, login again', error: error.message });
    }
};

// Export the middleware for use in routes
export default userAuth;