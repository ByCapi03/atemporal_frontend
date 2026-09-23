export const InventoryAdminPage = () => {
  return (
    <div className="dashboard-container">
      <div className="page-header">
        <h1 className="page-title">Inventario</h1>
        <p className="page-subtitle">Control de existencias por sucursal</p>
      </div>

      <section className="content-card">
        <div className="crud-header">
          <h2>Gestión de Stock</h2>
          <div className="crud-actions">
            <button className="btn-secondary" disabled>Importar Excel</button>
            <button className="btn-primary" disabled>+ Registrar Movimiento</button>
          </div>
        </div>

        <div className="empty-state">
          El módulo de inventario estará disponible cuando existan productos y variantes.
        </div>
      </section>
    </div>
  );
};
