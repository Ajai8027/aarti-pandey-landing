import styles from '../styles/Features.module.css';

const services = [
  {
    number: '01',
    icon: '/assets/Icon_Strategy.svg',
    alt: 'Bar chart icon representing strategy',
    title: 'Strategy',
    description: 'Define priorities that connect to real goals.',
  },
  {
    number: '02',
    icon: '/assets/Icon_Operations.svg',
    alt: 'Connected nodes icon representing operations',
    title: 'Operations',
    description: 'Simplify recurring work with usable processes.',
  },
  {
    number: '03',
    icon: '/assets/Icon_Enablement.svg',
    alt: 'Check mark icon representing team enablement',
    title: 'Enablement',
    description: 'Equip teams to turn plans into action.',
  },
];

/** Services section (the "Features" component named in the technical spec). */
export default function Features() {
  return (
    <section id="services" data-testid="services" className={styles.services} aria-labelledby="services-title">
      <div className={styles.inner}>
        <header className={styles.heading}>
          <h2 id="services-title">What we help you improve</h2>
          <p>Three focused areas for stronger day-to-day business decisions.</p>
        </header>

        <ul className={styles.grid}>
          {services.map((service) => (
            <li key={service.number} className={styles.card} data-testid="service-card">
              <div className={styles.cardTop}>
                <img
                  className={styles.icon}
                  src={service.icon}
                  alt={service.alt}
                  width="160"
                  height="160"
                  loading="lazy"
                />
                <span className={styles.number} aria-hidden="true">
                  {service.number}
                </span>
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
