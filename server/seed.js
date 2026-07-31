const pgp = require("pg-promise")({});
require("dotenv").config();

// type ProjectInfo = {
//     npoId: number;
//     startYear: number;
//     endYear: number;
//     projectLeads: string[];
// };

const PROJECT_INFO /*: ProjectInfo[] */ = [
    {
        npoId: 1,
        startYear: 2023,
        endYear: 2024,
        projectLeads: [
            "Ostend Suryajaya",
            "Dang Nguyen",
            "Rafael Carillo Munoz",
        ],
    },
    {
        npoId: 2,
        startYear: 2023,
        endYear: 2024,
        projectLeads: ["Josh Lipton", "Madhu Sharma", "Minh Nguyen"],
    },
    {
        npoId: 3,
        startYear: 2023,
        endYear: 2024,
        projectLeads: ["Michael Pien", "Michelle Lin", "Selina Arjomand"],
    },
    {
        npoId: 4,
        startYear: 2022,
        endYear: 2023,
        projectLeads: ["Hang Cao", "Justin Liao", "Zoya Soy"],
    },
    {
        npoId: 5,
        startYear: 2022,
        endYear: 2023,
        projectLeads: ["Gurneet Cheema", "Madhu Sharma", "Carlos Lim"],
    },
    {
        npoId: 6,
        startYear: 2022,
        endYear: 2023,
        projectLeads: ["Avent Chiu", "Claude Yan", "Allison Liu"],
    },
    {
        npoId: 7,
        startYear: 2021,
        endYear: 2022,
        projectLeads: ["Jane Vo", "Allen Luo", "Anikait Rao"],
    },
    {
        npoId: 8,
        startYear: 2021,
        endYear: 2022,
        projectLeads: ["Chris Tian", "Henry Gip", "Megha Kak"],
    },
    {
        npoId: 9,
        startYear: 2021,
        endYear: 2022,
        projectLeads: [
            "Rashmi Sharma",
            "Sylvester Yue",
            "Sabrina Nguyen Hoang",
        ],
    },
];

const db = pgp({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    ssl: true,
});

const seed = async (tableName) => {
    if (!tableName || tableName === "FILL IN HERE") {
        console.error(
            "ERR: Please enter a table name for the seed function in server/seed.js"
        );
        return;
    }

    console.log("Seeding table...");

    try {
        await db.query("BEGIN");

        await db.tx((t) =>
            t.batch(
                PROJECT_INFO.map((project) =>
                    t.none(
                        `INSERT INTO ${tableName} (npo_id, start_year, end_year, project_leads) VALUES ($1, $2, $3, $4);`,
                        [
                            project.npoId,
                            project.startYear,
                            project.endYear,
                            project.projectLeads,
                        ]
                    )
                )
            )
        );

        console.log("Seeding complete");
    } catch (err) {
        console.log("err", err);
    }
};

seed("ss_project_info");
