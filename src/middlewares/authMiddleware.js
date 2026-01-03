import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");

        if (!token) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized - Token Not Found!"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(400).json({
                success: false,
                message: "Invalid Token!",
            });
        }

        console.log("dec => ", decoded);
        const user = await User.findById(decoded._id);
        console.log("deccc => ", user);

        req.user = user;

        next();



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong!",
        });
    }
}

