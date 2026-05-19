package co.kr.tarot.domain.tarot.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class AiInterpretRequestDto {

    @JsonProperty("concern_text")
    private String concernText;

    private List<String> cards;
}
