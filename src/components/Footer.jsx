import styles from '../styles/Footer.module.css';

/** Site footer with in-page links, an example contact address, and legal copy. */
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandBlock}>
          <p className={styles.brand}>
            AARTI PANDEY <span aria-hidden="true">/</span> BUSINESS STUDIO
          </p>
          <p className={styles.tagline}>Business guidance with practical next steps.</p>
        </div>

        <nav className={styles.links} aria-label="Footer navigation">
          <a href="#services">Services</a>
          <a href="#register">Briefing</a>
          <a href="mailto:hello@example.org">Contact</a>
        </nav>

        <p className={styles.legal}>© 2026 Aarti Pandey Studio. All rights reserved.</p>
      </div>
    </footer>
  );
}
