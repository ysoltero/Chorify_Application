CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(50) PRIMARY KEY,
    password VARCHAR(60) NOT NULL
);

CREATE TABLE IF NOT EXISTS chores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    points INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS households (
    household_id SERIAL PRIMARY KEY,
    household_name VARCHAR(100) NOT NULL,
    created_by VARCHAR(50) NOT NULL REFERENCES users(username)
);

CREATE TABLE IF NOT EXISTS household_members (
    household_id INTEGER NOT NULL REFERENCES households(household_id) ON DELETE CASCADE,
    username VARCHAR(50) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    PRIMARY KEY (household_id, username)
);


ALTER TABLE chores
ADD COLUMN IF NOT EXISTS assigned_to VARCHAR(50) REFERENCES users(username);

ALTER TABLE chores
ADD COLUMN IF NOT EXISTS household_id INTEGER REFERENCES households(household_id) ON DELETE CASCADE;

ALTER TABLE chores
ADD COLUMN IF NOT EXISTS due_date DATE;

ALTER TABLE chores
ADD COLUMN IF NOT EXISTS completed BOOLEAN NOT NULL DEFAULT FALSE;
