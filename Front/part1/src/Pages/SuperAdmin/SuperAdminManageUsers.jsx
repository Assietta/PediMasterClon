import styles from "./SuperAdminPanels.module.css";

const USERS = [
  { name: "Julia Rivas", email: "julia@pedimaster.com", role: "Admin", status: "Activo" },
  { name: "Pedro Br", email: "pedro@example.com", role: "Client", status: "Pendiente" },
  { name: "Superuser", email: "root@pedimaster.com", role: "SuperAdmin", status: "Activo" },
];

export default function SuperAdminManageUsers() {
  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Gestión de usuarios</h1>
        <p className={styles.subtitle}>
          Controlá altas, roles y estados. Conecta esta vista a tu API cuando esté lista, por
          ahora muestra datos simulados.
        </p>
      </header>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Usuarios recientes</span>
          <span className={styles.statusBadge}>Sincronizar</span>
        </div>
        <div className={styles.content}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {USERS.map((user) => (
                <tr key={user.email}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <span className={styles.badge}>{user.status}</span>
                  </td>
                  <td className={styles.actions}>
                    <button className={styles.primaryBtn} type="button">
                      Editar
                    </button>
                    <button className={styles.secondaryBtn} type="button">
                      Suspender
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
