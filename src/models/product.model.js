import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    images: [
        {
            url: {
                type: String,
                default: "",
            },
            public_id: {
                type: String,
                default: "",
            },
        }
    ],
    isVerified: {
        type: Boolean,
        required: true,
    },
    isDelete: {
        type: Boolean,
        default: false
    },




}, {
    timestamps: true,
});


const Product = mongoose.model("Product", productSchema);
export default Product;