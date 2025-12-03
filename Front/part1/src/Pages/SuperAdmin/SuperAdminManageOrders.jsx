import styles from "./SuperAdminPanels.module.css";

const ORDERS = [
  { id: "#A104", user: "Julia Rivas", total: "$5.600", status: "Pagado", restaurant: "Pizza Norte" },
  { id: "#A105", user: "Pedro Br", total: "$3.200", status: "Pendiente", restaurant: "Green Bowl" },
  { id: "#A106", user: "Superuser", total: "$1.850", status: "Cancelado", restaurant: "Rotisería Don Sabor" },
];

export default function SuperAdminManageOrders() {
  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Gestión de pedidos</h1>
        <p className={styles.subtitle}>
          Supervisá el flujo de pedidos con acceso de solo lectura. Ajustá las reglas de estados
          cuando conectes tu backend.
        </p>
      </header>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Últimos pedidos</span>
          <span className={styles.statusBadge}>Live mock</span>
        </div>
        <div className={styles.content}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Restaurante</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ORDERS.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.user}</td>
                  <td>{order.restaurant}</td>
                  <td>{order.total}</td>
                  <td>
                    <span className={styles.badge}>{order.status}</span>
                  </td>
                  <td className={styles.actions}>
                    <button className={styles.primaryBtn} type="button">
                      Ver detalle
                    </button>
                    <button className={styles.secondaryBtn} type="button">
                      Cambiar estado
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
