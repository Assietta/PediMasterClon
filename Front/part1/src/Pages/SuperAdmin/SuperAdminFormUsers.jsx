// src/pages/superadmin/SuperAdminFormUsers.jsx
import { useState } from "react";
import styles from "./SuperAdminFormUsers.module.css";
import { Sidebar } from "lucide-react";

export default function SuperAdminFormUsers() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "Admin",
    active: true,
  });

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("Submit usuario:", form);
    // acá después pegás tu POST al back
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>Crear / editar usuario</h1>
        <p>Configurá los usuarios que tendrán acceso al panel de Pedimaster.</p>
      </div>

      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Nombre</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Ej: Juan Pérez"
              required
            />
          </div>

          <div className={styles.field}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="usuario@pedimaster.com"
              required
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label>Rol</label>
            <select name="role" value={form.role} onChange={onChange}>
              <option value="SuperAdmin">SuperAdmin</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className={styles.fieldCheckbox}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={onChange}
              />
              Usuario activo
            </label>
            <span className={styles.checkboxHint}>
              Si está desmarcado el usuario no podrá iniciar sesión.
            </span>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.secondaryBtn}>
            Cancelar
          </button>
          <button type="submit" className={styles.primaryBtn}>
            Guardar usuario
          </button>
        </div>
      </form>
    </div>
  );
}
