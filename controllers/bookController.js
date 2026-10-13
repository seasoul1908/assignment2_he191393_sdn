const Book = require('../models/book');

// Get all books
const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get book by ID
const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json(book);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid book ID format" });
        }
        res.status(500).json({ message: error.message });
    }
};

// Create new book
const createBook = async (req, res) => {
    try {
        const { title, author, category, isbn, publishedYear, totalCopies, availableCopies } = req.body;

        const bookData = {
            title,
            author,
            category,
            isbn,
            publishedYear,
            totalCopies,
            // If availableCopies is not provided, default to totalCopies
            availableCopies: availableCopies !== undefined ? availableCopies : totalCopies
        };

        const book = await Book.create(bookData);
        res.status(201).json({ message: "Book created successfully", data: book });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "ISBN already exists" });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};

// Update book by ID
const updateBookById = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json(book);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid book ID format" });
        }
        if (error.name === 'ValidationError' || error.code === 11000) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};

// Delete book by ID
const deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json({ message: "Delete book successfully", data: book });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid book ID format" });
        }
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBookById,
    updateBook: updateBookById,
    deleteBook,
    deleteBookById: deleteBook
};