import React from 'react';
import './Footer.css';
import { FaInstagram, FaFacebook, FaTwitter, FaEnvelope, FaPhone } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-header">
          <h3>Stay Connected with Farm Marketplace</h3>
        </div>

        <div className="footer-content">
          <div className="footer-section contact-info">
            <h4>Contact Information</h4>
            <p>App created by: <strong>Kavin</strong></p>
            <p className="contact-item">
              <FaPhone className="contact-icon" />
              <span>Phone: 6383768937</span>
            </p>
            <p className="contact-item">
              <FaEnvelope className="contact-icon" />
              <span>Email: kavinsuresh2005@gmail.com</span>
            </p>
          </div>

          <div className="footer-section follow-us">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaInstagram /> Instagram
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaFacebook /> Facebook
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaTwitter /> X (Twitter)
              </a>
            </div>
          </div>

          <div className="footer-section newsletter">
            <h4>Subscribe to Newsletter</h4>
            <p>Get updates on new products and offers</p>
            <form className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-btn">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Farm Marketplace. All rights reserved.</p>
          <p className="footer-tagline">Connecting farmers with buyers directly</p>
          <div className="footer-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/contact">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;