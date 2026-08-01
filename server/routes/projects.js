const express = require('express')

const { db } = require('../server/db-pgp')
const { keysToCamel } = require("../common/utils")

const projectsRouter = express.Router()

projectsRouter.use(express.json())

projectsRouter.get('/', async(req,res) => {
    try {
        const projects = await db.any(`
            SELECT p.id, n.name, n.description, p.npo_id, p.start_year, p.end_year, p.project_leads
            FROM ht_project_info p
            JOIN npo_info n ON p.npo_id = n.id
            ORDER BY p.id
            `)
            res.status(200).json(keysToCamel(projects))
    } catch (error) {
        res.status(500).send(error.message)
    }
})

projectsRouter.post('/', async(req, res) => {
    try {
        const { npoId, startYear, endYear, projectLeads } = req.body
        const newProject = await db.any(`
            INSERT INTO ht_project_info (npo_id, start_year, end_year, project_leads)
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
            [npoId, startYear, endYear, projectLeads]
        )
        res.status(200).json(keysToCamel(newProject))
    } catch (error) {
        res.status(500).send(error.message)
    }
})

projectsRouter.put('/:id', async(req, res) => {
    try {
    const { id } = req.params;
    const { startYear, endYear, projectLeads } = req.body;
    const updatedProject = await db.query(
      `
      UPDATE ht_project_info
      SET
        start_year = COALESCE($1, start_year),
        end_year = COALESCE($2, end_year),
        project_leads = COALESCE($3, project_leads)
      WHERE id = $4
      RETURNING *;
      `,
      [startYear, endYear, projectLeads, id],
    );
        res.status(200).send(keysToCamel(updatedProject));
    } catch (error) {
        res.status(500).send(error.message);
    }
})

projectsRouter.delete('/:id', async(req, res) => {
    try {
        const { id } = req.params
        const oldProject = await db.any(`
            DELETE FROM ht_project_info
            WHERE id = $1
            RETURNING *
            `,
            [id]
        )
        res.status(200).json(keysToCamel(oldProject))
    } catch (error) {
        res.status(500).send(error.message)
    }
})

module.exports = projectsRouter;