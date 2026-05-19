package co.kr.tarot.domain.reading.repository;

import co.kr.tarot.domain.reading.entity.ReadingCard;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReadingCardRepository extends JpaRepository<ReadingCard, Long> {
}
