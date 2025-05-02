const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenUtils');

// Cookie options centralized
const cookieOptions = {
  httpOnly: true,
  secure: true, // set to false for local dev if not using HTTPS
  sameSite: 'strict',
  maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
};

// @desc    Login user
// @route   POST /auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
    const {email, password } = req.body

    if(!email||!password){
        return res.status(400).json({Message: 'All fields Required'})
    }

    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) {
        return res.status(401).json({ Message: 'Unauthorized' });
    }

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) return res.status(401).json({ Message: 'Unauthorized' });

    const accessToken = generateAccessToken(foundUser);
    const refreshToken = generateRefreshToken(foundUser);

    res.cookie('jwt', refreshToken, cookieOptions);
    res.json({ accessToken });
});

// @desc    Refresh access token
// @route   GET /auth/refresh
// @access  Public (requires refresh token cookie)
const refresh = asyncHandler(async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' });

    const refreshToken = cookies.jwt;
    let decoded;
    try {
        decoded = await new Promise((resolve, reject) => {
            require('jsonwebtoken').verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET,
                (err, decoded) => {
                    if (err) reject(err);
                    else resolve(decoded);
                }
            );
        });
    } catch (err) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    // Use email for lookup (consistent with login)
    const foundUser = await User.findOne({ email: decoded.email }).exec();
    if (!foundUser) return res.status(401).json({ message: 'Unauthorized' });
    const accessToken = generateAccessToken(foundUser);
    res.json({ accessToken });
});


  

// @desc    Logout user (clear refresh token cookie)
// @route   POST /auth/logout
// @access  Public
const logout = asyncHandler(async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // No content, nothing to clear
    res.clearCookie('jwt', { ...cookieOptions, sameSite: 'strict' });
    res.json({ Message: 'Cookie Cleared' });
});

// @desc    Register a new user
// @route   POST /auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
        return res.status(409).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
    });

    res.status(201).json({ message: 'User registered successfully', userId: user._id });
});

module.exports = {
    logout,
    refresh,
    login,
    register,
};