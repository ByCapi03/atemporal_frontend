import { Link } from 'react-router-dom';
import '../styles/store.css';

export const Navbar = () => {
  return (
    <nav className="store-navbar">
      <div className="store-navbar-logo">
        <Link to="/">BOUTIQUE ELEGANCE</Link>
      </div>
      <div className="store-navbar-links">
        <Link to="/">Inicio</Link>
        <Link to="/catalog">Catlogo</Link>
        <Link to="/reservations">Mis Reservas</Link>
        <Link to="/cart">Carrito</Link>
        <Link to="/login">Mi Cuenta</Link>
      </div>
    </nav>
  );
};
