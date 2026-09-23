import { useState } from 'react';
import { ProductsSection } from '../components/ProductsSection';
import { VariantsSection } from '../components/VariantsSection';
import { AttributesSection } from '../components/AttributesSection';

export const ProductsAdminPage = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'variants' | 'attributes'>('products');

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <h1 className="page-title">Catálogo de Productos</h1>
        <p className="page-subtitle">Administra los productos, variantes y atributos disponibles</p>
      </div>

      <div className="tabs" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          className={activeTab === 'products' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setActiveTab('products')}
        >
          Productos
        </button>
        <button 
          className={activeTab === 'variants' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setActiveTab('variants')}
        >
          Variantes
        </button>
        <button 
          className={activeTab === 'attributes' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setActiveTab('attributes')}
        >
          Categorías / Tallas / Colores
        </button>
      </div>

      {activeTab === 'products' && <ProductsSection />}
      {activeTab === 'variants' && <VariantsSection />}
      {activeTab === 'attributes' && <AttributesSection />}
    </div>
  );
};
