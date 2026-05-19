import styles from './Input.module.css';

function Input({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  ...rest
}) {
  const inputClass = [styles.input, error ? styles.error : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={inputClass}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...rest}
      />
      {error && <span className={styles.errorMsg}>{error}</span>}
    </div>
  );
}

export default Input;
