const Loan = require('../models/loan');
const Book = require('../models/book');

// Get all loans (with optional filtering by status, member_id and populate member & books)
const getAllLoans = async (req, res) => {
    try {
        const { status, member_id } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (member_id) filter.member_id = member_id;

        const loans = await Loan.find(filter)
            .populate({ path: 'member_id', select: "_id" })
            .populate({ path: 'items.book_id', select: "_id" });

        res.status(200).json(loans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get loan by ID
const getLoanById = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id)
            .populate({ path: 'member_id', select: "_id" })
            .populate({ path: 'items.book_id', select: "_id" });
        if (!loan) {
            return res.status(404).json({ message: "Loan not found" });
        }
        res.status(200).json(loan);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid loan ID format" });
        }
        res.status(500).json({ message: error.message });
    }
};

// Create new loan
const createLoan = async (req, res) => {
    try {
        const { member_id, items, dueDate, borrowDate, status } = req.body;
        if (items && Array.isArray(items)) {
            for (const item of items) {
                const book = await Book.findById(item.book_id);
                if (book && book.availableCopies !== undefined && book.availableCopies < item.quantity) {
                    return res.status(400).json({
                        message: `Not enough available copies for book "${book.title}". Available: ${book.availableCopies}`
                    });
                }
            }
        }

        const loan = await Loan.create({
            member_id,
            items,
            dueDate,
            borrowDate,
            status
        });

        // Deduct availableCopies for borrowed books
        if (items && Array.isArray(items)) {
            for (const item of items) {
                if (item.book_id && item.quantity) {
                    await Book.findByIdAndUpdate(item.book_id, {
                        $inc: { availableCopies: -item.quantity }
                    });
                }
            }
        }

        res.status(201).json(loan);
    } catch (error) {
        if (error.name === 'ValidationError' || error.name === 'CastError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};

// Get all loans by member ID
const getLoansByMemberId = async (req, res) => {
    try {
        const { memberId } = req.params;
        const loans = await Loan.find({ member_id: memberId })
            .populate({ path: 'member_id', select: "_id" })
            .populate({ path: 'items.book_id', select: "_id" });
        res.status(200).json(loans);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid member ID format" });
        }
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllLoans,
    getLoanById,
    createLoan,
    getLoansByMemberId
};
