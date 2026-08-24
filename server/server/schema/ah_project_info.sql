DROP TABLE IF EXISTS ah_project_info CASCADE;

CREATE TABLE ah_project_info (
  id SERIAL PRIMARY KEY,
  npo_id INTEGER NOT NULL UNIQUE REFERENCES npo_info(id),
  start_year INTEGER NOT NULL,
  end_year INTEGER NOT NULL,
  project_leads TEXT[] NOT NULL
);
