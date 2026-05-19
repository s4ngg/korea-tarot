package co.kr.tarot.domain.tarot.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TarotReadingResponseDto {

    private Long readingId;
    private String interpretation;
}
