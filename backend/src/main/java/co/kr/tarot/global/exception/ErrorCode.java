package co.kr.tarot.global.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // Common
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "잘못된 입력값입니다."),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버 오류가 발생했습니다."),

    // Auth
    DUPLICATE_EMAIL(HttpStatus.CONFLICT, "이미 사용 중인 이메일입니다."),
    INVALID_EMAIL_CODE(HttpStatus.BAD_REQUEST, "유효하지 않은 인증 코드입니다."),
    EMAIL_NOT_VERIFIED(HttpStatus.FORBIDDEN, "이메일 인증이 필요합니다."),
    INVALID_PASSWORD(HttpStatus.UNAUTHORIZED, "비밀번호가 일치하지 않습니다."),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰입니다."),
    EXPIRED_TOKEN(HttpStatus.UNAUTHORIZED, "만료된 토큰입니다."),

    // User
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."),

    // Tarot
    CARD_NOT_FOUND(HttpStatus.NOT_FOUND, "카드를 찾을 수 없습니다."),
    INVALID_CARD_COUNT(HttpStatus.BAD_REQUEST, "카드는 3장을 선택해야 합니다."),

    // Reading
    READING_NOT_FOUND(HttpStatus.NOT_FOUND, "상담 기록을 찾을 수 없습니다."),
    READING_ACCESS_DENIED(HttpStatus.FORBIDDEN, "본인의 상담 기록만 접근할 수 있습니다."),

    // AI Server
    AI_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "AI 서버 오류가 발생했습니다.");

    private final HttpStatus status;
    private final String message;
}
