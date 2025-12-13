import User from "../models/user.model.js";
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { sendAccountVerificationEmail, sendEmailVerificationToken } from "../services/emailHandler.js";

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