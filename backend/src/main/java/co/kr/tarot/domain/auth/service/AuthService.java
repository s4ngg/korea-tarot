package co.kr.tarot.domain.auth.service;

import co.kr.tarot.domain.auth.dto.EmailSendRequestDto;
import co.kr.tarot.domain.auth.dto.EmailVerifyRequestDto;
import co.kr.tarot.domain.auth.dto.SignupRequestDto;

public interface AuthService {

    void signup(SignupRequestDto requestDto);

    void sendEmailVerification(EmailSendRequestDto requestDto);

    void verifyEmail(EmailVerifyRequestDto requestDto);
}
