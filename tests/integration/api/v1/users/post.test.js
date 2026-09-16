import orchestrator from "tests/orchestrator";
import database from "infra/database";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST to /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      await database.query({
        text: "INSERT INTO users (username, email, password) VALUES ($1, $2, $3);",
        values: ["viniciusbarros", "viniciussb05@hotmail.com", "123456"],
      });

      await database.query({
        text: "INSERT INTO users (username, email, password) VALUES ($1, $2, $3);",
        values: ["viniciusbarros", "Viniciussb05@hotmail.com", "123456"],
      });

      const users = await database.query({
        text: "SELECT * FROM users;",
      });

      console.log(users.rows);
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "viniciusbarros",
          email: "Viniciussb05@hotmail.com",
          password: "123456",
        }),
      });
      const responseBody = await response.json();

      expect(response.status).toBe(201);
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "viniciusbarros",
        email: "Viniciussb05@hotmail.com",
        password: "123456",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.update_at)).not.toBeNaN();
    });
  });
});
