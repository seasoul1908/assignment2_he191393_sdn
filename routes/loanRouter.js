const express = require('express');
const router = express.Router();
const {
    getAllLoans,
    getLoanById,
    createLoan,
    getLoansByMemberId
} = require('../controllers/loanController');

// Routes for Loans
router.get('/', getAllLoans);
router.post('/', createLoan);
router.get('/:id', getLoanById);
router.get('/member/:memberId', getLoansByMemberId);

module.exports = router;
