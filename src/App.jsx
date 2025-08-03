import { useState, useEffect } from 'react';
import { Link, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './components/WalletDisplay.css';
import Home from './components/Home';
import About from './components/About';
import Hire from './components/Hire';
import Gigs from './components/Gigs';
import Login from './components/Login';
import SignUp from './components/SignUp';
import UserAccount from './components/UserAccount';
import NotFound from './components/404';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [myGoons, setMyGoons] = useState([]);
  // Wallet starts with $100,000 to give the user enough money to spend, but not enough to hire everyone.
  // Forces strategic decisions instead of just buying the whole kittenkaboodle. They have to choose wisely........
  const [wallet, setWallet] = useState(100000); // 💸 Starting moolah
  const userName = 'Firstie Lastberg';
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // API connection to fetch a message from the server
  const [apiMessage, setApiMessage] = useState('');
  useEffect(() => {
    fetch('http://localhost:3000/api/hello')
      .then(res => res.json())
      .then(data => setApiMessage(data.message))
      // .catch(err => console.error(err));
  }, []);

function RequireAuth({ children }) {
  const loggedInUser = localStorage.getItem('loggedInUser');
  return loggedInUser ? children : <Navigate to="/login" replace />;
}

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Adds a goon to your crew if they aren't already hired
  // Also works with the wallet logic to deduct the fee
const handleHire = (goon) => {
  if (!myGoons.find(g => g.id === goon.id)) {
    setMyGoons([...myGoons, goon]);
  }
};

  // Removes a goon from your crew and refunds their cost
  // Makes sure the player gets their money back if they change their mind
const handleRemove = (id) => {
  const goonToRemove = myGoons.find(g => g.id === id);
  if (goonToRemove) {
    updateWallet(goonToRemove.paid ?? 0);
    setMyGoons(myGoons.filter(g => g.id !== id));
  }
};

const updateWallet = (amount) => {
  setWallet(prev => {
    const updated = prev + amount;
    return updated > 100000 ? 100000 : updated;
  });
};

  return (
    <div className={`page-wrapper ${isHomePage ? 'no-scroll' : ''}`}>

      {/* API test output */}
      {apiMessage && (
        <div style={{ textAlign: 'center', color: 'lime', fontWeight: 'bold', marginTop: 10 }}>
          API: {apiMessage}
        </div>
      )}

      {/* this shows the wallet and a smaller circular version of their avatar */}
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

      {/* This is the hamburger menu for mobile users */}
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

export default App;