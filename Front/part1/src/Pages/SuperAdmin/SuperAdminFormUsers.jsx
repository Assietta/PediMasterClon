import { useState } from "react";
import styles from "./SuperAdminPanels.module.css";

export default function SuperAdminFormUsers() {
  const [role, setRole] = useState("Client");
  const [forceReset, setForceReset] = useState(true);
  const [status, setStatus] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setStatus("Borrador guardado localmente. Podés conectar la API cuando esté lista.");
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Form Usuarios</h1>
        <p className={styles.subtitle}>
          Diseñá la estructura del formulario de alta y edición de usuarios. Esta vista es
          sólo de SuperAdmin y queda conectada a las rutas del menú lateral.
        </p>
      </header>

      <div className={styles.grid}>
        <form onSubmit={handleSubmit} className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Datos obligatorios</span>
            <span className={styles.statusBadge}>Borrador</span>
          </div>

          <div className={styles.content}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Nombre y apellido
                <input className={styles.input} name="name" placeholder="Ej: Martina Pérez" required />
              </label>
              <label className={styles.label}>
                Email
                <input className={styles.input} name="email" type="email" placeholder="mail@ejemplo.com" required />
              </label>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Rol principal
                <select
                  className={styles.select}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="Client">Cliente</option>
                  <option value="Admin">Admin</option>
                  <option value="SuperAdmin">SuperAdmin</option>
                </select>
              </label>
              <label className={styles.label}>
                Teléfono
                <input className={styles.input} name="phone" placeholder="11 4444-5555" />
              </label>
            </div>

            <div className={styles.checkboxRow}>
              <input
                id="force-reset"
                type="checkbox"
                checked={forceReset}
                onChange={(e) => setForceReset(e.target.checked)}
              />
              <label htmlFor="force-reset">Forzar cambio de contraseña en el próximo login</label>
            </div>

            <div className={styles.actions}>
              <button type="submit" className={styles.primaryBtn}>
                Guardar estructura
              </button>
              <button type="button" className={styles.secondaryBtn} onClick={() => setStatus("")}>
                Limpiar estado
              </button>
            </div>

            {status && <p className={styles.subtitle}>{status}</p>}
          </div>
        </form>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Políticas de seguridad</span>
            <span className={styles.statusBadge}>Revisión</span>
          </div>
          <div className={styles.content}>
            <div className={styles.checkboxRow}>
              <input id="mfa" type="checkbox" defaultChecked />
              <label htmlFor="mfa">Solicitar 2FA para roles Admin y SuperAdmin</label>
            </div>
            <div className={styles.checkboxRow}>
              <input id="blocklist" type="checkbox" />
              <label htmlFor="blocklist">Aplicar lista de bloqueo de emails corporativos</label>
            </div>
            <p className={styles.subtitle}>
              Estas reglas se pueden versionar y sincronizar luego con tu backend.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
