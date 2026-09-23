import { Outlet } from 'react-router-dom';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';
import '../styles/dashboard.css';
import '../styles/crud.css';

export const DashboardLayout = () => {
  return (
    <div className="dashboard-layout" style={{ display: 'flex', minHeight: '100vh' }}>
      <DashboardSidebar />
      <div className="dashboard-content" style={{ flex: 1, padding: '20px', backgroundColor: '#f5f6fa' }}>
        <DashboardHeader />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
