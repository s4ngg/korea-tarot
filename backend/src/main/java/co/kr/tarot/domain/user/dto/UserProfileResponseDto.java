package co.kr.tarot.domain.user.dto;

import co.kr.tarot.domain.user.entity.User;
import lombok.Getter;

@Getter
public class UserProfileResponseDto {

    private final String email;
    private final String nickname;

    public UserProfileResponseDto(User user) {
        this.email = user.getEmail();
        this.nickname = user.getNickname();
    }
}
