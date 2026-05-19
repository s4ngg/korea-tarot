package co.kr.tarot.domain.reading.controller;

import co.kr.tarot.domain.reading.dto.ReadingDetailResponseDto;
import co.kr.tarot.domain.reading.dto.ReadingListResponseDto;
import co.kr.tarot.domain.reading.service.ReadingService;
import co.kr.tarot.global.response.ApiResponse;
import co.kr.tarot.global.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/readings")
@RequiredArgsConstructor
public class ReadingController {

    private final ReadingService readingService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ReadingListResponseDto>>> getMyReadings(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<ReadingListResponseDto> readings = readingService.getMyReadings(userDetails.getUserId());
        return ResponseEntity.ok(ApiResponse.success("상담 기록 조회 성공", readings));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ReadingDetailResponseDto>> getReadingDetail(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id) {
        ReadingDetailResponseDto detail = readingService.getReadingDetail(userDetails.getUserId(), id);
        return ResponseEntity.ok(ApiResponse.success("상담 기록 상세 조회 성공", detail));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReading(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id) {
        readingService.deleteReading(userDetails.getUserId(), id);
        return ResponseEntity.ok(ApiResponse.success("삭제 완료"));
    }
}
