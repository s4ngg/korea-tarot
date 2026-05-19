package co.kr.tarot.domain.user.controller;

import co.kr.tarot.domain.user.dto.UserProfileResponseDto;
import co.kr.tarot.domain.user.dto.UserUpdateRequestDto;
import co.kr.tarot.domain.user.service.UserService;
import co.kr.tarot.global.response.ApiResponse;
import co.kr.tarot.global.security.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponseDto>> getMyProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        UserProfileResponseDto profile = userService.getMyProfile(userDetails.getUserId());
        return ResponseEntity.ok(ApiResponse.success("조회 성공", profile));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<Void>> updateMyProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody UserUpdateRequestDto requestDto) {
        userService.updateMyProfile(userDetails.getUserId(), requestDto);
        return ResponseEntity.ok(ApiResponse.success("수정 완료"));
    }
}
