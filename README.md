# Chorify_Application
## Running Lab 10 Tests

The tests use Docker Compose, Node.js, Mocha, Chai, and PostgreSQL.

1. Make sure Docker Desktop is running.
2. Create the test environment file if it doesn't already exist:

   cp .env.test.example .env.test

3. Run the tests:

   docker compose -f docker-compose.test.yaml up --abort-on-container-exit --exit-code-from tests

The tests cover registration, validation, chore creation, and the welcome endpoint.
