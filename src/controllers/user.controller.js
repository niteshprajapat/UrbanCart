import argon2 from "argon2";
import User from "../models/user.model.js";


// meProfile
export const meProfile = async (req, res) => {
    try {

        const user = req.user;

        return res.status(200).json({
            success: true,
            message: "Fetched Profile",
            user,
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong!",
        });
    }
}

// updateProfile
export const updateProfile = async (req, res) => {
    try {

        const user = req.user;

        return res.status(200).json({
            success: true,
            message: "Fetched Profile",
            user,
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong!",
        });
    }
}


// changePassword
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const userId = req.user._id;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(404).json({
                success: false,
                message: "All fields are required!",
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(404).json({
                success: false,
                message: "New Password do not match!",
            });
        }

        if (newPassword.length < 6) {
            return res.status(404).json({
                success: false,
                message: "New Password should be alteast 6 character long!",
            });
        }

        const user = await User.findById(userId);

        const isPasswordMatch = await argon2.verify(user.password, currentPassword);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        const hashedPassword = await argon2.hash(newPassword);

        user.password = hashedPassword;

        await user.save();


        return res.status(200).json({
            success: true,
            message: "Password CHanged Successfully!",
            user,
        });


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong!",
        });
    }
}

