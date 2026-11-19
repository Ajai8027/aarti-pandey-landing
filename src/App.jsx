import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Features from './components/Features.jsx';
import Approach from './components/Approach.jsx';
import About from './components/About.jsx';
import RegistrationForm from './components/RegistrationForm.jsx';
import Footer from './components/Footer.jsx';
import styles from './styles/App.module.css';

/** Root layout: skip link, semantic landmarks and page sections. */
export default function App() {
  return (
    <div className={styles.site}>
      <a className={styles.skipLink} href="#main-content">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className={styles.main}>
        <Hero />
        <Features />
        <Approach />
        <About />
        <RegistrationForm />
      </main>
      <Footer />
    </div>
  );
}
