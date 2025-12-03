import { useState } from "react";
import styles from "./SuperAdminPanels.module.css";

const DEFAULT_CATEGORIES = [
  { name: "Combos", required: true },
  { name: "Bebidas", required: false },
  { name: "Postres", required: false },
];

export default function SuperAdminFormMenus() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [newCategory, setNewCategory] = useState("");
  const [autoPublish, setAutoPublish] = useState(true);

  function addCategory() {
    const value = newCategory.trim();
    if (!value) return;
    setCategories((prev) => [...prev, { name: value, required: false }]);
    setNewCategory("");
  }

  function toggleRequired(idx) {
    setCategories((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, required: !c.required } : c))
    );
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Form Menús</h1>
        <p className={styles.subtitle}>
          Configurá los bloques mínimos para construir un menú completo y definí si las
          publicaciones se envían al instante o quedan en borrador.
        </p>
      </header>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Categorias base</span>
            <span className={styles.statusBadge}>Activo</span>
          </div>
          <div className={styles.content}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Nueva categoría
                <div className={styles.actions}>
                  <input
                    className={styles.input}
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Acompañamientos"
                  />
                  <button type="button" className={styles.primaryBtn} onClick={addCategory}>
                    Agregar
                  </button>
                </div>
              </label>
            </div>

            <div className={styles.content}>
              {categories.map((category, idx) => (
                <div key={category.name + idx} className={styles.checkboxRow}>
                  <input
                    id={`cat-${idx}`}
                    type="checkbox"
                    checked={category.required}
                    onChange={() => toggleRequired(idx)}
                  />
                  <label htmlFor={`cat-${idx}`}>
                    {category.name} {category.required ? "(obligatorio)" : "(opcional)"}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Publicación</span>
            <span className={styles.statusBadge}>{autoPublish ? "Automático" : "Manual"}</span>
          </div>
          <div className={styles.content}>
            <div className={styles.checkboxRow}>
              <input
                id="auto-publication"
                type="checkbox"
                checked={autoPublish}
                onChange={(e) => setAutoPublish(e.target.checked)}
              />
              <label htmlFor="auto-publication">Publicar al guardar (salta revisión)</label>
            </div>
            <p className={styles.subtitle}>
              Si desactivás esta opción, todos los cambios quedarán como borrador hasta que un
              SuperAdmin los apruebe.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
