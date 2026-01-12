const express = require('express');
const router = express.Router();
const borrowingController = require('../controllers/borrowing.controller');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.post('/', authenticateToken, authorizeRole(['LIBRARIAN', 'ADMIN']), borrowingController.createBorrowing);
router.put('/:id/return', authenticateToken, authorizeRole(['LIBRARIAN', 'ADMIN']), borrowingController.returnBook);
router.get('/my', authenticateToken, borrowingController.getMyBorrowings);
router.get('/', authenticateToken, authorizeRole(['LIBRARIAN', 'ADMIN']), borrowingController.getAllBorrowings);

module.exports = router;
