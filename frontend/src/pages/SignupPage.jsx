import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { signup } from '../api/authApi';
import Starfield from '../components/common/Starfield/Starfield';
import styles from './SignupPage.module.css';

function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nickname: '', email: '', password: '' });
  const [error, setError] = useState('');

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      navigate('/signup/verify', { state: { email: form.email } });
    },
    onError: (err) => {
      setError(err.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    signupMutation.mutate(form);
  };

  return (
    <div className={styles.page}>
      <Starfield />
      <div className={styles.blob1} />
      <div className={styles.blob2} />

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h1 className={styles.title}>회원가입</h1>
            <p className={styles.subtitle}>당신의 영적 여정을 위한 첫 걸음을 내디뎌 보세요.</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="nickname">닉네임</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>👤</span>
                <input
                  id="nickname"
                  className={styles.input}
                  type="text"
                  placeholder="사용할 이름을 입력하세요"
                  value={form.nickname}
                  onChange={e => setForm(f => ({ ...f, nickname: e.target.value }))}
                  required
                  autoComplete="nickname"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">이메일</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>✉</span>
                <input
                  id="email"
                  className={styles.input}
                  type="email"
                  placeholder="example@aetheris.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="password">비밀번호</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>🔒</span>
                <input
                  id="password"
                  className={styles.input}
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  autoComplete="new-password"
                  minLength={8}
                />
              </div>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button
              className={styles.submitBtn}
              type="submit"
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending ? '처리 중...' : '회원가입 완료 ✦'}
            </button>
          </form>

          <p className={styles.switchLink}>
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className={styles.link}>로그인</Link>
          </p>
        </div>

        <div className={styles.decorCard} aria-hidden="true" />
      </main>
    </div>
  );
}

export default SignupPage;
