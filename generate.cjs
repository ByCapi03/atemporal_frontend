const fs = require('fs');
const path = require('path');

const base = path.join(__dirname, 'src');

const dirs = [
    "api",
    "assets",
    "components/ui",
    "components/layout",
    "components/common",
    "features/auth/pages",
    "features/catalog/components",
    "features/catalog/pages",
    "features/catalog/mocks",
    "features/branches/pages",
    "features/reservations/pages",
    "features/cart/pages",
    "features/checkout/pages",
    "features/orders/pages",
    "features/admin/pages",
    "features/reports/pages",
    "features/home/pages",
    "layouts",
    "pages",
    "routes",
    "hooks",
    "types",
    "utils"
];

dirs.forEach(d => {
    fs.mkdirSync(path.join(base, d), { recursive: true });
});

function writeComponent(filePath, name) {
    const content = `import React from 'react';\n\nexport const ${name} = () => {\n  return (\n    <div className="${name}">\n      <h1>${name}</h1>\n    </div>\n  );\n};\n`;
    fs.writeFileSync(path.join(base, filePath), content);
}

writeComponent("layouts/StoreLayout.tsx", "StoreLayout");
writeComponent("layouts/AdminLayout.tsx", "AdminLayout");
writeComponent("layouts/AuthLayout.tsx", "AuthLayout");

writeComponent("components/layout/Navbar.tsx", "Navbar");
writeComponent("components/layout/Sidebar.tsx", "Sidebar");
writeComponent("components/layout/Footer.tsx", "Footer");
writeComponent("components/common/Loading.tsx", "Loading");
writeComponent("components/common/EmptyState.tsx", "EmptyState");

writeComponent("features/auth/pages/LoginPage.tsx", "LoginPage");
writeComponent("features/auth/pages/RegisterPage.tsx", "RegisterPage");

writeComponent("features/catalog/components/ProductCard.tsx", "ProductCard");
writeComponent("features/catalog/components/ProductGrid.tsx", "ProductGrid");
writeComponent("features/catalog/components/ProductFilters.tsx", "ProductFilters");
writeComponent("features/catalog/components/SearchBar.tsx", "SearchBar");
writeComponent("features/catalog/pages/CatalogPage.tsx", "CatalogPage");
writeComponent("features/catalog/pages/ProductDetailPage.tsx", "ProductDetailPage");

writeComponent("features/branches/pages/BranchesPage.tsx", "BranchesPage");

writeComponent("features/reservations/pages/ReservationsPage.tsx", "ReservationsPage");
writeComponent("features/reservations/pages/CreateReservationPage.tsx", "CreateReservationPage");

writeComponent("features/cart/pages/CartPage.tsx", "CartPage");
writeComponent("features/checkout/pages/CheckoutPage.tsx", "CheckoutPage");

writeComponent("features/orders/pages/OrdersPage.tsx", "OrdersPage");
writeComponent("features/orders/pages/OrderDetailPage.tsx", "OrderDetailPage");

writeComponent("features/admin/pages/DashboardPage.tsx", "DashboardPage");
writeComponent("features/admin/pages/ProductsAdminPage.tsx", "ProductsAdminPage");
writeComponent("features/admin/pages/InventoryAdminPage.tsx", "InventoryAdminPage");
writeComponent("features/admin/pages/BranchesAdminPage.tsx", "BranchesAdminPage");
writeComponent("features/admin/pages/ReservationsAdminPage.tsx", "ReservationsAdminPage");
writeComponent("features/admin/pages/SalesAdminPage.tsx", "SalesAdminPage");
writeComponent("features/admin/pages/UsersAdminPage.tsx", "UsersAdminPage");

writeComponent("features/reports/pages/ReportsPage.tsx", "ReportsPage");
writeComponent("features/home/pages/HomePage.tsx", "HomePage");

console.log("Structure created successfully.");
