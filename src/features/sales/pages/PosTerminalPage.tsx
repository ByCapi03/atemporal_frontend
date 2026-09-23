import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../api/axios';

interface PosProduct {
  productId: number;
  variantId: number;
  productName: string;
  imageUrl: string | null;
  sku: string;
  size: string;
  color: string;
  price: string;
  available: number;
}

interface CartItem {
  product: PosProduct;
  quantity: number;
}

export const PosTerminalPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<PosProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Terminal states
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('EFECTIVO');
  const [clientId, setClientId] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/pos/products');
      setProducts(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al obtener productos POS');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const lowerQ = searchQuery.toLowerCase();
    return products.filter(
      p => p.productName.toLowerCase().includes(lowerQ) || p.sku.toLowerCase().includes(lowerQ)
    );
  }, [products, searchQuery]);

  const total = useMemo(() => {
    return cart.reduce((acc, item) => acc + Number(item.product.price) * item.quantity, 0);
  }, [cart]);

  const addToCart = (product: PosProduct) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.variantId === product.variantId);
      if (existing) {
        if (existing.quantity >= product.available) return prev; // Cannot exceed stock
        return prev.map(item => 
          item.product.variantId === product.variantId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (variantId: number, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.variantId === variantId) {
          const newQty = item.quantity + delta;
          if (newQty > 0 && newQty <= item.product.available) {
            return { ...item, quantity: newQty };
          }
        }
        return item;
      });
    });
  };

  const removeFromCart = (variantId: number) => {
    setCart(prev => prev.filter(item => item.product.variantId !== variantId));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setCheckoutLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const payload: any = {
        paymentMethod,
        items: cart.map(item => ({
          variantId: item.product.variantId,
          quantity: item.quantity
        }))
      };

      if (clientId.trim()) {
        payload.clientId = Number(clientId);
      }

      const res = await api.post('/pos/sales', payload);
      
      setSuccessMessage(`Venta exitosa! ID: ${res.data.id} - Total: Bs. ${Number(res.data.total).toFixed(2)} - Pago: ${res.data.paymentMethod || paymentMethod}`);
      setCart([]);
      setClientId('');
      setPaymentMethod('EFECTIVO');
      await fetchProducts(); // Refresh stock
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al procesar la venta');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading && products.length === 0) return <div style={{ padding: '20px' }}>Cargando terminal...</div>;

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      
      {/* LEFT: Catalog */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto', backgroundColor: '#f5f7fa' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Catálogo POS</h2>
          <button 
            onClick={() => navigate('/dashboard/pos')} 
            style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#e2e6ea', border: 'none', borderRadius: '4px' }}
          >
            Volver al Dashboard
          </button>
        </div>

        <input
          type="text"
          placeholder="Buscar por nombre o SKU..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '4px', border: '1px solid #ccc' }}
        />

        {error && <div style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', marginBottom: '15px', borderRadius: '4px' }}>{error}</div>}
        {successMessage && <div style={{ padding: '10px', backgroundColor: '#d4edda', color: '#155724', marginBottom: '15px', borderRadius: '4px', fontWeight: 'bold' }}>{successMessage}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px' }}>
          {filteredProducts.map(p => {
            const inCart = cart.find(c => c.product.variantId === p.variantId)?.quantity || 0;
            const canAdd = inCart < p.available;

            return (
              <div key={p.variantId} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '100px', backgroundColor: '#f5f5f5', marginBottom: '10px', borderRadius: '4px', overflow: 'hidden' }}>
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.productName} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '0.8rem' }}>Sin imagen</div>
                  )}
                </div>
                <h5 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>{p.productName}</h5>
                <p style={{ margin: '0 0 5px 0', fontSize: '0.8rem', color: '#666' }}>SKU: {p.sku}</p>
                <p style={{ margin: '0 0 5px 0', fontSize: '0.8rem' }}>{p.size} | {p.color}</p>
                <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Bs. {Number(p.price).toFixed(2)}</p>
                
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'green', fontWeight: 'bold' }}>Stock: {p.available}</span>
                  <button 
                    onClick={() => addToCart(p)}
                    disabled={!canAdd}
                    style={{ 
                      padding: '5px 10px', 
                      backgroundColor: canAdd ? '#007bff' : '#ccc', 
                      color: '#fff', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: canAdd ? 'pointer' : 'not-allowed', 
                      fontSize: '0.8rem' 
                    }}
                  >
                    Agregar
                  </button>
                </div>
              </div>
            );
          })}

          {filteredProducts.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#666' }}>
              No se encontraron productos.
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Cart */}
      <div style={{ width: '350px', backgroundColor: '#fff', borderLeft: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #ddd' }}>
          <h3 style={{ margin: 0 }}>Carrito de Venta</h3>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {cart.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center', marginTop: '40px' }}>El carrito está vacío</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {cart.map(item => (
                <div key={item.product.variantId} style={{ display: 'flex', flexDirection: 'column', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <strong style={{ fontSize: '0.9rem' }}>{item.product.productName} ({item.product.size})</strong>
                    <button onClick={() => removeFromCart(item.product.variantId)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontSize: '0.8rem' }}>✖</button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>Bs. {Number(item.product.price).toFixed(2)}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button 
                        onClick={() => updateQuantity(item.product.variantId, -1)}
                        disabled={item.quantity <= 1}
                        style={{ width: '25px', height: '25px', padding: 0, cursor: 'pointer' }}
                      >-</button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.variantId, 1)}
                        disabled={item.quantity >= item.product.available}
                        style={{ width: '25px', height: '25px', padding: 0, cursor: 'pointer' }}
                      >+</button>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', marginTop: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    Bs. {(Number(item.product.price) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: '20px', borderTop: '1px solid #ddd', backgroundColor: '#f9f9f9' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px' }}>Cliente ID (Opcional):</label>
            <input 
              type="number" 
              placeholder="Ej. 123" 
              value={clientId}
              onChange={e => setClientId(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px' }}>Método de Pago:</label>
            <select 
              value={paymentMethod} 
              onChange={e => setPaymentMethod(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            >
              <option value="EFECTIVO">Efectivo</option>
              <option value="TARJETA">Tarjeta</option>
              <option value="QR">QR</option>
              <option value="TRANSFERENCIA">Transferencia</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '1.2rem', fontWeight: 'bold' }}>
            <span>Total:</span>
            <span>Bs. {total.toFixed(2)}</span>
          </div>

          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0 || checkoutLoading}
            style={{ 
              width: '100%', 
              padding: '12px', 
              backgroundColor: cart.length === 0 ? '#6c757d' : '#28a745', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '4px', 
              fontWeight: 'bold', 
              fontSize: '1rem',
              cursor: cart.length === 0 ? 'not-allowed' : 'pointer' 
            }}
          >
            {checkoutLoading ? 'Procesando...' : 'COBRAR'}
          </button>
        </div>
      </div>
    </div>
  );
};
