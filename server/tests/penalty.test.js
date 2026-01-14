const { calculatePenalty } = require('../src/utils/penaltyCalculator');

describe('Penalty Calculator', () => {
    test('should return 0 penalty for on-time return', () => {
        const dueDate = new Date('2023-01-10');
        const returnDate = new Date('2023-01-10');
        const result = calculatePenalty(dueDate, returnDate, 1.0);

        expect(result.penalty).toBe(0);
        expect(result.isLate).toBe(false);
    });

    test('should return 0 penalty for early return', () => {
        const dueDate = new Date('2023-01-10');
        const returnDate = new Date('2023-01-05');
        const result = calculatePenalty(dueDate, returnDate, 1.0);

        expect(result.penalty).toBe(0);
        expect(result.isLate).toBe(false);
    });

    test('should calculate penalty for 1 day late', () => {
        const dueDate = new Date('2023-01-10');
        const returnDate = new Date('2023-01-11'); // 1 day late
        const result = calculatePenalty(dueDate, returnDate, 2.0); // $2 per day

        expect(result.penalty).toBe(2.0);
        expect(result.isLate).toBe(true);
        expect(result.daysLate).toBe(1);
    });

    test('should calculate penalty for 5 days late', () => {
        const dueDate = new Date('2023-01-10');
        const returnDate = new Date('2023-01-15'); // 5 days late
        const result = calculatePenalty(dueDate, returnDate, 0.5); // $0.5 per day

        expect(result.penalty).toBe(2.5); // 5 * 0.5
        expect(result.isLate).toBe(true);
        expect(result.daysLate).toBe(5);
    });
});
