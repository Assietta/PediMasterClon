import { useState } from "react";
import styles from "./SuperAdminPanels.module.css";

const DEFAULT_FIELDS = {
  minOrder: 1500,
  deliveryFee: 400,
  allowPickup: true,
  requiresCover: false,
};

export default function SuperAdminFormRestaurants() {
  const [fields, setFields] = useState(DEFAULT_FIELDS);
  const [notes, setNotes] = useState("Describí reglas para logos, banners y horarios.");

  function handleChange(e) {
    const { name, type, checked, value } = e.target;
    setFields((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Form Restaurantes</h1>
        <p className={styles.subtitle}>
          Define los campos que verá un SuperAdmin al crear o editar una rotisería. Incluí
          parámetros de negocio básicos para no olvidarlos.
        </p>
      </header>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Campos económicos</span>
            <span className={styles.statusBadge}>Publicado</span>
          </div>
          <div className={styles.content}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Mínimo de pedido ($)
                <input
                  className={styles.input}
                  type="number"
                  name="minOrder"
                  value={fields.minOrder}
                  onChange={handleChange}
                  min={0}
                />
              </label>
              <label className={styles.label}>
                Costo envío base ($)
                <input
                  className={styles.input}
                  type="number"
                  name="deliveryFee"
                  value={fields.deliveryFee}
                  onChange={handleChange}
                  min={0}
                />
              </label>
            </div>

            <div className={styles.checkboxRow}>
              <input
                id="allowPickup"
                type="checkbox"
                name="allowPickup"
                checked={fields.allowPickup}
                onChange={handleChange}
              />
              <label htmlFor="allowPickup">Permitir retiro en el local</label>
            </div>
            <div className={styles.checkboxRow}>
              <input
                id="requiresCover"
                type="checkbox"
                name="requiresCover"
                checked={fields.requiresCover}
                onChange={handleChange}
              />
              <label htmlFor="requiresCover">Forzar carga de banner y logo antes de publicar</label>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Notas para el equipo</span>
            <span className={styles.statusBadge}>Libre</span>
          </div>
          <div className={styles.content}>
            <label className={styles.label}>
              Checklist visible para nuevos ingresos
              <textarea
                className={styles.textarea}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>
            <div className={styles.actions}>
              <button className={styles.primaryBtn} type="button">
                Guardar checklist
              </button>
              <button className={styles.secondaryBtn} type="button" onClick={() => setNotes("")}>
                Vaciar nota
              </button>
            </div>
            <p className={styles.subtitle}>
              Esta pantalla no persiste todavía: sólo define el flujo visual hasta conectar con
              el backend.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
