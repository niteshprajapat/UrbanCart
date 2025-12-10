import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    alternatePhone: {
        type: String
    },

    pincode: {
        type: String,
        required: true,
    },
    houseNo: {
        type: String,
        required: true,
    },
    area: {
        type: String,
        required: true,
    },
    landmark: {
        type: String,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    addressType: {
        type: String,
        enum: ["home", "work", "other"],
        default: "home",
    },
    isDelete: {
        type: Boolean,
        default: false
    },

}, {
    timestamps: true,
});


const Address = mongoose.model("Address", addressSchema);
export default Address;