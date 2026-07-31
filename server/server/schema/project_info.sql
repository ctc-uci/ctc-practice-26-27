CREATE TABLE yk_project_info (
    id SERIAL PRIMARY KEY,
    npo_id INT NOT NULL REFERENCES npo_info(id),
    start_year INT NOT NULL,
    end_year INT NOT NULL,
    project_leads TEXT[3] NOT NULL
);