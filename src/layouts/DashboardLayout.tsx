import { Outlet } from 'react-router-dom';
import { DashboardSidebar } from '../components/layout/DashboardSidebar';
import { DashboardHeader } from '../components/layout/DashboardHeader';

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
