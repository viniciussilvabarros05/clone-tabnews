import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

test("POST to /api/v1/migrations should return 200", async () => {
  const response1 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response1.status).toBe(201);

  const response1Body = await response1.json();
  expect(Array.isArray(response1Body)).toBe(true);
  expect(response1Body.length).toBeGreaterThan(0);

  const response2 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response2.status).toBe(200);

  const response2Body = await response2.json();
  expect(Array.isArray(response2Body)).toBe(true);
  expect(response2Body.length).toBe(0);
});

test("PUT or DELETE to /api/v1/migrations should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "PUT",
  });
  const responseBody = await response.json();
  expect(responseBody).toEqual({
    name: "MethodNotAllowedError",
    message: "Método não permitido para este endpoint.",
    action: "Verifique se o método HTTP enviado é valido para este endpoint.",
    status_code: 405,
  });

  const response2 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "DELETE",
  });
  const response2Body = await response2.json();
  expect(response2Body).toEqual({
    name: "MethodNotAllowedError",
    message: "Método não permitido para este endpoint.",
    action: "Verifique se o método HTTP enviado é valido para este endpoint.",
    status_code: 405,
  });
});
