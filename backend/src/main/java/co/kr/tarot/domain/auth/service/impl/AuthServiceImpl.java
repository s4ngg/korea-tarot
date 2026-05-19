package co.kr.tarot.domain.auth.service.impl;

import co.kr.tarot.domain.auth.dto.EmailSendRequestDto;
import co.kr.tarot.domain.auth.dto.EmailVerifyRequestDto;
import co.kr.tarot.domain.auth.dto.LoginRequestDto;
import co.kr.tarot.domain.auth.dto.LoginResponseDto;
import co.kr.tarot.domain.auth.dto.SignupRequestDto;
import co.kr.tarot.domain.auth.service.AuthService;
import co.kr.tarot.domain.user.entity.User;
import co.kr.tarot.domain.user.repository.UserRepository;
import co.kr.tarot.global.exception.BusinessException;
import co.kr.tarot.global.exception.ErrorCode;
import co.kr.tarot.global.security.jwt.JwtProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.security.SecureRandom;
import java.time.Duration;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final Logger logger = LogManager.getLogger(AuthServiceImpl.class);
    private static final String EMAIL_VERIFY_PREFIX = "email:verify:";
    private static final String REFRESH_TOKEN_PREFIX = "refresh:";
    private static final long EMAIL_CODE_TTL = 5L;
    private static final long REFRESH_TOKEN_TTL_DAYS = 7L;

    private final UserRepository userRepository;
    private final StringRedisTemplate redisTemplate;
    private final JavaMailSender mailSender;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    @Override
    @Transactional
    public void signup(SignupRequestDto requestDto) {
        if (userRepository.existsByEmail(requestDto.getEmail())) {
            throw new BusinessException(ErrorCode.DUPLICATE_EMAIL);
        }

        String encodedPassword = passwordEncoder.encode(requestDto.getPassword());

        User user = User.builder()
                .email(requestDto.getEmail())
                .password(encodedPassword)
                .nickname(requestDto.getNickname())
                .build();

        userRepository.save(user);
        logger.info("[SIGNUP] 회원가입 성공 - email: {}", requestDto.getEmail());
    }

    @Override
    public void sendEmailVerification(EmailSendRequestDto requestDto) {
        String code = generateVerificationCode();
        String key = EMAIL_VERIFY_PREFIX + requestDto.getEmail();

        redisTemplate.opsForValue().set(key, code, EMAIL_CODE_TTL, TimeUnit.MINUTES);

        sendVerificationMail(requestDto.getEmail(), code);
        logger.info("[EMAIL] 인증 코드 발송 - email: {}", requestDto.getEmail());
    }

    @Override
    @Transactional
    public void verifyEmail(EmailVerifyRequestDto requestDto) {
        String key = EMAIL_VERIFY_PREFIX + requestDto.getEmail();
        String savedCode = redisTemplate.opsForValue().get(key);

        if (savedCode == null || !savedCode.equals(requestDto.getCode())) {
            throw new BusinessException(ErrorCode.INVALID_EMAIL_CODE);
        }

        User user = userRepository.findByEmail(requestDto.getEmail())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        user.verifyEmail();
        redisTemplate.delete(key);
        logger.info("[EMAIL] 인증 완료 - email: {}", requestDto.getEmail());
    }

    private String generateVerificationCode() {
        SecureRandom random = new SecureRandom();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }

    private void sendVerificationMail(String email, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("[AI Tarot] 이메일 인증 코드");
        message.setText(buildMailContent(code));
        mailSender.send(message);
    }

    private String buildMailContent(String code) {
        return "안녕하세요, AI Tarot입니다.\n\n"
                + "이메일 인증 코드: " + code + "\n\n"
                + "인증 코드는 5분간 유효합니다.";
    }

    @Override
    @Transactional(readOnly = true)
    public LoginResponseDto login(LoginRequestDto requestDto, HttpServletResponse response) {
        User user = userRepository.findByEmail(requestDto.getEmail())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (!user.isEmailVerified()) {
            throw new BusinessException(ErrorCode.EMAIL_NOT_VERIFIED);
        }

        if (!passwordEncoder.matches(requestDto.getPassword(), user.getPassword())) {
            throw new BusinessException(ErrorCode.INVALID_PASSWORD);
        }

        String accessToken = jwtProvider.generateAccessToken(user.getId(), user.getEmail());
        String refreshToken = jwtProvider.generateRefreshToken(user.getId());

        redisTemplate.opsForValue().set(
                REFRESH_TOKEN_PREFIX + user.getId(),
                refreshToken,
                REFRESH_TOKEN_TTL_DAYS,
                TimeUnit.DAYS
        );

        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .path("/")
                .maxAge(Duration.ofDays(REFRESH_TOKEN_TTL_DAYS))
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        logger.info("[LOGIN] 로그인 성공 - email: {}", requestDto.getEmail());
        return new LoginResponseDto(accessToken, "Bearer");
    }

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        String token = extractTokenFromRequest(request);
        if (StringUtils.hasText(token) && jwtProvider.validateToken(token)) {
            Long userId = jwtProvider.getUserId(token);
            redisTemplate.delete(REFRESH_TOKEN_PREFIX + userId);
        }

        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        logger.info("[LOGOUT] 로그아웃 처리 완료");
    }

    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");
        if (StringUtils.hasText(bearer) && bearer.startsWith("Bearer ")) {
            return bearer.substring(7);
        }
        return null;
    }
}
