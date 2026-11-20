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

-- Each user has one pet that stays with their account.
CREATE TABLE IF NOT EXISTS chore_pets (
    username VARCHAR(50) PRIMARY KEY REFERENCES users(username) ON DELETE CASCADE,
    pet_name VARCHAR(50) NOT NULL DEFAULT 'My Pet',
    health INTEGER NOT NULL DEFAULT 100 CHECK (health BETWEEN 0 AND 100),
    mood INTEGER NOT NULL DEFAULT 100 CHECK (mood BETWEEN 0 AND 100),
    last_fed TIMESTAMP,
    last_drink TIMESTAMP
);

-- Spendable currency is independent of household membership.
CREATE TABLE IF NOT EXISTS pet_wallets (
    username VARCHAR(50) PRIMARY KEY REFERENCES users(username) ON DELETE CASCADE,
    balance INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0)
);

-- Items available for purchase in the pet shop.
CREATE TABLE IF NOT EXISTS pet_shop_items (
    item_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(30) NOT NULL,
    price INTEGER NOT NULL CHECK (price >= 0),
    mood_boost INTEGER NOT NULL DEFAULT 0,
    health_boost INTEGER NOT NULL DEFAULT 0
);

-- Items a user owns.
CREATE TABLE IF NOT EXISTS pet_inventory (
    username VARCHAR(50) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    item_id INTEGER NOT NULL REFERENCES pet_shop_items(item_id),
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    equipped BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (username, item_id)
);

-- Prevent duplicate currency rewards for the same chore.
CREATE TABLE IF NOT EXISTS pet_chore_rewards (
    chore_id INTEGER PRIMARY KEY REFERENCES chores(id) ON DELETE CASCADE,
    username VARCHAR(50) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    points_awarded INTEGER NOT NULL CHECK (points_awarded >= 0)
);

-- Track the weekly free food and drink rewards.
CREATE TABLE IF NOT EXISTS pet_weekly_rewards (
    username VARCHAR(50) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    week_start DATE NOT NULL,
    PRIMARY KEY (username, week_start)
);

INSERT INTO pet_shop_items (name, category, price, mood_boost, health_boost)
VALUES
    ('Basic Food', 'food', 5, 5, 10),
    ('Fresh Water', 'drink', 5, 5, 10),
    ('Strawberry Treat', 'food', 15, 20, 5),
    ('Fruit Juice', 'drink', 12, 15, 5),
    ('Party Hat', 'hat', 30, 0, 0),
    ('Sunglasses', 'glasses', 40, 0, 0),
    ('Gold Necklace', 'jewelry', 50, 0, 0),
    ('Little Sneakers', 'shoes', 45, 0, 0)
ON CONFLICT (name) DO NOTHING;
