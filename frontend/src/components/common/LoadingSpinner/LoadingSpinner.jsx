import styles from './LoadingSpinner.module.css';

function LoadingSpinner({ size = 'md' }) {
  const wrapperClass = [styles.wrapper, size !== 'md' ? styles[size] : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClass} role="status" aria-label="로딩 중">
      <div className={styles.spinner} />
    </div>
  );
}

export default LoadingSpinner;
