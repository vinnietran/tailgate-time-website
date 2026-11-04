import { Link } from "react-router-dom";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/discover">Discover</Link>
        {["pricing", "features", "customers"].map(page => <Link key={page} to={`/${page}`}>{page[0].toUpperCase() + page.slice(1)}</Link>)}
          <a href="/contact.html">Contact &amp; Support</a>
        <Link to="/vs/gatherly">vs Gatherly</Link><Link to="/vs/eventbrite">vs Eventbrite</Link>
        <a href="/privacy-policy.html">Privacy</a>
        <a href="/terms.html">Terms</a>
      </div>
      <p className="site-footer-legal">&copy; 2026 TailgateTime. All rights reserved.</p>
    </footer>
  );
}
