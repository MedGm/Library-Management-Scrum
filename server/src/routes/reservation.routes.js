const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservation.controller');
const { authenticateToken } = require('../middleware/auth');

router.post('/', authenticateToken, reservationController.createReservation);
router.get('/my', authenticateToken, reservationController.getMyReservations);
router.delete('/:id', authenticateToken, reservationController.cancelReservation);

module.exports = router;
