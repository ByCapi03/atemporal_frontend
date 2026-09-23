import { useAuth } from '../features/auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export const DashboardHeader = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="dashboard-header">
      <h2>Sistema Interno</h2>
      <div className="header-actions">
        <span>Bienvenido, {user?.name || 'Personal'}</span>
        <button className="btn-secondary" onClick={handleLogout}>Salir</button>
      </div>
    </header>
  );
};
