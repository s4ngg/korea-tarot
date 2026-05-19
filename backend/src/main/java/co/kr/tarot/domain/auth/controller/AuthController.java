package co.kr.tarot.domain.auth.controller;

import co.kr.tarot.domain.auth.dto.EmailSendRequestDto;
import co.kr.tarot.domain.auth.dto.EmailVerifyRequestDto;
import co.kr.tarot.domain.auth.dto.SignupRequestDto;
import co.kr.tarot.domain.auth.service.AuthService;
import co.kr.tarot.global.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<Void>> signup(@Valid @RequestBody SignupRequestDto requestDto) {
        authService.signup(requestDto);
        return ResponseEntity.ok(ApiResponse.success("회원가입 성공"));
    }

    @PostMapping("/email/send")
    public ResponseEntity<ApiResponse<Void>> sendEmail(@Valid @RequestBody EmailSendRequestDto requestDto) {
        authService.sendEmailVerification(requestDto);
        return ResponseEntity.ok(ApiResponse.success("인증 코드 발송 완료"));
    }

    @PostMapping("/email/verify")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(@Valid @RequestBody EmailVerifyRequestDto requestDto) {
        authService.verifyEmail(requestDto);
        return ResponseEntity.ok(ApiResponse.success("이메일 인증 완료"));
    }
}
