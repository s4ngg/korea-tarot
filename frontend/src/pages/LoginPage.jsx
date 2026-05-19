import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { login } from '../api/authApi';
import useAuthStore from '../stores/authStore';
import Starfield from '../components/common/Starfield/Starfield';
import styles from './LoginPage.module.css';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      setAuth(res.data.data.accessToken);
      navigate(from, { replace: true });
    },
    onError: (err) => {
      setError(err.response?.data?.message || '이메일 또는 비밀번호가 올바르지 않습니다.');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    loginMutation.mutate(form);
  };

  return (
    <div className={styles.page}>
      <Starfield />
      <div className={styles.backdrop} />
      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.icon}>✦</span>
            <h1 className={styles.title}>로그인</h1>
            <p className={styles.subtitle}>우주의 지혜가 당신을 기다립니다</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
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
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button
              className={styles.submitBtn}
              type="submit"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className={styles.divider}>
            <span>또는</span>
          </div>

          <p className={styles.switchLink}>
            계정이 없으신가요?{' '}
            <Link to="/signup" className={styles.link}>회원가입</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
