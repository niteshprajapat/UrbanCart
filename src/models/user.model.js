import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        // required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    googleId: {
        type: String, // Stores the Google ID for OAuth users
        unique: true,
        sparse: true, // Allows null values while enforcing uniqueness
    },
    githubId: {
        type: String, // Stores the GitHub ID for OAuth users
        unique: true,
        sparse: true,
    },
    isDelete: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    avatar: {
        url: {
            type: String,
            default: "",
        },
        public_id: {
            type: String,
            default: "",
        }
    },
    role: {
        type: String,
        enum: ["user", "admin", "super-admin"],
        default: "user",
    },
    isPrime: {
        type: Boolean,
        default: false,
    },
    primeSubscribedAt: {
        type: Date,
    },
    primeExpiresAt: {
        type: Date,
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date
    },
    loginHistory: [
        {
            ip: String,
            device: String,
            timestamp: { type: Date, default: Date.now },
            status: { type: String, enum: ["success", "failed"], default: "success" },
        }
    ],

}, {
    timestamps: true,
});


const User = mongoose.model("User", userSchema);
export default User;