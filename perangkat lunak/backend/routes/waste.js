const express = require("express");
const router = express.Router();
const Waste = require("../models/Waste");
const User = require("../models/User");

// POST /api/waste — Tambah data sampah
router.post("/", async (req, res) => {
    try {
        const { username, type, weight } = req.body;
        if (!username || !type || !weight)
            return res.status(400).json({ message: "Semua field wajib diisi" });

        const earnedPoints = Math.round(parseFloat(weight) * 10);

        const waste = new Waste({ username, type, weight: parseFloat(weight), points: earnedPoints });
        await waste.save();

        const user = await User.findOne({ username });
        if (user) {
            user.points += earnedPoints;
            user.totalWaste += parseFloat(weight);
            await user.save();
        }

        res.json({
            message: "Data sampah berhasil disimpan",
            earnedPoints,
            totalPoints: user ? user.points : 0
        });
    } catch (err) {
        res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
    }
});

// GET /api/waste — Semua data sampah
router.get("/", async (req, res) => {
    try {
        const data = await Waste.find().sort({ date: -1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
});

// GET /api/waste/:username — Data sampah per user
router.get("/:username", async (req, res) => {
    try {
        const data = await Waste.find({ username: req.params.username }).sort({ date: -1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
});

module.exports = router;