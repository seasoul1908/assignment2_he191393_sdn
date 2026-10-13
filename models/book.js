const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const bookSchema = new Schema({
    title: { type: String, required: true },

    author: { type: String, required: true },

    category: { type: String, required: true },

    isbn: { type: String, required: true, unique: true },

    publishedYear: { type: Number },

    totalCopies: { type: Number, min: 0 },

    availableCopies: { type: Number, min: 0 },

}, { timestamps: true });

module.exports = model("Book", bookSchema);
