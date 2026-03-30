const mongoose = require("mongoose");

const WasteSchema = new mongoose.Schema({
    username: { type: String, required: true },
    type: { type: String, required: true },
    weight: { type: Number, required: true },
    points: { type: Number, default: 0 },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Waste", WasteSchema);