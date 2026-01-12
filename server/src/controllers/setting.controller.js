const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all settings
exports.getSettings = async (req, res) => {
    try {
        const settings = await prisma.systemSetting.findMany();
        // Convert to key-value object for easier frontend consumption
        const settingsMap = settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});
        res.json(settingsMap);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
};

// Update settings (Admin only)
exports.updateSettings = async (req, res) => {
    try {
        const updates = req.body; // Expect { MAX_LOANS: "5", ... }

        const promises = Object.keys(updates).map(key =>
            prisma.systemSetting.upsert({
                where: { key },
                update: { value: String(updates[key]) },
                create: { key, value: String(updates[key]) }
            })
        );

        await Promise.all(promises);

        // Log action (Sprint 1 Audit)
        await prisma.auditLog.create({
            data: {
                action: 'UPDATE_SETTINGS',
                userId: req.user.id,
                details: `Updated settings: ${Object.keys(updates).join(', ')}`
            }
        });

        res.json({ message: 'Settings updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
};
