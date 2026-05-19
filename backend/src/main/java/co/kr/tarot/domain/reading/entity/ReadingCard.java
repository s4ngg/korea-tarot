package co.kr.tarot.domain.reading.entity;

import co.kr.tarot.domain.tarot.entity.TarotCard;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reading_cards")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
public class ReadingCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reading_id", nullable = false)
    private TarotReading reading;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "card_id", nullable = false)
    private TarotCard card;

    @Column(nullable = false)
    private int cardOrder;
}
