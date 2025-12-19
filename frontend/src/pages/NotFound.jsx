import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="farmfresh-banner">
        <h1 className="farmfresh-title">FarmFresh</h1>
        <p className="banner-subtitle">Stay Connected with Farm Marketplace</p>
      </div>

      <div className="block404">
        <div className="waves"></div>
        <div className="obj">
          <img src="https://imgur.com/w0Yb4MX.png" alt="404 object" />
        </div>
        <div className="t404"></div>

        <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
          <defs>
            <filter id="glitch">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.01 0.03"
                numOctaves="1"
                result="warp"
                id="turb"
              />
              <feColorMatrix
                in="warp"
                result="huedturb"
                type="hueRotate"
                values="90"
              >
                <animate
                  attributeType="XML"
                  attributeName="values"
                  values="0;180;360"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </feColorMatrix>
              <feDisplacementMap
                xChannelSelector="R"
                yChannelSelector="G"
                scale="50"
                in="SourceGraphic"
                in2="huedturb"
              />
            </filter>
          </defs>
        </svg>

        <div className="error-content">
          <h2 className="page-not-found">Page Not Found</h2>
          <p className="error-description">
            The page you're looking for doesn't exist.
          </p>
          <Link to="/" className="go-home-btn">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;