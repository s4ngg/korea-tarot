package co.kr.tarot.domain.user.service;

import co.kr.tarot.domain.user.dto.UserProfileResponseDto;
import co.kr.tarot.domain.user.dto.UserUpdateRequestDto;

public interface UserService {

    UserProfileResponseDto getMyProfile(Long userId);

    void updateMyProfile(Long userId, UserUpdateRequestDto requestDto);
}
