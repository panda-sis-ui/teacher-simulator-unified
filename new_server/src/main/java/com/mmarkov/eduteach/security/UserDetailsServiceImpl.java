package com.mmarkov.eduteach.security;

import com.mmarkov.eduteach.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        return userRepository.findByLoginWithRole(login)
                .map(UserDetailsImpl::new)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Пользователь не найден: " + login
                ));
    }
}