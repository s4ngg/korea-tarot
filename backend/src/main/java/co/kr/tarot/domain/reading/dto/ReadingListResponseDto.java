package co.kr.tarot.domain.reading.dto;

import co.kr.tarot.domain.reading.entity.TarotReading;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class ReadingListResponseDto {

    private final Long id;
    private final String concernText;
    private final LocalDateTime createdAt;
    private final List<String> cards;

    public ReadingListResponseDto(TarotReading reading) {
        this.id = reading.getId();
        this.concernText = reading.getConcernText();
        this.createdAt = reading.getCreatedAt();
        this.cards = reading.getReadingCards().stream()
                .sorted((a, b) -> Integer.compare(a.getCardOrder(), b.getCardOrder()))
                .map(rc -> rc.getCard().getName())
                .toList();
    }
}
