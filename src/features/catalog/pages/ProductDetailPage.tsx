import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../../api/axios';
import { useCart } from '../../cart/CartContext';
import { useAuth } from '../../auth/AuthContext';
import '../../../styles/store.css';

interface VariantInfo {
  id: number;
  sku: string;
  sizeId: number;
  sizeName: string;
  colorId: number;
  colorName: string;
}

interface ProductDetail {
  id: number;
  name: string;
  price: number;
  categoryName: string;
  imageUrl: string | null;
  arEnabled?: boolean;
  arImageUrl?: string | null;
  arType?: string | null;
  variants: VariantInfo[];
}

interface Availability {
  branchId: number;
  branchName: string;
  cityId: number;
  cityName: string;
  available: number;
  status: 'AVAILABLE' | 'LOW_STOCK';
}

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selection state
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
  
  // Availability state
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  
  // Quantity state
  const [quantity, setQuantity] = useState(1);

  // User feedback messages
  const [cartSuccessMessage, setCartSuccessMessage] = useState<string | null>(null);
  const [cartErrorMessage, setCartErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/store/products/${id}`);
        setProduct(data);
      } catch (err: any) {
        setError('Producto no encontrado o no disponible');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  // Derived unique colors and sizes based on current selection to enforce validity
  const getAvailableColors = () => {
    if (!product) return [];
    if (!selectedSizeId) return Array.from(new Set(product.variants.map(v => v.colorId)))
      .map(cid => product.variants.find(v => v.colorId === cid)!);
    return product.variants.filter(v => v.sizeId === selectedSizeId);
  };

  const getAvailableSizes = () => {
    if (!product) return [];
    if (!selectedColorId) return Array.from(new Set(product.variants.map(v => v.sizeId)))
      .map(sid => product.variants.find(v => v.sizeId === sid)!);
    return product.variants.filter(v => v.colorId === selectedColorId);
  };

  const uniqueColors = getAvailableColors().filter((v, i, a) => a.findIndex(t => t.colorId === v.colorId) === i);
  const uniqueSizes = getAvailableSizes().filter((v, i, a) => a.findIndex(t => t.sizeId === v.sizeId) === i);

  // Find selected variant
  const selectedVariant = product?.variants.find(
    v => v.colorId === selectedColorId && v.sizeId === selectedSizeId
  );

  useEffect(() => {
    if (selectedVariant) {
      const fetchAvailability = async () => {
        try {
          setLoadingAvailability(true);
          setAvailabilities([]);
          setSelectedCityId(null);
          setSelectedBranchId(null);
          setQuantity(1);
          setCartSuccessMessage(null);
          setCartErrorMessage(null);
          const { data } = await api.get(`/store/availability/${selectedVariant.id}`);
          setAvailabilities(data);
        } catch (err) {
          console.error("Error fetching availability", err);
        } finally {
          setLoadingAvailability(false);
        }
      };
      fetchAvailability();
    } else {
      setAvailabilities([]);
      setSelectedCityId(null);
      setSelectedBranchId(null);
      setQuantity(1);
    }
  }, [selectedVariant]);

  const uniqueCities = Array.from(new Set(availabilities.map(a => a.cityId)))
    .map(cid => availabilities.find(a => a.cityId === cid)!);

  const branchesInSelectedCity = availabilities.filter(a => a.cityId === selectedCityId);

  const selectedBranchAvailability = branchesInSelectedCity.find(b => b.branchId === selectedBranchId);

  const maxAvailable = selectedBranchAvailability ? selectedBranchAvailability.available : 0;

  const handleCityChange = (cityId: number | null) => {
    setSelectedCityId(cityId);
    setSelectedBranchId(null);
    setQuantity(1);
    setCartSuccessMessage(null);
    setCartErrorMessage(null);
  };

  const handleBranchSelect = (branchId: number) => {
    setSelectedBranchId(branchId);
    setQuantity(1);
    setCartSuccessMessage(null);
    setCartErrorMessage(null);
  };

  const handleReserve = () => {
    if (!product || !selectedVariant || !selectedBranchId || !selectedBranchAvailability) return;
    
    const reservationState = {
      productId: product.id,
      productName: product.name,
      price: product.price,
      variantId: selectedVariant.id,
      sizeName: selectedVariant.sizeName,
      colorName: selectedVariant.colorName,
      branchId: selectedBranchId,
      branchName: selectedBranchAvailability.branchName,
      quantity
    };

    if (!isAuthenticated) {
      sessionStorage.setItem('pendingReservation', JSON.stringify(reservationState));
      navigate('/login');
    } else {
      navigate('/reservations/new', { state: reservationState });
    }
  };

  const handleAddToCart = () => {
    if (!product || !selectedVariant || !selectedBranchId || !selectedBranchAvailability) return;

    setCartSuccessMessage(null);
    setCartErrorMessage(null);

    const result = addToCart(
      {
        productId: product.id,
        variantId: selectedVariant.id,
        productName: product.name,
        imageUrl: product.imageUrl,
        size: selectedVariant.sizeName,
        color: selectedVariant.colorName,
        price: product.price,
        quantity,
        available: selectedBranchAvailability.available
      },
      selectedBranchAvailability.branchId,
      selectedBranchAvailability.branchName
    );

    if (result.success) {
      setCartSuccessMessage('✔ Producto agregado al carrito con éxito');
    } else {
      setCartErrorMessage(result.message || 'No se pudo agregar al carrito');
    }
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Cargando detalles...</div>;
  if (error || !product) return <div style={{ padding: '50px', textAlign: 'center', color: 'red' }}>{error}</div>;

  const isActionDisabled = !selectedVariant || !selectedBranchId || quantity < 1 || maxAvailable < quantity;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
      
      {/* Product Image */}
      <div style={{ flex: '1 1 400px', backgroundColor: '#f8f9fa', borderRadius: '8px', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', border: '1px solid #eee', overflow: 'hidden' }}>
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          '[Imagen Principal del Producto]'
        )}
      </div>

      {/* Product Info & Selection */}
      <div style={{ flex: '1 1 400px' }}>
        <button onClick={() => navigate('/catalog')} style={{ background: 'none', border: 'none', color: '#0056b3', cursor: 'pointer', padding: 0, marginBottom: '20px' }}>&larr; Volver al catálogo</button>
        <span style={{ display: 'block', fontSize: '0.9rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>{product.categoryName}</span>
        <h1 style={{ fontSize: '2.5rem', margin: '10px 0', color: '#333' }}>{product.name}</h1>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0056b3', marginBottom: '30px' }}>Bs. {Number(product.price).toFixed(2)}</p>

        {/* Color Selection */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ marginBottom: '10px', color: '#555' }}>Color</h4>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {uniqueColors.map(v => (
              <button
                key={`color-${v.colorId}`}
                onClick={() => setSelectedColorId(selectedColorId === v.colorId ? null : v.colorId)}
                style={{
                  padding: '8px 16px',
                  border: selectedColorId === v.colorId ? '2px solid #333' : '1px solid #ddd',
                  backgroundColor: selectedColorId === v.colorId ? '#f0f0f0' : '#fff',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {v.colorName}
              </button>
            ))}
          </div>
        </div>

        {/* Size Selection */}
        <div style={{ marginBottom: '30px' }}>
          <h4 style={{ marginBottom: '10px', color: '#555' }}>Talla</h4>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {uniqueSizes.map(v => (
              <button
                key={`size-${v.sizeId}`}
                onClick={() => setSelectedSizeId(selectedSizeId === v.sizeId ? null : v.sizeId)}
                style={{
                  padding: '8px 16px',
                  border: selectedSizeId === v.sizeId ? '2px solid #333' : '1px solid #ddd',
                  backgroundColor: selectedSizeId === v.sizeId ? '#f0f0f0' : '#fff',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {v.sizeName}
              </button>
            ))}
          </div>
        </div>

        {/* Availability Flow */}
        {selectedColorId && selectedSizeId && (
          <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
            <h3 style={{ marginBottom: '15px' }}>Disponibilidad en Tiendas</h3>
            
            {loadingAvailability ? (
              <p>Consultando inventario en tiempo real...</p>
            ) : availabilities.length === 0 ? (
              <p style={{ color: 'red', fontWeight: 'bold' }}>Sin stock disponible para esta combinación.</p>
            ) : (
              <>
                {/* City selector */}
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Ciudad</label>
                  <select 
                    value={selectedCityId || ''} 
                    onChange={e => handleCityChange(e.target.value ? Number(e.target.value) : null)}
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    <option value="">Seleccione una ciudad...</option>
                    {uniqueCities.map(c => <option key={c.cityId} value={c.cityId}>{c.cityName}</option>)}
                  </select>
                </div>

                {/* Branch list */}
                {selectedCityId && (
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Sucursal</label>
                    <div style={{ display: 'grid', gap: '10px' }}>
                      {branchesInSelectedCity.map(b => (
                        <div 
                          key={b.branchId}
                          onClick={() => handleBranchSelect(b.branchId)}
                          style={{
                            padding: '15px',
                            border: selectedBranchId === b.branchId ? '2px solid #0056b3' : '1px solid #ddd',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            backgroundColor: selectedBranchId === b.branchId ? '#f0f7ff' : '#fff',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div>
                            <span style={{ fontWeight: 'bold', display: 'block' }}>{b.branchName}</span>
                            <span style={{ fontSize: '0.85rem', color: '#666' }}>Disponible: {b.available} unidades</span>
                          </div>
                          <span style={{ 
                            fontSize: '0.85rem', 
                            padding: '4px 8px', 
                            borderRadius: '12px', 
                            backgroundColor: b.status === 'AVAILABLE' ? '#dff0d8' : '#fcf8e3',
                            color: b.status === 'AVAILABLE' ? '#3c763d' : '#8a6d3b'
                          }}>
                            {b.status === 'AVAILABLE' ? 'Disponible' : 'Pocas Unidades'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity selector */}
                {selectedBranchId && selectedBranchAvailability && (
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Cantidad</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
                        <button 
                          onClick={() => setQuantity(q => Math.max(1, q - 1))}
                          disabled={quantity <= 1}
                          style={{ padding: '8px 16px', border: 'none', background: '#f0f0f0', cursor: quantity <= 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                        >
                          -
                        </button>
                        <span style={{ padding: '8px 20px', minWidth: '40px', textAlign: 'center', fontWeight: 'bold' }}>
                          {quantity}
                        </span>
                        <button 
                          onClick={() => setQuantity(q => Math.min(maxAvailable, q + 1))}
                          disabled={quantity >= maxAvailable}
                          style={{ padding: '8px 16px', border: 'none', background: '#f0f0f0', cursor: quantity >= maxAvailable ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                        >
                          +
                        </button>
                      </div>
                      <span style={{ fontSize: '0.85rem', color: '#666' }}>
                        (Máximo: {maxAvailable})
                      </span>
                    </div>
                  </div>
                )}

                {/* Feedback Banners */}
                {cartSuccessMessage && (
                  <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '10px 14px', borderRadius: '4px', marginBottom: '15px', fontSize: '0.95rem' }}>
                    {cartSuccessMessage}
                  </div>
                )}
                {cartErrorMessage && (
                  <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '10px 14px', borderRadius: '4px', marginBottom: '15px', fontSize: '0.95rem' }}>
                    {cartErrorMessage}
                  </div>
                )}

                {/* Reservation & Cart Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                  <button 
                    disabled={isActionDisabled}
                    onClick={handleReserve}
                    style={{ 
                      width: '100%', 
                      padding: '15px', 
                      backgroundColor: isActionDisabled ? '#ccc' : '#333', 
                      color: '#fff', 
                      border: 'none', 
                      borderRadius: '4px', 
                      fontSize: '1.05rem', 
                      fontWeight: 'bold', 
                      cursor: isActionDisabled ? 'not-allowed' : 'pointer' 
                    }}
                  >
                    Reservar en tienda
                  </button>

                  <button 
                    disabled={isActionDisabled}
                    onClick={handleAddToCart}
                    style={{ 
                      width: '100%', 
                      padding: '15px', 
                      backgroundColor: isActionDisabled ? '#e0e0e0' : '#0056b3', 
                      color: isActionDisabled ? '#888' : '#fff', 
                      border: 'none', 
                      borderRadius: '4px', 
                      fontSize: '1.05rem', 
                      fontWeight: 'bold', 
                      cursor: isActionDisabled ? 'not-allowed' : 'pointer' 
                    }}
                  >
                    Agregar al carrito
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Divider & Virtual Try-On Button (Independent of branch/city/quantity) */}
        {selectedVariant && product.arEnabled && product.arType && (product.arImageUrl || product.imageUrl) && (
          <div style={{ borderTop: '1px solid #eee', marginTop: '25px', paddingTop: '20px' }}>
            <button 
              style={{ width: '100%', padding: '15px', backgroundColor: '#e83e8c', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}
              onClick={() => navigate(`/try-on/${selectedVariant.id}`)}
            >
              ✨ Probar virtualmente
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
