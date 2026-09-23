import { useState, useEffect } from 'react';
import { api } from '../../../api/axios';
import { useAuth } from '../../auth/AuthContext';

export const ReservationsAdminPage = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      const { data } = await api.get('/reservations');
      setReservations(data);
    } catch (err) {
      console.error('Error fetching reservations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    if (!window.confirm(`Cambiar estado a ${newStatus}?`)) return;
    try {
      await api.patch(`/reservations/${id}`, { status: newStatus });
      fetchReservations();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al actualizar');
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDIENTE': return '#ffc107';
      case 'CONFIRMADA': return '#17a2b8';
      case 'PREPARANDO': return '#007bff';
      case 'LISTA': return '#28a745';
      case 'ATENDIDA': return '#6c757d';
      case 'CANCELADA': return '#dc3545';
      default: return '#666';
    }
  };

  const getNextStatuses = (status: string) => {
    const flow = ['PENDIENTE', 'CONFIRMADA', 'PREPARANDO', 'LISTA', 'ATENDIDA'];
    const idx = flow.indexOf(status);
    if (idx === -1 || idx === flow.length - 1) return [];
    return flow.slice(idx + 1);
  };

  if (loading) return <div style={{ padding: '20px' }}>Cargando reservas...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '20px', color: '#333' }}>
        Administracin de Reservas {user?.roles.includes('ENCARGADO') && !user.roles.includes('ADMIN') ? '(Mi Sucursal)' : ''}
      </h1>

      <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        {reservations.length === 0 ? (
          <p style={{ color: '#666' }}>No hay reservas para mostrar.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee' }}>
                <th style={{ padding: '12px 8px', color: '#555' }}>ID</th>
                <th style={{ padding: '12px 8px', color: '#555' }}>Cliente</th>
                <th style={{ padding: '12px 8px', color: '#555' }}>Sucursal</th>
                <th style={{ padding: '12px 8px', color: '#555' }}>Recojo</th>
                <th style={{ padding: '12px 8px', color: '#555' }}>Artculos</th>
                <th style={{ padding: '12px 8px', color: '#555' }}>Estado Actual</th>
                <th style={{ padding: '12px 8px', color: '#555' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(res => (
                <tr key={res.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px 8px' }}>#{res.id}</td>
                  <td style={{ padding: '12px 8px' }}>{res.client?.name} {res.client?.lastName} <br/><small style={{ color: '#888' }}>{res.client?.email}</small></td>
                  <td style={{ padding: '12px 8px' }}>{res.branch?.name}</td>
                  <td style={{ padding: '12px 8px' }}>{res.date} <br/> <small>{res.approximateTime}</small></td>
                  <td style={{ padding: '12px 8px' }}>
                    <ul style={{ margin: 0, paddingLeft: '15px' }}>
                      {res.items.map((item: any) => (
                        <li key={item.id} style={{ fontSize: '0.85rem' }}>
                          {item.quantity}x {item.variant.product.name} ({item.variant.size.name})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: getStatusColor(res.status), color: '#fff', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {res.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    {res.status !== 'CANCELADA' && res.status !== 'ATENDIDA' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <select 
                          value=""
                          onChange={(e) => handleUpdateStatus(res.id, e.target.value)}
                          style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                          <option value="" disabled>Avanzar estado...</option>
                          {getNextStatuses(res.status).map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <button 
                          onClick={() => handleUpdateStatus(res.id, 'CANCELADA')}
                          style={{ padding: '4px', backgroundColor: '#fff', border: '1px solid #dc3545', color: '#dc3545', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
