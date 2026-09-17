import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import { StoreLayout } from '../layouts/StoreLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { AuthLayout } from '../layouts/AuthLayout';

// Auth Pages
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';

// Store Pages
import { HomePage } from '../features/home/pages/HomePage';
import { CatalogPage } from '../features/catalog/pages/CatalogPage';
import { ProductDetailPage } from '../features/catalog/pages/ProductDetailPage';
import { BranchesPage } from '../features/branches/pages/BranchesPage';
import { ReservationsPage } from '../features/reservations/pages/ReservationsPage';
import { CreateReservationPage } from '../features/reservations/pages/CreateReservationPage';
import { CartPage } from '../features/cart/pages/CartPage';
import { CheckoutPage } from '../features/checkout/pages/CheckoutPage';
import { OrdersPage } from '../features/orders/pages/OrdersPage';
import { OrderDetailPage } from '../features/orders/pages/OrderDetailPage';

// Admin Pages
import { DashboardPage } from '../features/admin/pages/DashboardPage';
import { ProductsAdminPage } from '../features/admin/pages/ProductsAdminPage';
import { InventoryAdminPage } from '../features/admin/pages/InventoryAdminPage';
import { BranchesAdminPage } from '../features/admin/pages/BranchesAdminPage';
import { ReservationsAdminPage } from '../features/admin/pages/ReservationsAdminPage';
import { SalesAdminPage } from '../features/admin/pages/SalesAdminPage';
import { UsersAdminPage } from '../features/admin/pages/UsersAdminPage';
import { ReportsPage } from '../features/reports/pages/ReportsPage';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Store Routes */}
        <Route path="/" element={<StoreLayout />}>
          <Route index element={<HomePage />} />
          <Route path="catalog" element={<CatalogPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="branches" element={<BranchesPage />} />
          <Route path="reservations" element={<ReservationsPage />} />
          <Route path="reservations/new" element={<CreateReservationPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<ProductsAdminPage />} />
          <Route path="inventory" element={<InventoryAdminPage />} />
          <Route path="branches" element={<BranchesAdminPage />} />
          <Route path="reservations" element={<ReservationsAdminPage />} />
          <Route path="sales" element={<SalesAdminPage />} />
          <Route path="users" element={<UsersAdminPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
