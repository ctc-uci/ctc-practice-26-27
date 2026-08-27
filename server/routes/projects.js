const express = require("express");

const { db } = require("../server/db-pgp");
const { keysToCamel } = require("../common/utils");

const projectsRouter = express.Router();

projectsRouter.use(express.json());

projectsRouter.get("/", async (req, res) => {
    try {
        const projects = await db.any(`
           SELECT p.id, n.name, n.description, p.npo_id, p.start_year, p.end_year, p.project_leads
           FROM ak_project_info p
           JOIN npo_info n ON p.npo_id = n.id
           ORDER BY p.id;
           `);
        return res.status(200).json(keysToCamel(projects));
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

projectsRouter.get("/search", async (req, res) => {
    const { lead } = req.query;

    try {
        const projects = await db.oneOrNone(
            `
           SELECT p.id, n.name, n.description, p.npo_id, p.start_year, p.end_year, p.project_leads
           FROM ak_project_info p
           JOIN npo_info n ON p.npo_id = n.id
           WHERE n.name ILIKE $1
           ORDER BY p.id;
           `,
            [`%${lead ?? ""}%`]
        );

        return res.status(200).json(projects);
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

projectsRouter.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { npoId, startYear, endYear, projectLeads } = req.body;

    try {
        const project = await db.one(
            `
            UPDATE ak_project_info
            SET npo_id = $1, start_year = $2, end_year = $3, project_leads = $4
            WHERE id = $5
            RETURNING *;
        `,
            [npoId, startYear, endYear, projectLeads, id]
        );

        return res.status(200).json(keysToCamel(project));
    } catch (err) {
        if (err.received === 0) {
            return res.status(404).send("Project not found");
        }
        return res.status(500).send(err.message);
    }
});

projectsRouter.post("/", async (req, res) => {
    const { npoId, startYear, endYear, projectLeads } = req.body;

    try {
        const newProject = await db.one(
            `
            INSERT INTO ak_project_info (npo_id, start_year, end_year, project_leads)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `,
            [npoId, startYear, endYear, projectLeads]
        );

        return res.status(201).json(keysToCamel(newProject));
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

projectsRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProject = await db.oneOrNone(
            `
            DELETE FROM ak_project_info
            WHERE id = $1
            RETURNING *;
        `,
            [id]
        );
        if (!deletedProject) {
            return res.status(404).send("Project not found");
        }
        return res.status(204).send();
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

module.exports = projectsRouter;
