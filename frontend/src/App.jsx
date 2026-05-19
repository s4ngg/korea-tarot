import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import TarotPage from './pages/TarotPage';
import TarotResultPage from './pages/TarotResultPage';
import MyPage from './pages/MyPage';
import ReadingListPage from './pages/ReadingListPage';
import ReadingDetailPage from './pages/ReadingDetailPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />

        <Route element={<PrivateRoute />}>
          <Route path='/tarot' element={<TarotPage />} />
          <Route path='/tarot/result' element={<TarotResultPage />} />
          <Route path='/tarot/result/:id' element={<TarotResultPage />} />
          <Route path='/mypage' element={<MyPage />} />
          <Route path='/readings' element={<ReadingListPage />} />
          <Route path='/readings/:id' element={<ReadingDetailPage />} />
          <Route path='/mypage/readings' element={<ReadingListPage />} />
          <Route path='/mypage/readings/:id' element={<ReadingDetailPage />} />
        </Route>

        <Route path='*' element={<HomePage />} />
      </Route>
    </Routes>
  );
}
