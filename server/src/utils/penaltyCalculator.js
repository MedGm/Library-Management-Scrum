/**
 * Calculate penalty for late return
 * @param {Date} dueDate - The due date of the borrowing
 * @param {Date} returnDate - The date of return (default: now)
 * @param {number} penaltyPerDay - The penalty amount per day
 * @returns {Object} result { penalty: number, isLate: boolean, daysLate: number }
 */
const calculatePenalty = (dueDate, returnDate = new Date(), penaltyPerDay = 1.0) => {
    // Normalize dates to midnight to compare just dates (optional, but good practice for consistency)
    // For this simple implementation, we'll keep it simple as per controller logic

    // Ensure inputs are Date objects
    const due = new Date(dueDate);
    const returned = new Date(returnDate);

    if (returned <= due) {
        return { penalty: 0, isLate: false, daysLate: 0 };
    }

    const diffTime = Math.abs(returned - due);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Safety check just in case
    if (diffDays <= 0) return { penalty: 0, isLate: false, daysLate: 0 };

    const penalty = diffDays * penaltyPerDay;

    return {
        penalty,
        isLate: true,
        daysLate: diffDays
    };
};

module.exports = { calculatePenalty };
