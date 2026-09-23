import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../../api/axios';

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
  status: 'AVAILABLE' | 'LOW_STOCK';
}

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
    }
  }, [selectedVariant]);

  const uniqueCities = Array.from(new Set(availabilities.map(a => a.cityId)))
    .map(cid => availabilities.find(a => a.cityId === cid)!);

  const branchesInSelectedCity = availabilities.filter(a => a.cityId === selectedCityId);

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Cargando detalles...</div>;
  if (error || !product) return <div style={{ padding: '50px', textAlign: 'center', color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
      
      {/* Product Image Placeholder */}
      <div style={{ flex: '1 1 400px', backgroundColor: '#f8f9fa', borderRadius: '8px', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', border: '1px solid #eee', overflow: 'hidden' }}>
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          '[Imagen Principal del Producto]'
        )}
      </div>

      {/* Product Info & Selection */}
      <div style={{ flex: '1 1 400px' }}>
        <button onClick={() => navigate('/catalog')} style={{ background: 'none', border: 'none', color: '#0056b3', cursor: 'pointer', padding: 0, marginBottom: '20px' }}>&larr; Volver al catlogo</button>
        <span style={{ fontSize: '0.9rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>{product.categoryName}</span>
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
              <p style={{ color: 'red', fontWeight: 'bold' }}>Sin stock disponible para esta combinacin.</p>
            ) : (
              <>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Selecciona tu Ciudad</label>
                  <select 
                    value={selectedCityId || ''} 
                    onChange={e => { setSelectedCityId(Number(e.target.value)); setSelectedBranchId(null); }}
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    <option value="">Seleccione una ciudad...</option>
                    {uniqueCities.map(c => <option key={c.cityId} value={c.cityId}>{c.cityName}</option>)}
                  </select>
                </div>

                {selectedCityId && (
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Sucursales Disponibles</label>
                    <div style={{ display: 'grid', gap: '10px' }}>
                      {branchesInSelectedCity.map(b => (
                        <div 
                          key={b.branchId}
                          onClick={() => setSelectedBranchId(b.branchId)}
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
                          <span style={{ fontWeight: 'bold' }}>{b.branchName}</span>
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
                
                
                {selectedVariant && selectedBranchId && (
                  <button 
                    style={{ width: '100%', padding: '15px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}
                    onClick={() => navigate('/reservations/new', {
                      state: {
                        productId: product.id,
                        productName: product.name,
                        price: product.price,
                        variantId: selectedVariant.id,
                        sizeName: selectedVariant.sizeName,
                        colorName: selectedVariant.colorName,
                        branchId: selectedBranchId,
                        branchName: branchesInSelectedCity.find(b => b.branchId === selectedBranchId)?.branchName
                      }
                    })}
                  >
                    Reservar Prenda
                  </button>
                )}

                {/* Virtual Try-On Button */}
                {selectedVariant && product.arEnabled && product.arImageUrl && (
                  <button 
                    style={{ width: '100%', padding: '15px', backgroundColor: '#e83e8c', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
                    onClick={() => navigate(`/try-on/${selectedVariant.id}`)}
                  >
                    ✨ Probar virtualmente
                  </button>
                )}
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
