const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getMembers = async (req, res) => {
    try {
        const members = await prisma.user.findMany({
            where: { role: 'MEMBER' },
            select: { id: true, name: true, email: true }
        });
        res.json(members);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch members' });
    }
};
