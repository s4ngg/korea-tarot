package co.kr.tarot.domain.tarot.controller;

import co.kr.tarot.domain.tarot.dto.TarotCardResponseDto;
import co.kr.tarot.domain.tarot.dto.TarotReadingRequestDto;
import co.kr.tarot.domain.tarot.dto.TarotReadingResponseDto;
import co.kr.tarot.domain.tarot.service.TarotService;
import co.kr.tarot.global.response.ApiResponse;
import co.kr.tarot.global.security.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tarot")
@RequiredArgsConstructor
public class TarotController {

    private final TarotService tarotService;

    @GetMapping("/cards")
    public ResponseEntity<ApiResponse<List<TarotCardResponseDto>>> getAllCards() {
        List<TarotCardResponseDto> cards = tarotService.getAllCards();
        return ResponseEntity.ok(ApiResponse.success("카드 목록 조회 성공", cards));
    }

    @PostMapping("/reading")
    public ResponseEntity<ApiResponse<TarotReadingResponseDto>> createReading(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody TarotReadingRequestDto requestDto) {
        TarotReadingResponseDto result = tarotService.createReading(userDetails.getUserId(), requestDto);
        return ResponseEntity.ok(ApiResponse.success("타로 상담 완료", result));
    }
}
