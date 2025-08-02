import React from 'react';
// import the same css as the home screen so it matches
import './404.css';

// this is the not found 404 page component
function NotFound() {
  return (
    // use the same main container as the home page
    <div className="home-page">
      <div className="home-logo-wrapper">
        {/* show the 404 image in the center of the page */}
        <img key={performance.now()} src="404-logo.png" alt="404 Not Found" className="main-logo" />
      </div>
    </div>
  );
}

// export the component so it can be used in the router
export default NotFound;