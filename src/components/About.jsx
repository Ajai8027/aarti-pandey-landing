import styles from '../styles/About.module.css';

/** Short "about" band required by the content guide. */
export default function About() {
  return (
    <section id="about" className={styles.about} aria-labelledby="about-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.heading}>
          <span className={styles.accent} aria-hidden="true" />
          <h2 id="about-title">Work designed for practical teams</h2>
        </div>
        <p className={styles.body}>
          Business Studio focuses on clear communication, useful workflows, and accessible business guidance for small
          teams building sustainable operations.
        </p>
      </div>
    </section>
  );
}
