import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h2 className="footer-logo">ShopSavvy</h2>
        <p className="footer-description">
          ShopSavvy is your go-to destination for stylish and affordable fashion. 
          We bring you hand-picked collections curated with quality and comfort in mind.
        </p>
        <p className="footer-tagline">
          Crafted with passion. Worn with confidence.
        </p>
        <p className="footer-bottom">
          &copy; {new Date().getFullYear()} ShopSavvy. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
