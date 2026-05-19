package co.kr.tarot.domain.reading.dto;

import co.kr.tarot.domain.reading.entity.ReadingCard;
import co.kr.tarot.domain.reading.entity.TarotReading;
import co.kr.tarot.domain.tarot.dto.TarotCardResponseDto;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class ReadingDetailResponseDto {

    private final Long id;
    private final String concernText;
    private final String interpretation;
    private final LocalDateTime createdAt;
    private final List<TarotCardResponseDto> cards;

    public ReadingDetailResponseDto(TarotReading reading) {
        this.id = reading.getId();
        this.concernText = reading.getConcernText();
        this.interpretation = reading.getInterpretation();
        this.createdAt = reading.getCreatedAt();
        this.cards = reading.getReadingCards().stream()
                .sorted((a, b) -> Integer.compare(a.getCardOrder(), b.getCardOrder()))
                .map(ReadingCard::getCard)
                .map(TarotCardResponseDto::new)
                .toList();
    }
}
