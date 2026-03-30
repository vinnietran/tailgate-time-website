import { Link } from "react-router-dom";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-links">
        <Link to="/">Home</Link>
        <Link to="/release-2-0">Release 2.0</Link>
        <Link to="/discover">Discover</Link>
        <a href="/contact.html">Contact &amp; Support</a>
        <a href="/privacy-policy.html">Privacy</a>
        <a href="/terms.html">Terms</a>
      </div>
      <p className="site-footer-legal">&copy; 2026 TailgateTime. All rights reserved.</p>
    </footer>
  );
}
