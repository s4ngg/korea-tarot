import { Link } from 'react-router-dom';
import styles from './MainPage.module.css';

function MainPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>당신의 운명을 읽다</h1>
        <p className={styles.subtitle}>
          AI 타로 상담으로 고민에 대한 통찰을 얻으세요
        </p>
        <Link to="/tarot" className={styles.ctaBtn}>
          상담 시작하기
        </Link>
      </section>
    </main>
  );
}

export default MainPage;
