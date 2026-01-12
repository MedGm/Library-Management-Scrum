const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Public routes
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);

// Protected routes
router.post('/', authenticateToken, authorizeRole(['ADMIN', 'LIBRARIAN']), bookController.createBook);
router.put('/:id', authenticateToken, authorizeRole(['ADMIN', 'LIBRARIAN']), bookController.updateBook);

module.exports = router;
