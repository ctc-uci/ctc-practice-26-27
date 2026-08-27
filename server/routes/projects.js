const express = require("express");
const { db } = require("../server/db-pgp");

const projectsRouter = express.Router();
projectsRouter.use(express.json());
const { keysToCamel, isNumeric } = require("../common/utils");

projectsRouter.get("/", async (req, res) => {
    try {
        const projects = await db.any(`
            SELECT p.id, n.name, n.description, p.npo_id, p.start_year, p.end_year, p.project_leads
            FROM ah_project_info AS p
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
            SELECT p.id, n.name, n.description, p.npo_id, p.start_year, p.end_year, p.project_leads
            FROM ah_project_info AS p
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

projectsRouter.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        isNumeric(id, "id must be numeric");

        const project = await db.oneOrNone(
            `
            SELECT p.id, n.name, n.description, p.npo_id, p.start_year, p.end_year, p.project_leads
            FROM ah_project_info AS p
            JOIN npo_info n ON p.npo_id = n.id
            WHERE p.id = $1;
            `,
            [id]
        );

        if (!project) {
            res.status(404).send(`Project with id ${id} not found`);
            return;
        }

        res.status(200).json(keysToCamel(project));
    } catch (err) {
        res.status(400).send(err.message);
    }
});

projectsRouter.post("/", async (req, res) => {
    try {
        const { npoId, startYear, endYear, projectLeads } = req.body;

        const project = await db.one(
            `
            INSERT INTO ah_project_info (npo_id, start_year, end_year, project_leads)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
            `,
            [npoId, startYear, endYear, projectLeads]
        );

        res.status(201).json(keysToCamel(project));
    } catch (err) {
        res.status(400).send(err.message);
    }
});

projectsRouter.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        isNumeric(id, "id must be numeric");

        const { npoId, startYear, endYear, projectLeads } = req.body;

        const project = await db.oneOrNone(
            `
            UPDATE ah_project_info
            SET npo_id = $1, start_year = $2, end_year = $3, project_leads = $4
            WHERE id = $5
            RETURNING *;
            `,
            [npoId, startYear, endYear, projectLeads, id]
        );

        if (!project) {
            res.status(404).send(`Project with id ${id} not found`);
            return;
        }

        res.status(200).json(keysToCamel(project));
    } catch (err) {
        res.status(400).send(err.message);
    }
});

projectsRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        isNumeric(id, "id must be numeric");

        const project = await db.oneOrNone(
            `
            DELETE FROM ah_project_info
            WHERE id = $1
            RETURNING *;
            `,
            [id]
        );

        if (!project) {
            res.status(404).send(`Project with id ${id} not found`);
            return;
        }

        res.status(200).json(keysToCamel(project));
    } catch (err) {
        res.status(400).send(err.message);
    }
});

module.exports = projectsRouter;
