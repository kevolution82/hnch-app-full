// React core and styling for the Home screen
import React from 'react';
import './Home.css';

// Displays the centered logo on the home page
function Home() {
  return (
    <div className="home-page">
      <div className="home-logo-wrapper">
        <img src="/main-logo.png" alt="Main Logo" className="main-logo" />
      </div>
    </div>
  );
}

// Export for use in routes or parent components
export default Home;
