const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// POST /api/auth/register
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password)
            return res.status(400).json({ message: "Username dan password wajib diisi" });

        const exists = await User.findOne({ username });
        if (exists)
            return res.status(400).json({ message: "Username sudah digunakan" });

        const hash = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hash });
        await user.save();

        res.status(201).json({ message: "Register berhasil! Silakan login." });
    } catch (err) {
        res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
    }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user)
            return res.status(404).json({ message: "User tidak ditemukan" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Password salah" });

        res.json({
            username: user.username,
            points: user.points,
            totalWaste: user.totalWaste
        });
    } catch (err) {
        res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
    }
});

// GET /api/auth/profile/:username
router.get("/profile/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select("-password");
        if (!user)
            return res.status(404).json({ message: "User tidak ditemukan" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
});

module.exports = router;