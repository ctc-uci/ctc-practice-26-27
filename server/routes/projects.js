const express = require("express");

const { db } = require("../server/db-pgp");
const { keysToCamel } = require("../common/utils");

const projectsRouter = express.Router();

projectsRouter.use(express.json());

projectsRouter.get("/", async (req, res) => {
    try {
        const projects = await db.any(`
            SELECT
                p.npo_id,
                p.start_year,
                p.end_year,
                p.project_leads,
                n.name AS npo_name,
                n.description AS npo_description
            FROM yk_project_info p
            JOIN npo_info n ON p.npo_id = n.id
            ORDER BY p.id;
        `);

        res.status(200).json(keysToCamel(projects));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

projectsRouter.get("/search", async (req, res) => {
    try {
        const { lead } = req.query;

        const projects = await db.oneOrNone(
            `
            SELECT
                p.npo_id,
                p.start_year,
                p.end_year,
                p.project_leads,
                n.name AS npo_name,
                n.description AS npo_description
            FROM yk_project_info p
            JOIN npo_info n ON p.npo_id = n.id
            WHERE n.name ILIKE $1
            ORDER BY p.id;
        `,
            [`%${lead ?? ""}%`]
        );

        res.status(200).json(projects);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = projectsRouter;
