import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../api/axios';

interface Product {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  categoryName: string;
  imageUrl: string | null;
}

export const CatalogPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Extract unique categories from products
  const categories = Array.from(new Set(products.map(p => p.categoryName))).sort();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/store/products');
        setProducts(data);
        setError(null);
      } catch (err: any) {
        setError('No se pudo conectar con el servidor');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    if (selectedCategory && p.categoryName !== selectedCategory) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333' }}>Catalogo de Productos</h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>Encuentra las mejores prendas y accesorios</p>
      </header>

      {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>{error}</div>}

      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '10px 15px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '250px' }}
        />
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          style={{ padding: '10px 15px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '200px' }}
        >
          <option value="">Todas las categoras</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>Cargando productos...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '30px' }}>
          {filteredProducts.map(p => (
            <div
              key={p.id}
              onClick={() => navigate(`/products/${p.id}`)}
              style={{
                border: '1px solid #eee',
                borderRadius: '8px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'box-shadow 0.3s ease',
                backgroundColor: '#fff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <div style={{ width: '100%', height: '200px', backgroundColor: '#f8f9fa', borderRadius: '4px', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', overflow: 'hidden' }}>
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  '[Imagen del Producto]'
                )}
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>{p.categoryName}</span>
                <h3 style={{ margin: '10px 0', fontSize: '1.2rem', color: '#333' }}>{p.name}</h3>
                <p style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#0056b3', margin: 0 }}>Bs. {Number(p.price).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '50px', color: '#888' }}>
          No se encontraron productos que coincidan con tu bsqueda.
        </div>
      )}
    </div>
  );
};
