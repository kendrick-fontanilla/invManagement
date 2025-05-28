import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import ProductsPage from './components/pages/ProductsPage';
import WarehousesPage from './components/pages/WarehousesPage';
import InventoryPage from './components/pages/InventoryPage';
import './App.css'; 

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <aside className="sidebar">
          <nav className="nav-links">
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              end
            >
              Products
            </NavLink>
            <NavLink 
              to="/warehouses" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              Warehouses
            </NavLink>
            <NavLink 
              to="/inventory" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              Inventory
            </NavLink>
            <a 
              href="https://sales-phi-kohl.vercel.app" 
              className="nav-link button-link" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Sales and Customer Management
            </a>
          </nav>
        </aside>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<ProductsPage />} />
            <Route path="/warehouses" element={<WarehousesPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;