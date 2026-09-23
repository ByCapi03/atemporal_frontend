import { useState, useEffect } from 'react';
import { api } from '../../../api/axios';

interface Product {
  id: number;
  name: string;
  price: number;
  active: boolean;
  categoryId: number;
  imageUrl?: string;
  category?: { name: string };
}

export const ProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);
  
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ id: 0, name: '', price: '', categoryId: 0, active: true });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories')
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching data', err);
      setError('No se pudo conectar con el servidor');
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Formato de imagen no permitido');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo no debe superar los 5MB');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (productId: number, file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    await api.post(`/products/${productId}/image`, formData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        price: parseFloat(form.price),
        categoryId: Number(form.categoryId),
        active: form.active
      };
      
      let productId = form.id;
      if (productId) {
        await api.patch(`/products/${productId}`, payload);
      } else {
        const res = await api.post('/products', payload);
        productId = res.data.id;
      }

      if (selectedFile && productId) {
        try {
          await uploadImage(productId, selectedFile);
        } catch (imgErr: any) {
          alert('El producto se guard pero hubo un error al subir la imagen: ' + (imgErr.response?.data?.message || imgErr.message));
        }
      }

      resetForm();
      fetchData();
    } catch (err: any) {
      alert('Error guardando producto: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ id: 0, name: '', price: '', categoryId: 0, active: true });
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowForm(false);
  };

  const handleEdit = (p: Product) => {
    setForm({ id: p.id, name: p.name, price: String(p.price), categoryId: p.categoryId, active: p.active });
    setSelectedFile(null);
    setPreviewUrl(p.imageUrl || null);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Eliminar producto?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchData();
    } catch (err: any) {
      alert('Error eliminando: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="crud-card">
      <div className="crud-header">
        <h2>Productos</h2>
        <button className="btn-primary" onClick={() => { showForm ? resetForm() : setShowForm(true) }}>
          {showForm ? 'Cancelar' : '+ Nuevo Producto'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="crud-form" style={{ marginBottom: '20px' }}>
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre</label>
              <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Precio</label>
              <input type="number" step="0.01" required value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Categora</label>
              <select required value={form.categoryId} onChange={e => setForm({...form, categoryId: Number(e.target.value)})}>
                <option value="">Seleccione...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Imagen (Opcional, max 5MB)</label>
              <input type="file" accept="image/jpeg, image/png, image/webp" onChange={handleFileChange} />
              {previewUrl && (
                <div style={{ marginTop: '10px' }}>
                  <img src={previewUrl} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                </div>
              )}
            </div>
            <div className="form-group checkbox" style={{ gridColumn: '1 / -1' }}>
              <input type="checkbox" checked={form.active} onChange={e => setForm({...form, active: e.target.checked})} />
              <label>Activo</label>
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : (form.id ? 'Guardar' : 'Crear')}
          </button>
        </form>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Categora</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                ) : (
                  <div style={{ width: '40px', height: '40px', backgroundColor: '#eee', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#999' }}>N/A</div>
                )}
              </td>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>Bs. {p.price}</td>
              <td>{p.category?.name}</td>
              <td><span className={p.active ? 'badge-active' : 'badge-inactive'}>{p.active ? 'Activo' : 'Inactivo'}</span></td>
              <td>
                <div className="crud-actions" style={{ gap: '5px' }}>
                  <button className="btn-secondary" style={{ padding: '2px 8px', fontSize: '12px' }} onClick={() => handleEdit(p)}>Editar</button>
                  <button className="btn-danger" style={{ padding: '2px 8px', fontSize: '12px' }} onClick={() => handleDelete(p.id)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
          {products.length === 0 && !error && <tr><td colSpan={7}>No hay productos</td></tr>}
          {error && <tr><td colSpan={7} style={{ color: 'red', textAlign: 'center' }}>{error}</td></tr>}
        </tbody>
      </table>
    </div>
  );
};
