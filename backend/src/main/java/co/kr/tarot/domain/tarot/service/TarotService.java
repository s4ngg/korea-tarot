package co.kr.tarot.domain.tarot.service;

import co.kr.tarot.domain.tarot.dto.TarotCardResponseDto;
import co.kr.tarot.domain.tarot.dto.TarotReadingRequestDto;
import co.kr.tarot.domain.tarot.dto.TarotReadingResponseDto;

import java.util.List;

public interface TarotService {

    List<TarotCardResponseDto> getAllCards();

    TarotReadingResponseDto createReading(Long userId, TarotReadingRequestDto requestDto);
}
