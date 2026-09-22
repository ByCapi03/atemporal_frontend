import { NavLink } from 'react-router-dom';
import { DASHBOARD_NAVIGATION } from '../../config/navigation';
import { useAuth } from '../../features/auth/context/AuthContext';

export const DashboardSidebar = () => {
  const { roleId } = useAuth();

  // Filter navigation items based on the user's role
  const allowedNavItems = DASHBOARD_NAVIGATION.filter(item => 
    roleId && item.allowedRoles.includes(roleId)
  );

  return (
    <div className="sidebar" style={{ 
      width: '250px', 
      backgroundColor: '#2c3e50', 
      color: '#ecf0f1',
      padding: '20px 0'
    }}>
      <div style={{ padding: '0 20px', marginBottom: '30px' }}>
        <h3 style={{ margin: 0 }}>Dashboard</h3>
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column' }}>
        {allowedNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            style={({ isActive }) => ({
              padding: '12px 20px',
              color: '#ecf0f1',
              textDecoration: 'none',
              backgroundColor: isActive ? '#34495e' : 'transparent',
              borderLeft: isActive ? '4px solid #3498db' : '4px solid transparent',
              transition: 'all 0.3s'
            })}
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
