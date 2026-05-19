import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header/Header';
import PrivateRoute from './components/PrivateRoute';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SignupVerifyPage from './pages/SignupVerifyPage';
import TarotPage from './pages/TarotPage';
import TarotResultPage from './pages/TarotResultPage';
import MyPage from './pages/MyPage';
import ReadingListPage from './pages/ReadingListPage';
import ReadingDetailPage from './pages/ReadingDetailPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signup/verify" element={<SignupVerifyPage />} />
        <Route
          path="/tarot"
          element={
            <PrivateRoute>
              <TarotPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/tarot/result"
          element={
            <PrivateRoute>
              <TarotResultPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/mypage"
          element={
            <PrivateRoute>
              <MyPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/mypage/readings"
          element={
            <PrivateRoute>
              <ReadingListPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/mypage/readings/:id"
          element={
            <PrivateRoute>
              <ReadingDetailPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
