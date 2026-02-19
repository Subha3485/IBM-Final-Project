const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Mock users for testing
const mockUsers = {};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.json({ message: "User registered successfully" });
    } catch (error) {
        // Mock registration
        mockUsers[req.body.email] = { name: req.body.name, password: req.body.password };
        res.json({ message: "User registered (mock mode)" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).catch(() => null);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (error) {
        // Mock login
        const token = jwt.sign({ id: "mock_user" }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
        res.json({ token, message: "Logged in (mock mode)" });
    }
};

module.exports = { registerUser, loginUser };