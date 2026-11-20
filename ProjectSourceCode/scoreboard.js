const express = require('express');
const db = require('./src/db');

const router = express.Router();

router.get('/scoreboard', async (req, res) => {
    const householdId = Number(req.query.household_id);

    if (!Number.isInteger(householdId) || householdId <= 0) {
        return res.status(400).json({message: 'Valid household ID required'});
    }

    try {
        const residents = await db.any(
            `SELECT m.username AS name,
                    COALESCE(SUM(c.points), 0)::int AS points
             FROM household_members m
             LEFT JOIN chores c
               ON c.household_id = m.household_id
               AND c.assigned_to = m.username
               AND c.completed = TRUE
             WHERE m.household_id = $1
             GROUP BY m.username
             ORDER BY points DESC, m.username`,
            [householdId]
        );

        residents.sort((a, b) => b.points - a.points);

        residents.forEach((person, index) => {
            person.rank = index + 1;
        });

        res.render('pages/scoreboard', {residents, layout: false});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Failed to load scoreboard'});
    }
});

module.exports = router;
