import { NavLink } from 'react-router-dom';
import { DASHBOARD_NAVIGATION } from '../config/navigation';
import { useAuth } from '../features/auth/AuthContext';

export const DashboardSidebar = () => {
  const { user } = useAuth();

  // Filter navigation items based on the user's role
  const allowedNavItems = DASHBOARD_NAVIGATION.filter(item => 
    user?.roles?.some(role => item.allowedRoles.includes(role as any))
  );

  return (
    <div className="dashboard-sidebar">
      <div className="sidebar-brand">
        <h3>Dashboard</h3>
      </div>
      <nav className="sidebar-nav">
        {allowedNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) => 
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
