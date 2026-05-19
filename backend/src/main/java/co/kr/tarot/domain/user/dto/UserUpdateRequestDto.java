package co.kr.tarot.domain.user.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class UserUpdateRequestDto {

    @Size(min = 2, max = 20)
    private String nickname;

    @Size(min = 8)
    private String password;
}
