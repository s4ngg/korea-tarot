package co.kr.tarot.domain.tarot.service.impl;

import co.kr.tarot.domain.reading.entity.ReadingCard;
import co.kr.tarot.domain.reading.entity.TarotReading;
import co.kr.tarot.domain.reading.repository.TarotReadingRepository;
import co.kr.tarot.domain.tarot.dto.AiInterpretRequestDto;
import co.kr.tarot.domain.tarot.dto.AiInterpretResponseDto;
import co.kr.tarot.domain.tarot.dto.TarotCardResponseDto;
import co.kr.tarot.domain.tarot.dto.TarotReadingRequestDto;
import co.kr.tarot.domain.tarot.dto.TarotReadingResponseDto;
import co.kr.tarot.domain.tarot.entity.TarotCard;
import co.kr.tarot.domain.tarot.repository.TarotCardRepository;
import co.kr.tarot.domain.tarot.service.TarotService;
import co.kr.tarot.domain.user.entity.User;
import co.kr.tarot.domain.user.repository.UserRepository;
import co.kr.tarot.global.exception.BusinessException;
import co.kr.tarot.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class TarotServiceImpl implements TarotService {

    private static final Logger logger = LogManager.getLogger(TarotServiceImpl.class);

    private final TarotCardRepository tarotCardRepository;
    private final TarotReadingRepository tarotReadingRepository;
    private final UserRepository userRepository;
    private final RestClient aiRestClient;

    @Override
    @Transactional(readOnly = true)
    public List<TarotCardResponseDto> getAllCards() {
        return tarotCardRepository.findAll().stream()
                .map(TarotCardResponseDto::new)
                .toList();
    }

    @Override
    @Transactional
    public TarotReadingResponseDto createReading(Long userId, TarotReadingRequestDto requestDto) {
        if (requestDto.getCardIds().size() != 3) {
            throw new BusinessException(ErrorCode.INVALID_CARD_COUNT);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        Map<Long, TarotCard> cardMap = tarotCardRepository.findAllByIdIn(requestDto.getCardIds())
                .stream()
                .collect(Collectors.toMap(TarotCard::getId, Function.identity()));

        for (Long cardId : requestDto.getCardIds()) {
            if (!cardMap.containsKey(cardId)) {
                throw new BusinessException(ErrorCode.CARD_NOT_FOUND);
            }
        }

        List<String> cardNames = requestDto.getCardIds().stream()
                .map(id -> cardMap.get(id).getName())
                .toList();

        String interpretation = callAiServer(requestDto.getConcernText(), cardNames);

        TarotReading reading = TarotReading.builder()
                .user(user)
                .concernText(requestDto.getConcernText())
                .interpretation(interpretation)
                .build();

        IntStream.range(0, requestDto.getCardIds().size()).forEach(i -> {
            TarotCard card = cardMap.get(requestDto.getCardIds().get(i));
            ReadingCard readingCard = ReadingCard.builder()
                    .reading(reading)
                    .card(card)
                    .cardOrder(i + 1)
                    .build();
            reading.addReadingCard(readingCard);
        });

        TarotReading saved = tarotReadingRepository.save(reading);
        logger.info("[READING] 타로 상담 생성 완료 - userId: {}, readingId: {}", userId, saved.getId());

        return new TarotReadingResponseDto(saved.getId(), interpretation);
    }

    private String callAiServer(String concernText, List<String> cardNames) {
        try {
            AiInterpretRequestDto requestDto = new AiInterpretRequestDto(concernText, cardNames);
            AiInterpretResponseDto response = aiRestClient.post()
                    .uri("/api/interpret")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestDto)
                    .retrieve()
                    .body(AiInterpretResponseDto.class);

            if (response == null || response.getInterpretation() == null) {
                throw new BusinessException(ErrorCode.AI_SERVER_ERROR);
            }
            return response.getInterpretation();
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            logger.error("[AI] AI 서버 호출 실패: {}", e.getMessage());
            throw new BusinessException(ErrorCode.AI_SERVER_ERROR);
        }
    }
}
