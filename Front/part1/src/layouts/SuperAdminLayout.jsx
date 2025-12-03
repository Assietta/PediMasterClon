// src/layouts/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import styles from "./SuperAdminLayout.module.css"; // o AdminLayout.module.css

export default function AdminLayout() {
  return (
    <div className={styles.layout}>
      <AdminSidebar />
      <main className={styles.main}>
        <div className={styles.mainInner}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
