import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../api/axios';
import { useAuth } from '../../auth/AuthContext';

interface CashSessionData {
  status: 'OPEN' | 'CLOSED';
  session: {
    id: number;
    openingAmount: string;
    openedAt: string;
  } | null;
  branch: {
    id: number;
    code: string;
    name: string;
  };
}

export const PosDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<CashSessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openingAmount, setOpeningAmount] = useState('');

  const fetchSession = async () => {
    try {
      setLoading(true);
      const res = await api.get('/cash-sessions/current');
      setData(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al obtener sesión de caja');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const handleOpenSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const amount = Number(openingAmount);
    if (isNaN(amount) || amount < 0) {
      setError('El monto debe ser un número válido mayor o igual a 0');
      return;
    }

    try {
      await api.post('/cash-sessions/open', { openingAmount: amount });
      await fetchSession();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al aperturar caja');
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Cargando estado de caja...</div>;
  if (!data) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Punto de Venta (POS)</h2>
      
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <p><strong>Cajero:</strong> {user?.name}</p>
        <p><strong>Sucursal:</strong> {data.branch.name} ({data.branch.code})</p>
        <p>
          <strong>Estado de Caja:</strong>{' '}
          <span style={{ 
            color: data.status === 'OPEN' ? 'green' : 'red',
            fontWeight: 'bold' 
          }}>
            {data.status === 'OPEN' ? 'ABIERTA' : 'CERRADA'}
          </span>
        </p>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

      {data.status === 'CLOSED' ? (
        <form onSubmit={handleOpenSession} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Monto Inicial (Bs.)</label>
            <input 
              type="number" 
              step="0.01" 
              min="0" 
              required
              value={openingAmount}
              onChange={e => setOpeningAmount(e.target.value)}
              style={{ padding: '10px', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <button type="submit" style={{ padding: '12px', backgroundColor: '#0056b3', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            APERTURAR CAJA
          </button>
        </form>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <p><strong>Monto Inicial:</strong> Bs. {Number(data.session?.openingAmount).toFixed(2)}</p>
          <p><strong>Abierta el:</strong> {new Date(data.session?.openedAt || '').toLocaleString()}</p>
          
          <button 
            onClick={() => navigate('/dashboard/pos/terminal')} 
            style={{ padding: '12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center' }}
          >
            IR AL PUNTO DE VENTA
          </button>
          
          <button disabled style={{ padding: '12px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'not-allowed' }}>
            CERRAR CAJA (Próximamente)
          </button>
        </div>
      )}
    </div>
  );
};
