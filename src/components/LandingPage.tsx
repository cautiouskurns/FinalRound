import React from 'react';
import styles from '../styles/LandingPage.module.css';
import Link from 'next/link';

const LandingPage: React.FC = () => {
  return (
    <div className={styles.landingPageWrapper}>
      <div className={styles.landingPage}>
        <div className={styles.content}>
          <header className={styles.header}>
            <h1>Welcome to FinalRound</h1>
            <p>Prepare for your technical interviews with our comprehensive platform.</p>
            <a href="#" className={styles.ctaButton}>Get Started</a>
          </header>

          <section className={`${styles.featureSection} ${styles.lightBg}`}>
            <h2>Practice Real Interview Questions</h2>
            <p>Access a vast library of interview questions from top tech companies.</p>
          </section>

          <section className={`${styles.featureSection} ${styles.darkBg}`}>
            <h2>Interactive Coding Challenges</h2>
            <p>Sharpen your skills with our interactive coding environment.</p>
          </section>

          <section className={`${styles.featureSection} ${styles.lightBg}`}>
            <h2>Personalized Learning Path</h2>
            <p>Get a customized study plan based on your strengths and weaknesses.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;