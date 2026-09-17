import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';

export const AdminLayout = () => {
  return (
    <div className="admin-layout" style={{ display: 'flex' }}>
      <Sidebar />
      <div className="admin-content" style={{ flex: 1, padding: '20px' }}>
        <header style={{ paddingBottom: '20px', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
          <h2>Panel de Administración</h2>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
