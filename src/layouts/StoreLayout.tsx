import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const StoreLayout = () => {
  return (
    <div className="store-layout">
      <Navbar />
      <main style={{ minHeight: '80vh', padding: '20px' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
