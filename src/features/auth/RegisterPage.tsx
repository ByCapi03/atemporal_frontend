import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { api } from '../../api/axios';
import '../../styles/login.css';

export const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post('/auth/register', { name, lastName, email, password, phone });
      login(res.data.accessToken, res.data.user);
      navigate('/'); // Go back to store
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.code === 'CLIENT_EXISTS_WITHOUT_DIGITAL_ACCOUNT') {
        setError('CLIENT_EXISTS_WITHOUT_DIGITAL_ACCOUNT');
      } else {
        setError(err.response?.data?.message || 'Error al registrar la cuenta.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Crear Cuenta</h2>
          <p>Regístrate para hacer reservas y compras</p>
        </div>

        {error === 'CLIENT_EXISTS_WITHOUT_DIGITAL_ACCOUNT' ? (
          <div className="error-alert" style={{ textAlign: 'center' }}>
            <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>Ya eres cliente de nuestra tienda.</p>
            <p style={{ marginBottom: '15px' }}>Para realizar compras online, necesitas activar tu cuenta digital.</p>
            <button 
              type="button" 
              onClick={() => navigate('/activate-account')}
              style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%', fontWeight: 'bold' }}
            >
              ACTIVAR MI CUENTA
            </button>
          </div>
        ) : error ? (
          <div className="error-alert">{error}</div>
        ) : null}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ingresa tu nombre"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Apellidos</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Ingresa tus apellidos"
              required
            />
          </div>

          <div className="form-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa una contraseña segura"
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label>Teléfono (opcional)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ingresa tu teléfono"
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarme'}
          </button>

          <div className="register-link" style={{ marginTop: '15px', textAlign: 'center' }}>
            ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
          </div>
        </form>
      </div>
    </div>
  );
};
