const express = require('express');
const router = express.Router();
const { getAllBooks, getBookById, createBook, updateBookById, deleteBook } = require('../controllers/bookController');

router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.post('/', createBook);
router.put('/:id', updateBookById);
router.delete('/:id', deleteBook);

module.exports = router;