const express = require('express');
const db = require('./src/db');
const router = express.Router();

router.get('/my-chores', async (req, res) => {
    const {username} = req.query;
    if (!username) return res.status(400).json({message: 'Username is required'});
    try {
        const chores = await db.any(
            `SELECT id, name, points, assigned_to, household_id,
                    due_date::text AS due_date, completed
             FROM chores WHERE assigned_to = $1
             ORDER BY completed, due_date NULLS LAST, id`,
            [username]
        );
        return res.json({chores});
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Failed to load chores'});
    }
});

router.post('/assigned-chores', async (req, res) => {
    const {name, points, assigned_to, household_id, due_date} = req.body;
    const id = Number(household_id);
    if (typeof name !== 'string' || !name.trim() ||
        !Number.isInteger(points) || points < 0 ||
        typeof assigned_to !== 'string' || !assigned_to.trim() ||
        !Number.isInteger(id) || id <= 0 ||
        !/^\d{4}-\d{2}-\d{2}$/.test(due_date || '')) {
        return res.status(400).json({message: 'Invalid chore information'});
    }
    try {
        const member = await db.oneOrNone(
            'SELECT 1 FROM household_members WHERE household_id = $1 AND username = $2',
            [id, assigned_to]
        );
        if (!member) return res.status(400).json({message: 'User is not in this household'});
        const chore = await db.one(
            `INSERT INTO chores (name, points, assigned_to, household_id, due_date)
             VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [name.trim(), points, assigned_to, id, due_date]
        );
        return res.status(201).json({message: 'Chore assigned', chore});
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Failed to assign chore'});
    }
});


router.patch('/chores/:id/complete', async (req, res) => {
    const id = Number(req.params.id);
    const username = req.authUser || req.body.username;

    if (!Number.isInteger(id) || id <= 0 || !username) {
        return res.status(400).json({message: 'Invalid request'});
    }

    try {
        const result = await db.tx(async t => {
            const chore = await t.oneOrNone(
                `UPDATE chores SET completed = TRUE
                 WHERE id = $1 AND assigned_to = $2 AND completed = FALSE
                 RETURNING id, completed, points`,
                [id, username]
            );

            if (!chore) return null;

            await t.none(
                `INSERT INTO pet_wallets (username)
                 VALUES ($1) ON CONFLICT DO NOTHING`,
                [username]
            );

            const reward = await t.oneOrNone(
                `INSERT INTO pet_chore_rewards (chore_id, username, points_awarded)
                 VALUES ($1, $2, $3)
                 ON CONFLICT (chore_id) DO NOTHING
                 RETURNING points_awarded`,
                [id, username, chore.points]
            );

            if (reward) {
                await t.none(
                    `UPDATE pet_wallets SET balance = balance + $1
                     WHERE username = $2`,
                    [reward.points_awarded, username]
                );
            }

            return {chore, coinsEarned: reward ? reward.points_awarded : 0};
        });

        if (!result) {
            return res.status(409).json({message: 'Chore not found or already completed'});
        }

        return res.json({
            message: 'Chore completed',
            chore: result.chore,
            coinsEarned: result.coinsEarned
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Failed to complete chore'});
    }
});


// Undo a completed chore.
router.patch('/chores/:id/uncomplete', async (req, res) => {
    const id = Number(req.params.id);
    const username = req.authUser || req.body.username;

    if (!Number.isInteger(id) || id <= 0 || !username) {
        return res.status(400).json({message: 'Invalid request'});
    }

    try {
        const chore = await db.oneOrNone(
            `UPDATE chores SET completed = FALSE
             WHERE id = $1 AND assigned_to = $2 AND completed = TRUE
             RETURNING id, completed`,
            [id, username]
        );

        if (!chore) {
            return res.status(404).json({message: 'Completed chore not found'});
        }

        return res.json({message: 'Chore marked incomplete', chore});
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Failed to undo chore'});
    }
});


module.exports = router;
