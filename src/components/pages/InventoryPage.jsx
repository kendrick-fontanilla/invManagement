import { useEffect, useState } from 'react';
import { supabase } from "../../supabaseClient";
import './InventoryPage.css';

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    product_id: '',
    quantity: '',
    location: '',
    status: 'in_stock'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInventory();
    fetchProducts();
  }, []);

  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('inventory')
        .select(`
          *,
          products (name, category, unit)
        `)
        .order('last_updated', { ascending: false });
      
      if (error) throw error;
      setInventory(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching inventory:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('product_id, name')
      .order('name', { ascending: true });
    setProducts(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('inventory')
        .insert([{
          ...form,
          quantity: Number(form.quantity),
          last_updated: new Date().toISOString()
        }]);
      
      if (error) throw error;
      
      setForm({ product_id: '', quantity: '', location: '', status: 'in_stock' });
      await fetchInventory();
    } catch (err) {
      setError(err.message);
      console.error('Error updating inventory:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="inventory-container">
      <h2 className="inventory-title">Inventory Management</h2>
      
      <form onSubmit={handleSubmit} className="inventory-form">
        <div className="form-group">
          <label htmlFor="product_id" className="form-label">Product</label>
          <select
            id="product_id"
            name="product_id"
            value={form.product_id}
            onChange={handleChange}
            className="inventory-input"
            required
          >
            <option value="">Select a product</option>
            {products.map(product => (
              <option key={product.product_id} value={product.product_id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="quantity" className="form-label">Quantity</label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            placeholder="Enter quantity"
            className="inventory-input"
            required
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="location" className="form-label">Location</label>
          <input
            id="location"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Enter location (e.g., A1-2B)"
            className="inventory-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="status" className="form-label">Status</label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            className="inventory-input"
          >
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="on_order">On Order</option>
          </select>
        </div>
        
        <button 
          type="submit" 
          className="inventory-button"
          disabled={isLoading}
        >
          {isLoading ? 'Updating...' : 'Update Inventory'}
        </button>
        
        {error && (
          <div className="error-message">
            Error: {error}
          </div>
        )}
      </form>

      <div className="inventory-list-container">
        <h3 className="list-title">Current Inventory</h3>
        
        {isLoading && inventory.length === 0 ? (
          <div className="loading-message">Loading inventory...</div>
        ) : inventory.length === 0 ? (
          <div className="empty-message">No inventory records found</div>
        ) : (
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Location</th>
                <th>Status</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.inventory_id} className="inventory-item">
                  <td>{item.products?.name}</td>
                  <td>{item.products?.category}</td>
                  <td>{item.quantity} {item.products?.unit}</td>
                  <td>{item.location}</td>
                  <td>
                    <span className={`status-badge status-${item.status}`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{new Date(item.last_updated).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}