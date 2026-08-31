import admin from '../config/firebase.js';
import User from '../modules/users/user.model.js';


const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'unauthorized: no token provided' });
    }
    // take the token from client side 
    const token = authHeader.split(' ')[1];

    try {
        // verify token
        const decodedToken = await admin.auth().verifyIdToken(token);

        let user = await User.findOne({ firebaseUid: decodedToken.uid });

        // create user if not exist
        if (!user) {
            user = await User.create({
                firebaseUid: decodedToken.uid,
                email: decodedToken.email,
                username: decodedToken.name || decodedToken.email.split('@')[0],
            });
        }

        // after authorization take the user from request
        req.user = {
            id: user._id,
            firebaseUid: user.firebaseUid,
            username: user.username,
            email: user.email,

        };

        next();

    } catch (error) {
        return res.status(401).json({ message: 'unauthorized: invalid token' });

    }

}

export default authMiddleware;