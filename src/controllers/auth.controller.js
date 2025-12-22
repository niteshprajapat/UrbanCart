import User from "../models/user.model.js";
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import crypto from "crypto";
import { sendAccountVerificationEmail, sendEmailVerificationToken, sendForgotPasswordEmail, sendPasswordResetSuccessEmail, sendResetPasswordLinkEmail } from "../services/emailHandler.js";

// register
export const register = async (req, res) => {
    try {
        const { fullName, username, email, password, phone } = req.body;

        if (!fullName || !username || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!",
            });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: 'Email already Exists! Please use different email',
            });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({
                success: false,
                message: 'Username already Exists! Please use different username',
            });
        }


        const hashedPassword = await argon2.hash(password);

        const user = await User.create({
            username,
            fullName,
            email,
            password: hashedPassword,
            phone,
        });

        user.password = undefined;

        return res.status(201).json({
            success: true,
            message: "User Created Successfully!",
            user,
        })







    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong!"
        });
    }
}


// login
export const login = async (req, res) => {
    try {
        // const { username, email, password } = req.body;
        const { usernameOrEmail, password } = req.body;

        if (!usernameOrEmail || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!",
            });
        }

        const user = await User.findOne({
            $or: [
                { username: usernameOrEmail },
                { email: usernameOrEmail }
            ]
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User Not Found!",
            });
        }

        const isPasswordMatched = await argon2.verify(user.password, password);
        if (!isPasswordMatched) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials!",
            });
        }


        if (user.isVerified) {
            // token
            const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '1d',
            });

            return res.status(200).json({
                success: true,
                message: "User LoggedIn Successfully!",
                user,
                token,
            });
        } else {
            // sent token on email

            const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

            user.emailVerificationToken = verificationToken;
            user.emailVerificationTokenExpires = new Date(Date.now() + 5 * 60 * 1000);

            await user.save();

            // send token on mail;
            await sendEmailVerificationToken(user.email, verificationToken, user.username);

            return res.status(200).json({
                success: true,
                message: "Email Verification token has been sent to your Email",
            })


        }









    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong!"
        });
    }
}

// verifyAccount
export const verifyAccount = async (req, res) => {
    try {
        const { otp, email } = req.body;

        if (!otp || !email) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!",
            });
        }


        const user = await User.findOne({ email });
        if (user.isVerified) {
            return res.status(400).json({
                success: true,
                message: "Account is already Verified!",
            });
        }

        if (!otp || !user.emailVerificationToken) {
            return res.status(400).json({
                success: false,
                message: "Invalid Request!",
            });
        }

        if (otp !== user.emailVerificationToken) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP!",
            });
        }

        if (Date.now() > user.emailVerificationTokenExpires) {
            return res.status(400).json({
                success: false,
                message: "OTP expired!",
            });
        }


        // verify user
        user.isVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationTokenExpires = undefined;

        await user.save();

        await sendAccountVerificationEmail(email, user.username);


        return res.status(200).json({
            success: true,
            message: "Account verified Successfully!",
        })







    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong!"
        });
    }
}

// resendVerificationToken
export const resendVerificationToken = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!",
            });
        }


        const user = await User.findOne({ email });

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        user.emailVerificationToken = verificationToken;
        user.emailVerificationTokenExpires = new Date(Date.now() + 5 * 60 * 1000);

        await user.save();

        await sendEmailVerificationToken(email, verificationToken, user.username);

        return res.status(200).json({
            success: true,
            message: "Verification OTP sent again Successfully!",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong!"
        });
    }
}

// forgotPassword
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!",
            });
        }


        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User Not Found with this email!',
            });
        }

        const resetPasswordToken = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpires = new Date(Date.now() + 5 * 60 * 1000);

        await user.save();

        await sendForgotPasswordEmail(user.email, resetPasswordToken, user.email);

        return res.status(200).json({
            success: true,
            message: "Reset Password token is sent to your email, please check!",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong!"
        });
    }
}

// resetPassword
export const resetPassword = async (req, res) => {
    try {
        const { otp, email, newPassword } = req.body;

        if (!otp || !email || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!",
            });
        }


        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User Not Found with this email!',
            });
        }

        if (!otp || !user.resetPasswordToken) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Request!',
            });
        }

        if (otp !== user.resetPasswordToken) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Otp!',
            });
        }

        if (Date.now() > user.resetPasswordExpires) {
            return res.status(400).json({
                success: false,
                message: 'OTP Expired!!',
            });
        }


        const hashedNewPassword = await argon2.hash(newPassword);

        user.password = hashedNewPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        await sendPasswordResetSuccessEmail(user.email, user.username);

        return res.status(200).json({
            success: true,
            message: "Password Reset Successfully!",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong!"
        });
    }
}



// Forgot and reset password with LINK

// send reset password link
export const forgotPasswordWithLink = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required!",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!",
            });
        }

        // raw token (send via email)
        const resetToken = crypto.randomBytes(32).toString("hex");

        // hashed token (store in DB)
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min

        await user.save();

        // const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        const resetLink = `http://localhost:5000/api/v1/auth/reset-password2/${resetToken}`;

        await sendResetPasswordLinkEmail(
            user.email,
            user.username,
            resetLink
        );

        return res.status(200).json({
            success: true,
            message: "Password reset link sent to your email!",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong!",
        });
    }
};


// reset password via link
export const resetPassword2 = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Token and new password are required!",
            });
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset link!",
            });
        }

        user.password = await argon2.hash(newPassword);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        await sendPasswordResetSuccessEmail(user.email, user.username);

        return res.status(200).json({
            success: true,
            message: "Password reset successfully!",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong!",
        });
    }
};