import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { verifyEmail } from '../api/authApi';
import Starfield from '../components/common/Starfield/Starfield';
import styles from './SignupVerifyPage.module.css';

function SignupVerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const verifyMutation = useMutation({
    mutationFn: verifyEmail,
    onSuccess: () => {
      navigate('/login', { state: { verified: true } });
    },
    onError: (err) => {
      setError(err.response?.data?.message || '인증 코드가 올바르지 않습니다.');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    verifyMutation.mutate({ email, code });
  };

  return (
    <div className={styles.page}>
      <Starfield />
      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.icon}>✦</span>
            <h1 className={styles.title}>이메일 인증</h1>
            <p className={styles.subtitle}>
              <strong className={styles.emailText}>{email || '이메일'}</strong>로 발송된<br />
              6자리 인증 코드를 입력해 주세요.
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="code">인증 코드</label>
              <div className={styles.inputWrap}>
                <input
                  id="code"
                  className={styles.codeInput}
                  type="text"
                  placeholder="000000"
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  maxLength={6}
                  autoComplete="one-time-code"
                  inputMode="numeric"
                />
              </div>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button
              className={styles.submitBtn}
              type="submit"
              disabled={verifyMutation.isPending || code.length < 6}
            >
              {verifyMutation.isPending ? '인증 중...' : '인증 완료'}
            </button>
          </form>

          <p className={styles.hint}>
            코드를 받지 못하셨나요?{' '}
            <button
              className={styles.resendBtn}
              type="button"
              onClick={() => navigate('/signup')}
            >
              다시 시도하기
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}

export default SignupVerifyPage;
