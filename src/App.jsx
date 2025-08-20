// main react entry point; handles routing, wallet state, and navigation
import { useState, useEffect } from 'react';
import { Link, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './components/WalletDisplay.css';
// import all screens to enable routing
import Home from './components/Home';
import About from './components/About';
import Hire from './components/Hire';
import Gigs from './components/Gigs';
import Login from './components/Login';
import SignUp from './components/SignUp';
import UserAccount from './components/UserAccount';
import NotFound from './components/404';

// creates the main app
function App() {
  // useState manages values that change during app usage
  const [menuOpen, setMenuOpen] = useState(false);
  const [myGoons, setMyGoons] = useState([]);
  // wallet starts at $100,000 and is capped at that amount
  const [wallet, setWallet] = useState(100000);
  const userName = 'Firstie Lastberg';
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // apiMessage stores messages from the backend
  const [apiMessage, setApiMessage] = useState('');
  useEffect(() => {
  }, []); // runs once when the app loads

  // requireauth redirects to login if user is not authenticated
  function RequireAuth({ children }) {
    const loggedInUser = localStorage.getItem('loggedInUser');
    return loggedInUser ? children : <Navigate to="/login" replace />;
  }

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // adds a goon to the crew if not already hired
  const handleHire = (goon) => {
    if (!myGoons.find(g => g.id === goon.id)) {
      setMyGoons([...myGoons, goon]);
    }
  };

  // removes a goon from the crew and refunds their cost
  const handleRemove = (id) => {
    const goonToRemove = myGoons.find(g => g.id === id);
    if (goonToRemove) {
      updateWallet(goonToRemove.paid ?? 0);
      setMyGoons(myGoons.filter(g => g.id !== id));
    }
  };

  // updatewallet changes the wallet amount and enforces the cap
  const updateWallet = (amount) => {
    setWallet(prev => {
      const updated = prev + amount;
      return updated > 100000 ? 100000 : updated;
    });
  };

  return (
    <div className={`page-wrapper ${isHomePage ? 'no-scroll' : ''}`}>

      {/* shows api message if present */}
      {apiMessage && (
        <div style={{ textAlign: 'center', color: 'lime', fontWeight: 'bold', marginTop: 10 }}>
          API: {apiMessage}
        </div>
      )}

      {/* shows wallet and avatar if user is logged in */}
      {localStorage.getItem('loggedInUser') && (() => {
        const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
        return (
          <div className="wallet-ui">
            {userProfile.avatar && (
              <img
                src={userProfile.avatar}
                alt="Avatar"
                className="wallet-avatar"
              />
            )}
            💸 <span className="wallet-amount">${wallet.toLocaleString()}</span>
          </div>
        );
      })()}
      <header>
        <nav className="navbar">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/hire">Hire</Link>
          <Link to="/gigs">Gigs</Link>
          <Link to="/login">Login</Link>
          <Link to="/account">Account</Link>
        </nav>

        {/* hamburger menu for mobile */}
        <div className="hamburger-wrapper">
          <button className="hamburger" onClick={toggleMenu}>
            ☰
          </button>
          {menuOpen && (
            <div className="mobile-menu">
              <Link to="/" onClick={toggleMenu}>Home</Link>
              <Link to="/about" onClick={toggleMenu}>About</Link>
              <Link to="/hire" onClick={toggleMenu}>Hire</Link>
              <Link to="/gigs" onClick={toggleMenu}>Gigs</Link>
              <Link to="/login" onClick={toggleMenu}>Login</Link>
              <Link to="/account" onClick={toggleMenu}>Account</Link>
            </div>
          )}
        </div>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          {/* wallet and updateWallet are passed to screens that need them */}
          <Route
            path="/hire"
            element={
              <Hire
                onHire={handleHire}
                updateWallet={updateWallet}
                wallet={wallet}
                myGoons={myGoons}
              />
            }
          />
          <Route path="/gigs" element={<Gigs userName={userName} />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/account"
            element={
              <RequireAuth>
                <UserAccount
                  userData={JSON.parse(sessionStorage.getItem('loggedInUser'))}
                  myGoons={myGoons}
                  onRemove={handleRemove}
                  updateWallet={updateWallet}
                  wallet={wallet}
                />
              </RequireAuth>
            }
          />
        </Routes>
        <div className="footer-placeholder" />
      </main>

      <footer className="footer">
        <p className="footer-content">
          © 2025 FAHGETABOUTIT CORP. ALL RIGHTS RESERVED.
          <span className="footer-separator"> | </span>
          <a href="https://7a4abc9e-108a-4598-bd49-16ea5fce6db4.usrfiles.com/ugd/7a4abc_43f266e8ec014d0cbbef79b090c1c3c5.pdf" className="footer-link">Privacy Policy</a>
        </p>
      </footer>
    </div>
  );
}
// app.jsx handles routing to all screens, including useraccount for backend requests
export default App;