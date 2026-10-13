const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const memberSchema = new Schema({
    fullName: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    phone: { type: String, required: true },

    membershipType: {
        type: String,
        enum: ["Student", "Teacher", "Guest"]
    },

    isActive: { type: Boolean, default: true },

},

    { timestamps: true });
module.exports = model("Member", memberSchema);