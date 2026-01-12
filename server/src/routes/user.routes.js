const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.get('/members', authenticateToken, authorizeRole(['ADMIN', 'LIBRARIAN']), userController.getMembers);

module.exports = router;
