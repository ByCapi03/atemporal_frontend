import { Outlet } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div className="auth-layout" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
      <div className="auth-container" style={{ padding: '40px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <Outlet />
      </div>
    </div>
  );
};
