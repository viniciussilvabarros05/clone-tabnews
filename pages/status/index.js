import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.dot} />
          <h1 style={styles.title}>Status do Sistema</h1>
        </div>
        <hr style={styles.divider} />
        <UpdateAt />
      </div>
    </div>
  );
}

function UpdateAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });
  const loading = "Carregando...";
  if (!isLoading && data) {
    const { opened_connections, max_connections } = data.dependencies.database;
    const updateAt = new Date(data.updated_at).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    return (
      <>
        <div style={styles.row}>
          <span style={styles.label}>Última atualização</span>
          <span style={isLoading ? styles.valueLoading : styles.value}>
            {updateAt}
          </span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Versão</span>
          <span style={isLoading ? styles.valueLoading : styles.value}>
            {opened_connections}
          </span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Conexões abertas</span>
          <span style={isLoading ? styles.valueLoading : styles.value}>
            {max_connections}
          </span>
        </div>
      </>
    );
  }
  return loading;
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f0f2f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  card: {
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    padding: "36px 40px",
    width: "100%",
    maxWidth: "480px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "6px",
  },
  dot: {
    display: "inline-block",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#22c55e",
    boxShadow: "0 0 0 3px rgba(34,197,94,0.2)",
  },
  title: {
    margin: 0,
    fontSize: "1.4rem",
    fontWeight: 700,
    color: "#111827",
  },
  divider: {
    border: "none",
    borderTop: "1px solid #f3f4f6",
    marginBottom: "20px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
  },
  label: {
    fontSize: "0.875rem",
    color: "#6b7280",
    fontWeight: 500,
  },
  value: {
    fontSize: "0.875rem",
    color: "#111827",
    fontWeight: 600,
  },
  valueLoading: {
    fontSize: "0.875rem",
    color: "#d1d5db",
    fontStyle: "italic",
  },
};
