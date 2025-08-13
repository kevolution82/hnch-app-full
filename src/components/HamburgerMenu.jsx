import { useState } from 'react';
import { Link } from 'react-router-dom';
import './HamburgerMenu.css';

function HamburgerMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="hamburger-wrapper">
      <div className="hamburger-icon" onClick={() => setOpen(!open)}>
        ☰
      </div>
      {open && (
        <div className="menu-overlay">
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/about" onClick={() => setOpen(false)}>About</Link>
          <Link to="/hire" onClick={() => setOpen(false)}>Hire</Link>
          <Link to="/mygoons" onClick={() => setOpen(false)}>MyGoons</Link>
          <Link to="/gigs" onClick={() => setOpen(false)}>Gigs</Link>
          <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
        </div>
      )}
    </div>
  );
}

export default HamburgerMenu;
