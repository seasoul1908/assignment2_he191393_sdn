const express = require('express');
const app = express();
const connectDB = require("./config/db");
const bookRouter = require('./routes/bookRouter');
const memberRouter = require('./routes/memberRouter');
const loanRouter = require('./routes/loanRouter');
app.use(express.json());
app.use('/api/books', bookRouter);
app.use('/api/members', memberRouter);
app.use('/api/loans', loanRouter);

const startServer = async () => {
    await connectDB();
    app.get('/', async (req, res) => {
        try {
            res.status(200).send({ message: 'Welcome to Practical Exam!' })
        } catch (error) {
            res.send({ error: error.message })
        }
    })
    const PORT = process.env.PORT || 9999;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();