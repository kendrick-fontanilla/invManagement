import { useEffect, useState } from 'react';
import { supabase } from "../../supabaseClient";
import './WarehousesPage.css'; 


export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState([]);
  const [form, setForm] = useState({ name: '', location: '' });
  const [message, setMessage] = useState('');


  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    const { data, error } = await supabase.from('warehouses').select('*');
    if (error) {
      setMessage('Error fetching warehouses');
    } else {
      setWarehouses(data);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('warehouses').insert([form]);
    if (error) {
      setMessage('Error adding warehouse');
    } else {
      setMessage('Warehouse added successfully!');
      setForm({ name: '', location: '' });
      fetchWarehouses(); 
    }
  };


  return (
    <div className="warehouses-page p-4">
      <h2 className="header">Warehouses</h2>
      {message && <div className="notification">{message}</div>}
      <form onSubmit={handleSubmit} className="warehouse-form space-y-4 mb-6">
        {['name', 'location'].map((field) => (
          <input
            key={field}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            className="input-field"
            required
          />
        ))}
        <button type="submit" className="submit-button">Add Warehouse</button>
      </form>
      <ul className="warehouse-list">
        {warehouses.map((w) => (
          <li key={w.warehouse_id} className="warehouse-item">
            {w.name} – {w.location}
          </li>
        ))}
      </ul>
    </div>
  );
}