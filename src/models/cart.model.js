import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    cartItems: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            name: {
                type: String,
            },
            image: {
                url: {
                    type: String,
                },
                public_id: {
                    type: String,
                }
            },
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                default: 1,
            }
        }
    ]


}, {
    timestamps: true,
});


const Cart = mongoose.model("Cart", cartSchema);
export default Cart;