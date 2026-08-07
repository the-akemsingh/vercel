import { BrandMark } from "./brand-mark";

export function Footer() {
  return (
    <footer className="site-footer">
      <a href="#top" className="brand" aria-label="Back to top">
        <BrandMark />
        <span>launchpad</span>
      </a>
      <p>Build boldly. Deploy quietly.</p>
      <p>© 2026 Launchpad</p>
    </footer>
  );
}
