import React from "react";
import { Link } from "react-router-dom";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-links">
        <Link to="/">Home</Link>
        <Link to="/discover">Discover</Link>
        <a href="/landing.html">Marketing</a>
        <a href="/contact.html">Contact</a>
        <a href="/privacy-policy.html">Privacy</a>
        <a href="/terms.html">Terms</a>
      </div>
      <p className="site-footer-legal">&copy; 2026 V&amp;S Ventures LLC. All rights reserved.</p>
    </footer>
  );
}

