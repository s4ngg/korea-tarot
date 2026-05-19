import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyProfile, updateMyProfile } from '../api/authApi';
import { getReadings } from '../api/readingApi';
import Starfield from '../components/common/Starfield/Starfield';
import styles from './MyPage.module.css';

function MyPage() {
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(false);
  const [nickname, setNickname] = useState('');
  const [editError, setEditError] = useState('');

  const { data: profileRes } = useQuery({
    queryKey: ['my-profile'],
    queryFn: getMyProfile,
  });

  const { data: readingsRes } = useQuery({
    queryKey: ['readings'],
    queryFn: getReadings,
  });

  const profile = profileRes?.data?.data;
  const readings = readingsRes?.data?.data || [];
  const recentReadings = readings.slice(0, 3);

  const updateMutation = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
      setEditMode(false);
      setEditError('');
    },
    onError: (err) => {
      setEditError(err.response?.data?.message || '수정 중 오류가 발생했습니다.');
    },
  });

  const startEdit = () => {
    setNickname(profile?.nickname || '');
    setEditError('');
    setEditMode(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updateMutation.mutate({ nickname });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getFullYear()}년 ${String(d.getMonth() + 1).padStart(2, '0')}월 ${String(d.getDate()).padStart(2, '0')}일`;
  };

  return (
    <div className={styles.page}>
      <Starfield />
      <div className={styles.starfield} />

      <main className={styles.main}>
        {/* Profile header */}
        <section className={styles.profileSection}>
          <div className={styles.avatarWrap}>
            <div className={styles.avatar}>
              <span className={styles.avatarIcon}>✦</span>
            </div>
            <div className={styles.avatarBadge}>✦</div>
          </div>

          <div className={styles.profileInfo}>
            {editMode ? (
              <form className={styles.editForm} onSubmit={handleUpdate}>
                <input
                  className={styles.editInput}
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                  placeholder="닉네임"
                  required
                  autoFocus
                />
                {editError && <p className={styles.editError}>{editError}</p>}
                <div className={styles.editActions}>
                  <button type="submit" className={styles.saveBtn} disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? '저장 중...' : '저장'}
                  </button>
                  <button type="button" className={styles.cancelBtn} onClick={() => setEditMode(false)}>
                    취소
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h1 className={styles.nickname}>{profile?.nickname || '...'}</h1>
                <p className={styles.email}>{profile?.email || ''}</p>
                <button className={styles.editBtn} onClick={startEdit}>닉네임 수정</button>
              </>
            )}
          </div>
        </section>

        {/* Reading history */}
        <section className={styles.historySection}>
          <div className={styles.historyHeader}>
            <h2 className={styles.historyTitle}>
              📖 나의 상담 기록
            </h2>
            <Link to="/mypage/readings" className={styles.viewAllBtn}>
              전체 보기 →
            </Link>
          </div>

          <div className={styles.readingList}>
            {recentReadings.length === 0 ? (
              <div className={styles.empty}>
                <p>아직 상담 기록이 없습니다.</p>
                <Link to="/tarot" className={styles.startBtn}>상담 시작하기</Link>
              </div>
            ) : (
              recentReadings.map((reading) => {
                const sortedCards = [...(reading.cards || [])].sort((a, b) => a.cardOrder - b.cardOrder);
                return (
                  <div key={reading.id} className={styles.readingCard}>
                    <div className={styles.leftBar} />
                    <div className={styles.readingContent}>
                      <div className={styles.readingMeta}>
                        <span className={styles.readingDate}>{formatDate(reading.createdAt)}</span>
                        <h3 className={styles.readingConcern}>{reading.concernText}</h3>
                        <div className={styles.cardMinis}>
                          {sortedCards.map((card, i) => (
                            <div key={i} className={styles.cardMini} title={card.nameKr || card.name}>
                              <span className={styles.cardMiniIcon}>✦</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Link to={`/mypage/readings/${reading.id}`} className={styles.detailBtn}>
                        자세히 보기
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Quote section */}
        <section className={styles.quoteSection}>
          <div className={styles.quoteCard}>
            <span className={styles.quoteIcon}>✦</span>
            <p className={styles.quoteText}>"별들은 결코 거짓을 말하지 않습니다. 당신의 운명은 이미 빛나고 있어요."</p>
            <div className={styles.quoteDivider} />
          </div>
        </section>
      </main>
    </div>
  );
}

export default MyPage;
