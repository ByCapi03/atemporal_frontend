import '../styles/store.css';

export const Footer = () => {
  return (
    <footer className="store-footer">
      <div className="store-footer-content">
        <div className="store-footer-logo">BOUTIQUE ELEGANCE</div>
        <div className="store-footer-links">
          <a href="#">Trminos y Condiciones</a>
          <a href="#">Poltica de Privacidad</a>
          <a href="#">Contacto</a>
        </div>
      </div>
      <p className="store-footer-copyright">&copy; 2026 BOUTIQUE ELEGANCE. Todos los derechos reservados.</p>
    </footer>
  );
};
