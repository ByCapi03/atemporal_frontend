import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/axios';
import '../../styles/login.css';

export const ActivateAccountPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await api.post('/auth/request-account-activation', { email });
      setSuccess('Código enviado. Revisa tu correo electrónico (incluyendo spam).');
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al solicitar el código.');
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await api.post('/auth/activate-account', { email, code, password });
      setSuccess('Cuenta activada exitosamente. Redirigiendo al login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al activar la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card" style={{ maxWidth: '400px' }}>
        <div className="login-header">
          <h2>Activar Cuenta</h2>
          <p>
            {step === 1 
              ? 'Ingresa tu correo para recibir un código de activación' 
              : 'Ingresa el código que enviamos a tu correo'}
          </p>
        </div>

        {error && <div className="error-alert">{error}</div>}
        {success && <div style={{ color: '#155724', backgroundColor: '#d4edda', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{success}</div>}

        {step === 1 ? (
          <form className="login-form" onSubmit={handleRequestCode}>
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

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Solicitando...' : 'Solicitar Código'}
            </button>
            
            <div className="register-link" style={{ marginTop: '15px', textAlign: 'center' }}>
              <button type="button" onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}>
                Volver al inicio de sesión
              </button>
            </div>
          </form>
        ) : (
          <form className="login-form" onSubmit={handleActivate}>
            <div className="form-group">
              <label>Código de Activación (6 dígitos)</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                required
                maxLength={6}
              />
            </div>
            
            <div className="form-group">
              <label>Nueva Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label>Confirmar Contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Activando...' : 'Activar Cuenta'}
            </button>
            
            <div className="register-link" style={{ marginTop: '15px', textAlign: 'center' }}>
              <button type="button" onClick={() => { setStep(1); setError(null); setSuccess(null); }} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}>
                Volver atrás
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
