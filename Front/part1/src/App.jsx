// src/App.jsx
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./router/ProtectedRoute";

import ClientLayout from "./layouts/ClientLayout";
import AdminLayout from "./layouts/AdminLayout";

// Páginas públicas
import HomePage from "./Pages/HomePage";
import Login from "./Pages/Login";
import Contact from "./Pages/Contact";
import AppPage from "./Pages/AppPage";
import Unauthorized from "./Pages/Unauthorized";

// Cliente
import HomeClient from "./Pages/client/HomeClient";
import CartPage from "./Pages/client/CartPage";

// Admin
import AdminFoods from "./Pages/Admin/AdminFoods";
import FoodForm from "./Pages/Admin/FoodForm";
import AdminOrders from "./Pages/Admin/AdminOrders";
import AdminRestaurants from "./Pages/Admin/AdminRestaurants";

// SuperAdmin
import AdminCreateRestaurants from "./Pages/SuperAdmin/AdminCreateRestaurants";
import SuperAdminFormUsers from "./Pages/SuperAdmin/SuperAdminFormUsers";
import SuperAdminFormRestaurants from "./Pages/SuperAdmin/SuperAdminFormRestaurants";
import SuperAdminFormMenus from "./Pages/SuperAdmin/SuperAdminFormMenus";
import SuperAdminFormTags from "./Pages/SuperAdmin/SuperAdminFormTags";
import SuperAdminManageUsers from "./Pages/SuperAdmin/SuperAdminManageUsers";
import SuperAdminManageRestaurants from "./Pages/SuperAdmin/SuperAdminManageRestaurants";
import SuperAdminManageOrders from "./Pages/SuperAdmin/SuperAdminManageOrders";

function App() {
  return (
    <Routes>
      {/* Público */}
      <Route path="/" element={<HomePage />} />
      <Route path="/app" element={<AppPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Cliente logueado (cualquier rol logueado que tu ProtectedRoute acepte) */}
      <Route element={<ProtectedRoute allowedRoles={[]} />}>
        <Route
          path="/home"
          element={
            <ClientLayout>
              <HomeClient />
            </ClientLayout>
          }
        />
        <Route
          path="/cart"
          element={
            <ClientLayout>
              <CartPage />
            </ClientLayout>
          }
        />
      </Route>

      {/* Admin + SuperAdmin (mismo layout, cambia el menú por rol) */}
      <Route element={<ProtectedRoute allowedRoles={["Admin", "SuperAdmin"]} />}>
        <Route
          path="/admin/foods"
          element={
            <AdminLayout>
              <AdminFoods />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/foods/new"
          element={
            <AdminLayout>
              <FoodForm />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminLayout>
              <AdminOrders />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/restaurants"
          element={
            <AdminLayout>
              <AdminRestaurants />
            </AdminLayout>
          }
        />
      </Route>

      {/* Solo SuperAdmin (pero reutilizando el mismo AdminLayout) */}
      <Route element={<ProtectedRoute allowedRoles={["SuperAdmin"]} />}>
        <Route
          path="/superadmin/restaurants/new"
          element={
            <AdminLayout>
              <AdminCreateRestaurants />
            </AdminLayout>
          }
        />
        <Route
          path="/superadmin/forms/users"
          element={
            <AdminLayout>
              <SuperAdminFormUsers />
            </AdminLayout>
          }
        />
        <Route
          path="/superadmin/forms/restaurants"
          element={
            <AdminLayout>
              <SuperAdminFormRestaurants />
            </AdminLayout>
          }
        />
        <Route
          path="/superadmin/forms/menus"
          element={
            <AdminLayout>
              <SuperAdminFormMenus />
            </AdminLayout>
          }
        />
        <Route
          path="/superadmin/forms/tags"
          element={
            <AdminLayout>
              <SuperAdminFormTags />
            </AdminLayout>
          }
        />
        <Route
          path="/superadmin/users"
          element={
            <AdminLayout>
              <SuperAdminManageUsers />
            </AdminLayout>
          }
        />
        <Route
          path="/superadmin/restaurants"
          element={
            <AdminLayout>
              <SuperAdminManageRestaurants />
            </AdminLayout>
          }
        />
        <Route
          path="/superadmin/orders"
          element={
            <AdminLayout>
              <SuperAdminManageOrders />
            </AdminLayout>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
