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
    restaurant.createdFor?.userId ??
    restaurant.createdFor?.id ??
    null;

  if (!ownerId) return null;

  return (
    users.find((u) => (u.userId ?? u.id) === ownerId) || null
  );
}


export default function SuperAdminRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [savingRestaurantId, setSavingRestaurantId] = useState(null);

  // modal asignar dueño
  const [ownerModalRestaurant, setOwnerModalRestaurant] = useState(null);
  const [ownerSearch, setOwnerSearch] = useState("");
  const [selectedOwnerId, setSelectedOwnerId] = useState("");

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
  };

  const openOwnerModal = (restaurant) => {
    const currentOwner = findOwner(restaurant, users);
    setOwnerModalRestaurant(restaurant);
    setSelectedOwnerId(
      currentOwner ? currentOwner.userId ?? currentOwner.id : ""
    );
    setOwnerSearch("");
  };

  const closeOwnerModal = () => {
    setOwnerModalRestaurant(null);
    setSelectedOwnerId("");
    setOwnerSearch("");
  };

const handleAssignOwner = async () => {
  if (!ownerModalRestaurant || !selectedOwnerId) {
    alert("Seleccioná un dueño");
    return;
  }

  const rid = getRestaurantId(ownerModalRestaurant);
  const ownerIdNum = Number(selectedOwnerId);
  const ownerUser =
    users.find((u) => (u.userId ?? u.id) === ownerIdNum) || null;

  try {
    setSavingRestaurantId(rid);

    // Lo que mandamos al back
    const updated = {
      ...ownerModalRestaurant,
      userId: ownerIdNum,           // lo que pide la validación
      createdForUserId: ownerIdNum, // por si el servicio mapea esto
    };

    await restaurantApi.update(rid, updated);

    // Actualizamos el estado del front para que muestre el dueño
    setRestaurants((prev) =>
      prev.map((r) =>
        getRestaurantId(r) === rid
          ? {
              ...r,
              createdForUserId: ownerIdNum,
              // dejamos algo de info en createdFor para mostrar nombre sin recargar
              createdFor: ownerUser
                ? {
                    ...(r.createdFor || {}),
                    userId: ownerIdNum,
                    id: ownerIdNum,
                    fullName:
                      ownerUser.fullName ||
                      ownerUser.name ||
                      `${ownerUser.firstName ?? ""} ${
                        ownerUser.lastName ?? ""
                      }`.trim(),
                    email: ownerUser.email,
                  }
                : r.createdFor,
            }
          : r
      )
    );

    closeOwnerModal();
  } catch (e) {
    console.error("Error asignando dueño", e);
    const backendMsg =
      e?.data?.title ||
      e?.data?.message ||
      (e?.data && JSON.stringify(e.data)) ||
      e.message;
    alert("No se pudo asignar el dueño.\n\n" + backendMsg);
  } finally {
    setSavingRestaurantId(null);
  }
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

  // candidatos a dueño para el modal
  const ownerCandidates = users.filter((u) => {
    const role = (u.role || u.roleName || "").toString().toLowerCase();
    const name = (
      u.fullName ||
      u.name ||
      `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim()
    ).toLowerCase();
    const email = (u.email || "").toLowerCase();
    const term = ownerSearch.trim().toLowerCase();

    // podés filtrar roles: acá dejo Admin y Client como candidatos
    const isAllowedRole =
      role.includes("admin") || role.includes("client");

    const matchesSearch =
      term === "" || name.includes(term) || email.includes(term);

    return isAllowedRole && matchesSearch;
  });

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
                    <button
                      className={styles.btnAssign}
                      onClick={() => openOwnerModal(r)}
                    >
                      Asignar dueño
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal asignar dueño */}
      {ownerModalRestaurant && (
        <div className={styles.modalOverlay} onClick={closeOwnerModal}>
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className={styles.modalTitle}>
              Asignar dueño a "{ownerModalRestaurant.name}"
            </h2>

            <input
              type="text"
              className={styles.searchInput}
              placeholder="Buscar usuario por nombre o email..."
              value={ownerSearch}
              onChange={(e) => setOwnerSearch(e.target.value)}
            />

            <div className={styles.ownerList}>
              {ownerCandidates.length === 0 && (
                <div className={styles.ownerEmpty}>
                  No se encontraron usuarios para ese filtro.
                </div>
              )}

              {ownerCandidates.map((u) => {
                const uid = u.userId ?? u.id;
                const name =
                  u.fullName ||
                  u.name ||
                  `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();

                return (
                  <label key={uid} className={styles.ownerItem}>
                    <input
                      type="radio"
                      name="owner"
                      value={uid}
                      checked={
                        String(selectedOwnerId) === String(uid)
                      }
                      onChange={() => setSelectedOwnerId(uid)}
                    />
                    <div>
                      <div className={styles.ownerName}>
                        {name || "(Sin nombre)"}
                      </div>
                      <div className={styles.ownerEmail}>{u.email}</div>
                      <div className={styles.ownerRole}>
                        Rol: {u.role || u.roleName || "Sin rol"}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.btnSecondary}
                onClick={closeOwnerModal}
              >
                Cancelar
              </button>
              <button
                className={styles.btnPrimary}
                onClick={handleAssignOwner}
                disabled={
                  savingRestaurantId ===
                  getRestaurantId(ownerModalRestaurant)
                }
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
