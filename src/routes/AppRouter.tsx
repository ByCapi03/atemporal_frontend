import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import { StoreLayout } from '../layouts/StoreLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { ProtectedRoute } from '../components/common/ProtectedRoute';

import { ROL } from '../types/roles';

// Auth Pages
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
import { ChangePasswordPage } from '../features/auth/ChangePasswordPage';
// Store Pages
import { HomePage } from '../features/home/pages/HomePage';
import { CatalogPage } from '../features/catalog/pages/CatalogPage';
import { ProductDetailPage } from '../features/catalog/pages/ProductDetailPage';
import { BranchesPage } from '../features/branches/BranchesPage';
import { ReservationsPage } from '../features/reservations/pages/ReservationsPage';
import { CreateReservationPage } from '../features/reservations/pages/CreateReservationPage';
import { CartPage } from '../features/cart/CartPage';
import { CheckoutPage } from '../features/checkout/pages/CheckoutPage';
import { OrdersPage } from '../features/orders/pages/OrdersPage';
import { OrderDetailPage } from '../features/orders/pages/OrderDetailPage';

// Backoffice Pages
import { DashboardPage } from '../features/home/pages/DashboardPage';
import { ProductsAdminPage } from '../features/catalog/pages/ProductsAdminPage';
import { InventoryAdminPage } from '../features/inventory/pages/InventoryAdminPage';
// BranchesAdminPage removed
import { ReservationsAdminPage } from '../features/reservations/pages/ReservationsAdminPage';
import { SalesAdminPage } from '../features/sales/pages/SalesAdminPage';
import { UsersPage } from '../features/dashboard/pages/UsersPage';
import { ReportsPage } from '../features/reports/pages/ReportsPage';
import { SuppliersPage } from '../features/suppliers/SuppliersPage';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
        </Route>

        {/* Store Routes (Customer Facing) */}
        <Route path="/" element={<StoreLayout />}>
          <Route index element={<HomePage />} />
          <Route path="catalog" element={<CatalogPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="reservations" element={<ReservationsPage />} />
          <Route path="reservations/new" element={<CreateReservationPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
        </Route>

        {/* Dashboard Routes (Internal Personnel) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={[
                ROL.ADMIN,
                ROL.ENCARGADO,
                ROL.CAJERO
              ]}
            />
          }
        >
          <Route element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductsAdminPage />} />
            <Route path="inventory" element={<InventoryAdminPage />} />
            <Route path="branches" element={<BranchesPage />} />
            <Route path="reservations" element={<ReservationsAdminPage />} />
            <Route path="sales" element={<SalesAdminPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="suppliers" element={<SuppliersPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
