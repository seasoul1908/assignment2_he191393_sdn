const Member = require('../models/member');

// Get all members
const getAllMembers = async (req, res) => {
    try {
        const members = await Member.find();
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get member by ID
const getMemberById = async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }
        res.status(200).json(member);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid member ID format" });
        }
        res.status(500).json({ message: error.message });
    }
};

// Create new member
const createMember = async (req, res) => {
    try {
        const { fullName, email, phone, membershipType, isActive } = req.body;

        const member = await Member.create({
            fullName,
            email,
            phone,
            membershipType,
            isActive
        });
        res.status(201).json(member);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email already exists" });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};

// Update member by ID
const updateMemberById = async (req, res) => {
    try {
        const member = await Member.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }
        res.status(200).json(member);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid member ID format" });
        }
        if (error.name === 'ValidationError' || error.code === 11000) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};

// Delete member by ID
const deleteMember = async (req, res) => {
    try {
        const member = await Member.findByIdAndDelete(req.params.id);
        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }
        res.status(200).json({ message: "Delete member successfully", data: member });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid member ID format" });
        }
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllMembers,
    getMemberById,
    createMember,
    updateMemberById,
    updateMember: updateMemberById,
    deleteMember,
    deleteMemberById: deleteMember
};
