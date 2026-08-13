DROP TABLE IF EXISTS dt_project_info CASCADE;

CREATE TABLE dt_project_info (
  id SERIAL PRIMARY KEY,
  npo_id INTEGER NOT NULL REFERENCES npo_info(id),
  start_year INTEGER NOT NULL,
  end_year INTEGER NOT NULL,
  project_leads TEXT[3] NOT NULL
);


