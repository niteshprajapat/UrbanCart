import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },
    comment: {
        type: String,
        trim: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    }

}, {
    timestamps: true,
});


const Review = mongoose.model("Review", reviewSchema);
export default Review;