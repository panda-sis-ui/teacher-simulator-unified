package com.mmarkov.eduteach.service;

import com.mmarkov.eduteach.dto.auth.LoginRequest;
import com.mmarkov.eduteach.dto.auth.LoginResponse;
import com.mmarkov.eduteach.dto.auth.RegisterRequest;
import com.mmarkov.eduteach.entity.access.Role;
import com.mmarkov.eduteach.entity.access.User;
import com.mmarkov.eduteach.repository.RoleRepository;
import com.mmarkov.eduteach.repository.UserRepository;
import com.mmarkov.eduteach.security.JwtUtils;
import com.mmarkov.eduteach.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    // Роль по умолчанию для новых пользователей
    private static final String DEFAULT_ROLE = "Студент";

    @Transactional
    public LoginResponse register(RegisterRequest request) {
        if (userRepository.findByLogin(request.getLogin()).isPresent()) {
            throw new IllegalArgumentException(
                    "Пользователь с логином «" + request.getLogin() + "» уже существует"
            );
        }

        Role role = roleRepository.findByName(DEFAULT_ROLE)
                .orElseThrow(() -> new IllegalStateException(
                        "Роль «" + DEFAULT_ROLE + "» не найдена в базе данных"
                ));

        User user = User.builder()
                .login(request.getLogin())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        userRepository.save(user);

        String token = jwtUtils.generateToken(user.getLogin());

        return LoginResponse.builder()
                .token(token)
                .login(user.getLogin())
                .role(role.getName())
                .build();
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getLogin(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        String token = jwtUtils.generateToken(userDetails.getUsername());
        String role = userDetails.getAuthorities().iterator().next().getAuthority();

        return LoginResponse.builder()
                .token(token)
                .login(userDetails.getUsername())
                .role(role)
                .build();
    }
}