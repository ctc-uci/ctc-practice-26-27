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

module.exports = projectsRouter;