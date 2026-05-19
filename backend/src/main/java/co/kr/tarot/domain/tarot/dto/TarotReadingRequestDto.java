package co.kr.tarot.domain.tarot.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Getter;

import java.util.List;

@Getter
public class TarotReadingRequestDto {

    @NotBlank
    private String concernText;

    @NotEmpty
    @Size(min = 3, max = 3, message = "카드는 3장을 선택해야 합니다.")
    private List<Long> cardIds;
}
