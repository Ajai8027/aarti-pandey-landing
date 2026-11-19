import styles from '../styles/Hero.module.css';

/** Hero: headline, calls to action, and the supplied growth-overview illustration. */
export default function Hero() {
  return (
    <section id="hero" className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.content}>
          <p className={styles.eyebrow}>OPERATIONS / STRATEGY / GROWTH</p>
          <h1 id="hero-title" className={styles.title}>
            Build clarity.
            <br className={styles.titleBreak} />
            Move forward.
          </h1>
          <p className={styles.lead}>
            Practical business systems, focused execution, and a clearer path from planning to progress.
          </p>
          <div className={styles.actions}>
            <a className={styles.primaryCta} href="#register">
              Join the briefing
            </a>
            <a className={styles.secondaryCta} href="#services">
              Explore services <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>

        <div className={styles.visual}>
          <img
            src="./assets/AartiPandey_Hero_Illustration.svg"
            alt="Illustrated growth overview dashboard with Strategy, Systems and Clarity panels, rising chart bars, and a completed check mark"
            width="820"
            height="650"
          />
        </div>
      </div>
    </section>
  );
}
