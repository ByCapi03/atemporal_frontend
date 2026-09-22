import { useAuth } from '../../features/auth/context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const DashboardHeader = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{ 
      paddingBottom: '20px', 
      borderBottom: '1px solid #ccc', 
      marginBottom: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h2>Sistema Interno</h2>
      <div>
        <span style={{ marginRight: '15px' }}>Bienvenido, {user?.name || 'Personal'}</span>
        <button onClick={handleLogout} style={{ padding: '5px 10px', cursor: 'pointer' }}>Salir</button>
      </div>
    </header>
  );
};
