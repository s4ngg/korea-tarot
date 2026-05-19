package co.kr.tarot.domain.reading.repository;

import co.kr.tarot.domain.reading.entity.TarotReading;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TarotReadingRepository extends JpaRepository<TarotReading, Long> {

    @Query("SELECT r FROM TarotReading r JOIN FETCH r.readingCards rc JOIN FETCH rc.card WHERE r.user.id = :userId ORDER BY r.createdAt DESC")
    List<TarotReading> findAllByUserIdWithCards(@Param("userId") Long userId);

    @Query("SELECT r FROM TarotReading r JOIN FETCH r.readingCards rc JOIN FETCH rc.card WHERE r.id = :id")
    Optional<TarotReading> findByIdWithCards(@Param("id") Long id);
}
