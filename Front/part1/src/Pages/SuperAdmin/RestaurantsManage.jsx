// src/pages/SuperAdminRestaurants.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./RestaurantsManage.module.css";
import { restaurantApi } from "../../api/restaurantApi";
import { userApi } from "../../api/userApi";

function getRestaurantId(r) {
  return r.restaurantId ?? r.id;
}

function normalizeDate(item) {
  return (
    item.createdAt ||
    item.creationDate ||
    item.createdOn ||
    item.createdDate ||
    null
  );
}

function findOwner(restaurant, users) {
  const ownerId =
    restaurant.createdForUserId ??
    restaurant.userId ??
    restaurant.ownerId ??
    restaurant.ownerUserId ??
    null;

  if (!ownerId) return null;

  return users.find(
    (u) => (u.userId ?? u.id) === ownerId
  ) || null;
}

export default function SuperAdminRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [savingRestaurantId, setSavingRestaurantId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setErr("");

        const [resRest, resUsers] = await Promise.all([
          restaurantApi.getAllRestaurants(),
          userApi.getAllUsers(),
        ]);

        setRestaurants(resRest);
        setUsers(resUsers);
      } catch (e) {
        console.error("Error cargando restaurantes", e);
        setErr(e.message || "Error inesperado");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleToggleActive = async (restaurant) => {
    const rid = getRestaurantId(restaurant);
    const currentActive =
      restaurant.isActive ??
      restaurant.active ??
      ((restaurant.status || "").toLowerCase() === "active" ||
        (restaurant.status || "").toLowerCase() === "activo");

    const newActive = !currentActive;

    try {
      setSavingRestaurantId(rid);

      const updated = {
        ...restaurant,
        isActive: newActive,
        active: newActive,
        status: newActive ? "Active" : "Inactive",
      };

      await restaurantApi.update(rid, updated);

      setRestaurants((prev) =>
        prev.map((r) =>
          getRestaurantId(r) === rid ? { ...r, ...updated } : r
        )
      );
    } catch (e) {
      console.error("Error cambiando estado del restaurante", e);
      alert("No se pudo actualizar el estado del restaurante");
    } finally {
      setSavingRestaurantId(null);
    }
  };

  const handleImpersonateOwner = (restaurant) => {
    const owner = findOwner(restaurant, users);
    if (!owner) {
      alert("Este restaurante no tiene dueño asociado.");
      return;
    }

    const payload = {
      mode: "owner",
      ownerUserId: owner.userId ?? owner.id,
      restaurantId: getRestaurantId(restaurant),
      startedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "pedimaster_impersonate_owner",
      JSON.stringify(payload)
    );

    alert(
      `Ahora estás simulando la vista como dueño de "${restaurant.name}".`
    );
    // Después en tus vistas podés leer `pedimaster_impersonate_owner`
    // y cambiar el comportamiento del front según esto.
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Gestión de restaurantes</h1>
        <p className={styles.subTitle}>Cargando restaurantes...</p>
      </div>
    );
  }

  if (err) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Gestión de restaurantes</h1>
        <p className={styles.error}>Ocurrió un error: {err}</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Gestión de restaurantes</h1>
          <p className={styles.subTitle}>
            Administrá estado, dueños y acceso como dueño.
          </p>
        </div>
        <div className={styles.actionsHeader}>
          <div className={styles.counterChip}>
            Total restaurantes: <strong>{restaurants.length}</strong>
          </div>
          {/* opcional: link al form de crear restaurantes dentro del layout superadmin */}
          <Link
            to="/superadmin/restaurants/create"
            className={styles.btnPrimary}
          >
            + Crear restaurante
          </Link>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Dueño</th>
              <th>Estado</th>
              <th>Fecha de alta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((r) => {
              const rid = getRestaurantId(r);
              const owner = findOwner(r, users);
              const active =
                r.isActive ??
                r.active ??
                ((r.status || "").toLowerCase() === "active" ||
                  (r.status || "").toLowerCase() === "activo");
              const createdAt = normalizeDate(r);
              const createdLabel = createdAt
                ? new Date(createdAt).toLocaleDateString()
                : "-";

              const ownerName = owner
                ? owner.fullName ||
                  owner.name ||
                  `${owner.firstName ?? ""} ${
                    owner.lastName ?? ""
                  }`.trim()
                : "Sin dueño";

              return (
                <tr key={rid}>
                  <td>{r.name}</td>
                  <td>{ownerName}</td>
                  <td>
                    <button
                      className={
                        active ? styles.btnActive : styles.btnInactive
                      }
                      onClick={() => handleToggleActive(r)}
                      disabled={savingRestaurantId === rid}
                    >
                      {active ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td>{createdLabel}</td>
                  <td className={styles.actionsCell}>
                    <Link
                      to={`/superadmin/restaurants/${rid}`}
                      className={styles.btnSecondary}
                    >
                      Ver / editar
                    </Link>
                    <button
                      className={styles.btnGhost}
                      onClick={() => handleImpersonateOwner(r)}
                    >
                      Entrar como dueño
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
