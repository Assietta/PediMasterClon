import styles from "./SuperAdminPanels.module.css";

const RESTAURANTS = [
  { name: "Rotisería Don Sabor", city: "Lanús", status: "En revisión", tags: ["promo", "delivery"] },
  { name: "Pizza Norte", city: "Vicente López", status: "Activo", tags: ["24hs", "sin tacc"] },
  { name: "Green Bowl", city: "Palermo", status: "Deshabilitado", tags: ["vegano", "ensaladas"] },
];

export default function SuperAdminManageRestaurants() {
  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Gestión de restaurantes</h1>
        <p className={styles.subtitle}>
          Visualizá el estado de cada rotisería y accedé rápido a la creación de nuevas desde
          el menú lateral.
        </p>
      </header>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Listado</span>
          <span className={styles.statusBadge}>Demo</span>
        </div>
        <div className={styles.content}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Ciudad</th>
                <th>Estado</th>
                <th>Tags</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {RESTAURANTS.map((resto) => (
                <tr key={resto.name}>
                  <td>{resto.name}</td>
                  <td>{resto.city}</td>
                  <td>
                    <span className={styles.badge}>{resto.status}</span>
                  </td>
                  <td>
                    <div className={styles.tagList}>
                      {resto.tags.map((tag) => (
                        <span key={tag} className={styles.tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className={styles.actions}>
                    <button className={styles.primaryBtn} type="button">
                      Abrir
                    </button>
                    <button className={styles.secondaryBtn} type="button">
                      Archivar
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
