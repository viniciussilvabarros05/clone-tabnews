import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const datname = process.env.POSTGRES_DB;
  const settings = await database.query(`SHOW server_version`);
  const databaseMxConnectionsResult = await database.query(
    "SHOW max_connections;",
  );

  const databaseOpenedConnectionosResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [datname],
  });
  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionosResult.rows[0].count;
  const stats = { ...settings.rows[0], ...databaseMxConnectionsResult.rows[0] };

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: stats.server_version,
        max_connections: parseInt(stats.max_connections),
        opened_connections: databaseOpenedConnectionsValue,
      },
    },
  });
}

export default status;
