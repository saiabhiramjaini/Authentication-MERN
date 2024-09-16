const bcrypt = require("bcrypt");
const z = require("zod");
const jwt = require("jsonwebtoken");
const { signUpSchema, signInSchema, forgotPasswordSchema, resetPasswordSchema } = require('../utils/zodSchema');

const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");

const signup = async (req, res) => {
    try {
        // Validate request body against the schema
        const { username, email, password, cPassword } = signUpSchema.parse(req.body);

        // Password match validation
        if (password !== cPassword) {
            return res.json({ msg: "Passwords do not match" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ msg: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const createdUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        // Generate token
        const token = jwt.sign({ id: createdUser._id }, process.env.SECRET);
        res.cookie('token', token, { httpOnly: true });
        return res.json({ msg: "User created Successfully" });
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors.map(err => err.message);
            return res.status(400).json({ msg: errorMessages });
        }
        return res.status(500).json({ msg: "Server error" });
    }
}


const signin = async (req, res) => {
    try {
        // Validate request body against the schema
        const { email, password } = signInSchema.parse(req.body);

        // Basic validation
        if (!email || !password) {
            return res.json({ msg: "Please enter all fields" });
        }

        // Find user by email
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.json({ msg: "User-Email not registered" });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, existingUser.password);
        if (!passwordMatch) {
            return res.json({ msg: "Invalid credentials" });
        }

        // Generate token
        const token = jwt.sign({ id: existingUser._id }, process.env.SECRET);
        res.cookie('token', token, { httpOnly: true });
        return res.json({ msg: "Signin successful" });
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors.map(err => err.message);
            return res.status(400).json({ msg: errorMessages });
        }
        return res.status(500).json({ msg: "Server error" });
    }
}


const forgotPassword = async (req, res) => {
    try {
        // Validate request body against the schema
        const { email } = forgotPasswordSchema.parse(req.body);

        // Find user by email
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Generate token
        const token = jwt.sign({ id: existingUser._id }, process.env.SECRET, { expiresIn: "1d" });
        const resetUrl = `http://localhost:5173/resetPassword/${token}`;
        const emailResult = await sendEmail(email, "Reset password", resetUrl);

        // Send email
        if (emailResult.success) {
            return res.json({ msg: "Email sent successfully" });
        } else {
            return res.status(500).json({ msg: emailResult.error });
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors.map(err => err.message);
            return res.status(400).json({ msg: errorMessages });
        }
        return res.status(500).json({ msg: "Server error" });
    }
}


const resetPassword = async (req, res) => {
    try {
        // Verify token
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.SECRET); // Verify token
        const { password, cPassword } = resetPasswordSchema.parse(req.body);

        if (password !== cPassword) {
            return res.status(400).json({ msg: "Passwords do not match" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the password in MongoDB
        await User.findOneAndUpdate({ _id: decoded.id }, { password: hashedPassword });

        return res.json({ msg: "Password updated successfully" });
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors.map(err => err.message);
            return res.status(400).json({ msg: errorMessages });
        }
        return res.status(500).json({ msg: "Server error" });
    }
}


const profile = async (req, res) => {
    try {
        // Get user information from middleware
        const user = req.user;
        const userProfile = await User.findOne({ email: user.email });

        // Return user profile
        return res.json({
            username: userProfile.username,
            email: userProfile.email,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors.map(err => err.message);
            return res.status(400).json({ msg: errorMessages });
        }
        return res.status(500).json({ msg: "Server error" });
    }
}


const logout = (req, res) => {
    // Clear token cookie
    res.clearCookie('token');
    return res.json({ msg: "Logged out successfully" });
}
module.exports = {signup, signin, forgotPassword, resetPassword, profile, logout};