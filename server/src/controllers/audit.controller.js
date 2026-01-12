const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get Audit Logs (Admin only)
exports.getAuditLogs = async (req, res) => {
    try {
        const logs = await prisma.auditLog.findMany({
            include: { user: { select: { name: true, email: true } } },
            orderBy: { timestamp: 'desc' },
            take: 100 // Limit to last 100 logs
        });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch audit logs' });
    }
};

// Helper to Create Log (Internal use)
exports.logAction = async (action, userId, details) => {
    try {
        await prisma.auditLog.create({
            data: { action, userId: parseInt(userId), details }
        });
    } catch (e) {
        console.error('Audit Log Error:', e);
    }
};
