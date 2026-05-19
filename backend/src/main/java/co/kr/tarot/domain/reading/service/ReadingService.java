package co.kr.tarot.domain.reading.service;

import co.kr.tarot.domain.reading.dto.ReadingDetailResponseDto;
import co.kr.tarot.domain.reading.dto.ReadingListResponseDto;

import java.util.List;

public interface ReadingService {

    List<ReadingListResponseDto> getMyReadings(Long userId);

    ReadingDetailResponseDto getReadingDetail(Long userId, Long readingId);

    void deleteReading(Long userId, Long readingId);
}
