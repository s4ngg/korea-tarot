package co.kr.tarot.domain.auth.service;

import co.kr.tarot.domain.auth.dto.EmailSendRequestDto;
import co.kr.tarot.domain.auth.dto.EmailVerifyRequestDto;
import co.kr.tarot.domain.auth.dto.LoginRequestDto;
import co.kr.tarot.domain.auth.dto.LoginResponseDto;
import co.kr.tarot.domain.auth.dto.SignupRequestDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {

    void signup(SignupRequestDto requestDto);

    void sendEmailVerification(EmailSendRequestDto requestDto);

    void verifyEmail(EmailVerifyRequestDto requestDto);

    LoginResponseDto login(LoginRequestDto requestDto, HttpServletResponse response);

    void logout(HttpServletRequest request, HttpServletResponse response);
}
