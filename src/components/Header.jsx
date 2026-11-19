import { useEffect, useState } from 'react';
import styles from '../styles/Header.module.css';

const navigation = [
  { label: 'Services', href: '#services' },
  { label: 'Approach', href: '#approach' },
  { label: 'About', href: '#about' },
  { label: 'Register', href: '#register', cta: true },
];

/** Site header with a disclosure menu on narrow viewports. */
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu when the viewport grows back to the desktop layout.
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)');
    const handleChange = (event) => {
      if (event.matches) setMenuOpen(false);
    };
    desktop.addEventListener('change', handleChange);
    return () => desktop.removeEventListener('change', handleChange);
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') setMenuOpen(false);
  };

  return (
    <header className={styles.header} data-testid="site-header" onKeyDown={handleKeyDown}>
      <div className={styles.inner}>
        <a className={styles.brand} href="#main-content" aria-label="Aarti Pandey Business Studio, skip to main content">
          <img
            className={styles.logo}
            src="/assets/AartiPandey_Logo.svg"
            alt="Aarti Pandey / Business Studio"
            width="420"
            height="110"
          />
        </a>

        <button
          className={styles.menuButton}
          data-testid="menu-button"
          type="button"
          aria-controls="primary-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className={styles.menuBar} aria-hidden="true" />
          <span className={styles.menuBar} aria-hidden="true" />
          <span className={styles.menuBar} aria-hidden="true" />
        </button>

        <nav
          id="primary-navigation"
          data-testid="primary-nav"
          className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}
          aria-label="Primary navigation"
        >
          {navigation.map(({ label, href, cta }) => (
            <a
              key={href}
              className={cta ? styles.registerLink : styles.navLink}
              href={href}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
