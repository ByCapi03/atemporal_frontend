import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/axios';
import atemporalLogo from '../../assets/ATEMPORAL.png';
import '../../styles/store.css';

interface Product {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  categoryName: string;
  imageUrl: string | null;
}

export const HomePage = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/store/products');
        setFeaturedProducts(data.slice(0, 3));
      } catch (err) {
        console.error("Error fetching products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img 
            src={atemporalLogo} 
            alt="ATEMPORAL - Moda que trasciende épocas" 
            style={{ maxWidth: '280px', width: '100%', height: 'auto', objectFit: 'contain', marginBottom: '20px', borderRadius: '12px' }} 
          />
          <span className="hero-subtitle">NUEVA COLECCIÓN</span>
          <h1 className="hero-title">Moda que trasciende épocas</h1>

          <p className="hero-text">Descubre nuestra nueva colección diseñada para resaltar tu estilo en cualquier ocasión.</p>
          <button
            className="btn-secondary"
            onClick={() => navigate('/catalog')}
            style={{ marginTop: '10px' }}
          >
            Ver Catálogo
          </button>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="featured-section">
        <div className="section-header">
          <h2 className="section-title">Productos Destacados</h2>
          <div className="section-divider"></div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Cargando productos...</div>
        ) : (
          <div className="products-grid">
            {featuredProducts.map(p => (
              <div key={p.id} className="product-card">
                <div
                  className="product-image-placeholder"
                  onClick={() => navigate(`/products/${p.id}`)}
                  style={{ padding: p.imageUrl ? 0 : undefined, overflow: 'hidden' }}
                >
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    '[Foto]'
                  )}
                </div>
                <h3 className="product-name">{p.name}</h3>
                <p className="product-price">Bs. {Number(p.price).toFixed(2)}</p>
                <button
                  className="btn-outline"
                  onClick={() => navigate(`/products/${p.id}`)}
                >
                  Ver
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
