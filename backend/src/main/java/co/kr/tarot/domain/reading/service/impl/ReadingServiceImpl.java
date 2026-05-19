package co.kr.tarot.domain.reading.service.impl;

import co.kr.tarot.domain.reading.dto.ReadingDetailResponseDto;
import co.kr.tarot.domain.reading.dto.ReadingListResponseDto;
import co.kr.tarot.domain.reading.entity.TarotReading;
import co.kr.tarot.domain.reading.repository.TarotReadingRepository;
import co.kr.tarot.domain.reading.service.ReadingService;
import co.kr.tarot.global.exception.BusinessException;
import co.kr.tarot.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReadingServiceImpl implements ReadingService {

    private static final Logger logger = LogManager.getLogger(ReadingServiceImpl.class);

    private final TarotReadingRepository tarotReadingRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ReadingListResponseDto> getMyReadings(Long userId) {
        return tarotReadingRepository.findAllByUserIdWithCards(userId).stream()
                .map(ReadingListResponseDto::new)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ReadingDetailResponseDto getReadingDetail(Long userId, Long readingId) {
        TarotReading reading = tarotReadingRepository.findByIdWithCards(readingId)
                .orElseThrow(() -> new BusinessException(ErrorCode.READING_NOT_FOUND));

        if (!reading.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.READING_ACCESS_DENIED);
        }

        return new ReadingDetailResponseDto(reading);
    }

    @Override
    @Transactional
    public void deleteReading(Long userId, Long readingId) {
        TarotReading reading = tarotReadingRepository.findById(readingId)
                .orElseThrow(() -> new BusinessException(ErrorCode.READING_NOT_FOUND));

        if (!reading.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.READING_ACCESS_DENIED);
        }

        tarotReadingRepository.delete(reading);
        logger.info("[READING] 상담 기록 삭제 완료 - userId: {}, readingId: {}", userId, readingId);
    }
}
