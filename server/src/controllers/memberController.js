const User = require('../models/User');

// @desc    Get all members
// @route   GET /api/members
// @access  Private
const getMembers = async (req, res, next) => {
  try {
    const members = await User.find({}).select('-password').sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: members
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new member
// @route   POST /api/members
// @access  Private/Admin
const createMember = async (req, res, next) => {
  try {
    const { name, phone, password, role } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, phone, and password' });
    }

    const userExists = await User.findOne({ phone });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this phone number already exists' });
    }

    const member = await User.create({
      name,
      phone,
      password,
      role: role || 'member',
      isActive: true
    });

    const createdMember = await User.findById(member._id).select('-password');

    return res.status(201).json({
      success: true,
      message: 'Member created successfully',
      data: createdMember
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get member by id
// @route   GET /api/members/:id
// @access  Private
const getMemberById = async (req, res, next) => {
  try {
    const member = await User.findById(req.params.id).select('-password');
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }
    return res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update member
// @route   PUT /api/members/:id
// @access  Private/Admin
const updateMember = async (req, res, next) => {
  try {
    const { name, phone, password, role } = req.body;
    const member = await User.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    if (phone && phone !== member.phone) {
      const phoneExists = await User.findOne({ phone });
      if (phoneExists) {
        return res.status(400).json({ success: false, message: 'Phone number already in use' });
      }
      member.phone = phone;
    }

    if (name) member.name = name;
    if (role) member.role = role;
    
    if (password) {
      member.password = password;
    }

    await member.save();

    const updatedMember = await User.findById(member._id).select('-password');
    return res.status(200).json({
      success: true,
      message: 'Member updated successfully',
      data: updatedMember
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle member status (Active/Inactive)
// @route   PATCH /api/members/:id/status
// @access  Private/Admin
const toggleMemberStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    
    if (isActive === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide isActive status' });
    }

    const member = await User.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    member.isActive = isActive;
    await member.save();

    return res.status(200).json({
      success: true,
      message: `Member status updated to ${isActive ? 'Active' : 'Inactive'}`,
      data: {
        _id: member._id,
        name: member.name,
        phone: member.phone,
        role: member.role,
        isActive: member.isActive
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMembers,
  createMember,
  getMemberById,
  updateMember,
  toggleMemberStatus
};
