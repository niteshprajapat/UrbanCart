import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    orderItems: [
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
            }
        }
    ],
    shippingAddress: {
        fullName: {
            type: String,
        },
        phone: {
            type: String,
        },
        pincode: {
            type: String,
        },
        houseNo: {
            type: String,
        },
        area: {
            type: String,
        },
        landmark: {
            type: String,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
    },

    paymentMethod: {
        type: String,
        enum: ["cod", "online"],
        default: "cod",
    },

    itemsPrice: {
        type: Number,
        required: true,
    },
    shippingPrice: {
        type: Number,
        default: 0,
    },
    totalPrice: {
        type: Number,
        required: true,
    },

    isPaid: {
        type: Boolean,
        default: false,
    },
    paidAt: {
        type: Date,
    },

    codStatus: {
        type: String,
        enum: ["pending", "collected", "failed"],
        default: "pending",
    },
    orderStatus: {
        type: String,
        enum: ["processing", "shipped", "delivered", "cancelled"],
        default: "processing",
    },
    deliveredAt: {
        type: Date,
    },


}, {
    timestamps: true,
});


const Order = mongoose.model("Order", orderSchema);
export default Order;