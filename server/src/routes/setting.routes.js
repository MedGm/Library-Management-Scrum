const express = require('express');
const router = express.Router();
const settingController = require('../controllers/setting.controller');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.get('/', authenticateToken, authorizeRole(['ADMIN', 'LIBRARIAN']), settingController.getSettings);
router.put('/', authenticateToken, authorizeRole(['ADMIN']), settingController.updateSettings);

module.exports = router;
