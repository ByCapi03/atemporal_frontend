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
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--atemporal-green)' }}>Catálogo de Productos</h1>
        <p style={{ color: 'var(--atemporal-muted)', fontSize: '1.1rem' }}>Encuentra las mejores prendas y accesorios</p>
      </header>

      {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>{error}</div>}

      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="form-input"
          style={{ minWidth: '250px', width: 'auto' }}
        />
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="form-select"
          style={{ minWidth: '200px', width: 'auto' }}
        >
          <option value="">Todas las categorías</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>Cargando productos...</div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(p => (
            <div
              key={p.id}
              className="product-card"
              onClick={() => navigate(`/products/${p.id}`)}
              style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div className="product-image-placeholder">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
                ) : (
                  '[Imagen del Producto]'
                )}
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--atemporal-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{p.categoryName}</span>
                <h3 className="product-name">{p.name}</h3>
                <p className="product-price">Bs. {Number(p.price).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '50px', color: '#888' }}>
          No se encontraron productos que coincidan con tu búsqueda.
        </div>
      )}
    </div>
  );
};
