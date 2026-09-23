import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { api } from '../../../api/axios';
import '../../../styles/store.css';

export const CreateReservationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  let state = location.state as any;

  if (!state) {
    const pendingStr = sessionStorage.getItem('pendingReservation');
    if (pendingStr) {
      try {
        state = JSON.parse(pendingStr);
      } catch (e) {
        console.error('Error parsing pending reservation', e);
      }
    }
  }

  useEffect(() => {
    if (state) {
      // Solo limpiamos cuando la página cargó exitosamente
      sessionStorage.removeItem('pendingReservation');
    }
  }, [state]);

  if (!state) {
    alert('No se encontraron los datos de la reserva. Por favor selecciona el producto nuevamente.');
    return <Navigate to="/catalog" />;
  }

  const { productName, price, variantId, sizeName, colorName, branchId, branchName } = state;

  const [date, setDate] = useState('');
  const [approximateTime, setApproximateTime] = useState('');
  const [quantity, setQuantity] = useState(state.quantity || 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      setError('Por favor, selecciona una fecha');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await api.post('/reservations', {
        branchId,
        date,
        approximateTime,
        items: [
          { variantId, quantity }
        ]
      });
      alert('¡Reserva creada con éxito!');
      navigate('/account/reservations');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear la reserva');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page" style={{ padding: '40px 20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#fff', padding: '30px', borderRadius: '8px', border: '1px solid #eee', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '20px', color: '#333' }}>Confirmar Reserva</h1>
        
        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{productName}</h3>
          <p style={{ margin: '5px 0', color: '#666' }}><strong>Talla:</strong> {sizeName} | <strong>Color:</strong> {colorName}</p>
          <p style={{ margin: '5px 0', color: '#666' }}><strong>Sucursal:</strong> {branchName}</p>
          <p style={{ margin: '15px 0 0 0', fontSize: '1.2rem', fontWeight: 'bold', color: '#0056b3' }}>Bs. {Number(price).toFixed(2)}</p>
        </div>

        {error && <div style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '4px', marginBottom: '20px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Fecha de recojo *</label>
            <input 
              type="date" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
              required
              min={new Date().toISOString().split('T')[0]}
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Hora aproximada de recojo</label>
            <input 
              type="time" 
              value={approximateTime} 
              onChange={e => setApproximateTime(e.target.value)} 
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Cantidad</label>
            <input 
              type="number" 
              min="1" 
              value={quantity} 
              onChange={e => setQuantity(Number(e.target.value))} 
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Procesando...' : 'Confirmar Reserva'}
          </button>
        </form>
      </div>
    </div>
  );
};
