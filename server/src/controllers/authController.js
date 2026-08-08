const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'defaultsecretkeyforroommatebudgetapp12345!', {
    expiresIn: '30d'
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ success: false, message: 'Please provide phone and password' });
    }

    const user = await User.findOne({ phone });

    if (user && (await user.matchPassword(password))) {
      if (!user.isActive) {
        return res.status(403).json({ success: false, message: 'Your account is deactivated' });
      }

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          token: generateToken(user._id),
          user: {
            _id: user._id,
            name: user.name,
            phone: user.phone,
            role: user.role,
            isActive: user.isActive
          }
        }
      });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid phone or password' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { loginUser, getMe };
