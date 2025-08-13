import React from 'react';
import './404.css';

function NotFound() {
  return (
    <div className="home-page">
      <div className="home-logo-wrapper">
        <img key={performance.now()} src="404-logo.png" alt="404 Not Found" className="main-logo" />
      </div>
    </div>
  );
}

export default NotFound;