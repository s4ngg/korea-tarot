package co.kr.tarot.domain.auth.controller;

import co.kr.tarot.domain.auth.dto.EmailSendRequestDto;
import co.kr.tarot.domain.auth.dto.EmailVerifyRequestDto;
import co.kr.tarot.domain.auth.dto.LoginRequestDto;
import co.kr.tarot.domain.auth.dto.LoginResponseDto;
import co.kr.tarot.domain.auth.dto.SignupRequestDto;
import co.kr.tarot.domain.auth.service.AuthService;
import co.kr.tarot.global.response.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponseDto>> login(
            @Valid @RequestBody LoginRequestDto requestDto,
            HttpServletResponse response) {
        LoginResponseDto loginResponse = authService.login(requestDto, response);
        return ResponseEntity.ok(ApiResponse.success("로그인 성공", loginResponse));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            HttpServletRequest request,
            HttpServletResponse response) {
        authService.logout(request, response);
        return ResponseEntity.ok(ApiResponse.success("로그아웃 완료"));
    }
}
