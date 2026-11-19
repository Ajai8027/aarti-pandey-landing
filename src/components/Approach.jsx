import styles from '../styles/Approach.module.css';

const steps = [
  {
    number: '01',
    title: 'Understand',
    description: 'Identify the current process and the key decision points.',
  },
  {
    number: '02',
    title: 'Prioritize',
    description: 'Choose improvements with practical, measurable value.',
  },
  {
    number: '03',
    title: 'Implement',
    description: 'Turn decisions into actions teams can maintain.',
  },
];

/** Three-step approach section required by the content guide. */
export default function Approach() {
  return (
    <section id="approach" data-testid="approach" className={styles.approach} aria-labelledby="approach-title">
      <div className={styles.inner}>
        <header className={styles.heading}>
          <h2 id="approach-title">How we approach progress</h2>
          <p>A simple sequence that keeps each decision practical and easy to act on.</p>
        </header>

        <ol className={styles.steps}>
          {steps.map((step) => (
            <li key={step.number} className={styles.step}>
              <span className={styles.number} aria-hidden="true">
                {step.number}
              </span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
