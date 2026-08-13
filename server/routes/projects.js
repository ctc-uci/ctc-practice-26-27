const express = require("express");

const { db } = require("../server/db-pgp");

const { keysToCamel } = require("../common/utils")


const projectsRouter = express.Router();

projectsRouter.get("/", async (req, res) => {

    try {
        const projects = await db.any(`
            SELECT p.id, n.name, n.description, p.npo_id, p.start_year, p.end_year, p.project_leads
            FROM dt_project_info p
            JOIN npo_info n ON p.npo_id = n.id
            ORDER BY p.id
            `);
        res.status(200).json(keysToCamel(projects));

    } catch (err) {
        console.error(err);
        res.status(500).json(err.message);
    }

});

projectsRouter.post("/", async (req, res) => {
    try {
        const { npoId, startYear, endYear, projectLeads } = req.body;
        const project = await db.one(
            `INSERT INTO dt_project_info (npo_id, start_year, end_year, project_leads)
             VALUES ($1, $2, $3, $4)
             RETURNING *;`,
            [npoId, startYear, endYear, projectLeads]
        );
        res.status(200).json(keysToCamel(project));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

projectsRouter.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { npoId, startYear, endYear, projectLeads } = req.body;
        const project = await db.oneOrNone(
            `UPDATE dt_project_info
             SET npo_id = COALESCE($2, npo_id),
                 start_year = COALESCE($3, start_year),
                 end_year = COALESCE($4, end_year),
                 project_leads = COALESCE($5, project_leads)
             WHERE id = $1
             RETURNING *;`,
            [id, npoId ?? null, startYear ?? null, endYear ?? null, projectLeads ?? null]
        );
        if (!project) return res.status(404).send(`No project with that ID`);
        res.status(200).json(keysToCamel(project));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

projectsRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const project = await db.oneOrNone(
            `DELETE FROM dt_project_info WHERE id = $1 RETURNING *;`,
            [id]
        );
        if (!project) return res.status(404).send(`No project with that id`);
        res.status(200).json(keysToCamel(project));
    } catch (err) {
        res.status(500).send(err.message);
    }
});




module.exports = projectsRouter;
