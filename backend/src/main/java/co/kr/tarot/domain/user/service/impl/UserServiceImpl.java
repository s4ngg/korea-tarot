package co.kr.tarot.domain.user.service.impl;

import co.kr.tarot.domain.user.dto.UserProfileResponseDto;
import co.kr.tarot.domain.user.dto.UserUpdateRequestDto;
import co.kr.tarot.domain.user.entity.User;
import co.kr.tarot.domain.user.repository.UserRepository;
import co.kr.tarot.domain.user.service.UserService;
import co.kr.tarot.global.exception.BusinessException;
import co.kr.tarot.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private static final Logger logger = LogManager.getLogger(UserServiceImpl.class);

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponseDto getMyProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        return new UserProfileResponseDto(user);
    }

    @Override
    @Transactional
    public void updateMyProfile(Long userId, UserUpdateRequestDto requestDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (StringUtils.hasText(requestDto.getNickname())) {
            user.updateNickname(requestDto.getNickname());
        }

        if (StringUtils.hasText(requestDto.getPassword())) {
            user.updatePassword(passwordEncoder.encode(requestDto.getPassword()));
        }

        logger.info("[USER] 정보 수정 완료 - userId: {}", userId);
    }
}
