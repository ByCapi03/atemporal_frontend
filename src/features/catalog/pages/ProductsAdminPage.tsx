export const ProductsAdminPage = () => {
  return (
    <div className="dashboard-container">
      <div className="page-header">
        <h1 className="page-title">Catálogo de Productos</h1>
        <p className="page-subtitle">Administra los productos, categorías y variantes disponibles</p>
      </div>

      <section className="content-card">
        <div className="crud-header">
          <h2>Lista de Productos</h2>
          <div className="crud-actions">
            <button className="btn-secondary" disabled>Categorías</button>
            <button className="btn-primary" disabled>+ Nuevo Producto</button>
          </div>
        </div>

        <div className="empty-state">
          El módulo de catálogo estará disponible próximamente.
        </div>
      </section>
    </div>
  );
};
