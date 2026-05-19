package co.kr.tarot.domain.tarot.dto;

import co.kr.tarot.domain.tarot.entity.TarotCard;
import lombok.Getter;

@Getter
public class TarotCardResponseDto {

    private final Long id;
    private final String name;
    private final String arcanaType;
    private final String imageUrl;

    public TarotCardResponseDto(TarotCard card) {
        this.id = card.getId();
        this.name = card.getName();
        this.arcanaType = card.getArcanaType();
        this.imageUrl = card.getImageUrl();
    }
}
