import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);

  const submit = (event) => {
    event.preventDefault();
    login({ name: 'Mystic User', email }, 'demo-token');
    navigate(location.state?.from?.pathname || '/tarot', { replace: true });
  };

  return (
    <main className='page fadeIn'>
      <section className='cardGlass authCard'>
        <h1 className='title'>로그인</h1>
        <form className='formStack' onSubmit={submit}>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder='이메일'
            type='email'
            required
          />
          <input
            type='password'
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder='비밀번호'
            required
          />
          <button className='primaryButton' type='submit'>로그인</button>
        </form>
        <p className='authFooter'>계정이 없나요? <Link to='/signup'>회원가입</Link></p>
      </section>
    </main>
  );
}
