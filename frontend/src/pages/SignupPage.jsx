import { Link, useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const navigate = useNavigate();

  return (
    <main className='page fadeIn'>
      <section className='cardGlass authCard'>
        <h1 className='title'>회원가입</h1>
        <form className='formStack' onSubmit={(event) => {
          event.preventDefault();
          navigate('/login');
        }}>
          <input placeholder='이름' required />
          <input placeholder='이메일' type='email' required />
          <input placeholder='비밀번호' type='password' required />
          <button className='primaryButton' type='submit'>가입하기</button>
        </form>
        <p className='authFooter'>이미 계정이 있나요? <Link to='/login'>로그인</Link></p>
      </section>
    </main>
  );
}
