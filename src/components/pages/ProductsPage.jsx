import { useEffect, useState } from 'react';
import { supabase } from "../../supabaseClient";
import './ProductsPage.css';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    category: '',
    unit: '',
    status: 'in_stock'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase
        .from('products')
        .insert([form]);

      if (error) throw error;

      // Reset form after successful submission
      setForm({ name: '', category: '', unit: '', status: 'in_stock' });
      await fetchProducts(); // Refresh products list
    } catch (err) {
      setError(err.message);
      console.error('Error adding product:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="inventory-container">
      <h2 className="inventory-title">Product Inventory</h2>

      <form onSubmit={handleSubmit} className="inventory-form">
        <div className="input-group">
    <label htmlFor="productName">Product Name</label>
    <input
        id="productName"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Enter product name"
        className="inventory-input"
        required
    />
</div>
<div className="input-group">
    <label htmlFor="productCategory">Category</label>
    <input
        id="productCategory"
        name="category"
        value={form.category}
        onChange={handleChange}
        placeholder="Enter category"
        className="inventory-input"
        required
    />
</div>
<div className="input-group">
    <label htmlFor="productUnit">Unit</label>
    <input
        id="productUnit"
        name="unit"
        value={form.unit}
        onChange={handleChange}
        placeholder="Enter unit (e.g., kg, pieces)"
        className="inventory-input"
        required
    />
</div>
<div className="input-group">
    <label htmlFor="productStatus">Status</label>
    <select
        id="productStatus"
        name="status"
        value={form.status}
        onChange={handleChange}
        className="inventory-input"
    >
        <option value="in_stock">In Stock</option>
        <option value="out_of_stock">Out of Stock</option>
        <option value="low_stock">Low Stock</option>
    </select>
</div>

        <div className="button-container">
          <button 
            type="submit" 
            className="inventory-button"
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Product'}
          </button>
        </div>

        {error && (
          <div className="error-message">
            Error: {error}
          </div>
        )}
      </form>

      <ul className="product-list">
        {isLoading && products.length === 0 ? (
          <li className="loading-message">Loading products...</li>
        ) : products.length === 0 ? (
          <li className="empty-message">No products found</li>
        ) : (
          products.map((p) => (
            <li key={p.id || p.product_id} className="product-item">
              <span className="product-name">{p.name}</span> -&nbsp;
              <span className="product-category">{p.category}</span> -&nbsp;
              <span className="product-unit">{p.unit}</span> -&nbsp;
              <span className={`product-status status-${p.status}`}>
                {p.status.replace('_', ' ')}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
