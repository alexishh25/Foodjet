package com.foodjet.backend.Model.Service;

import com.foodjet.backend.Model.Entity.Login;
import com.foodjet.backend.Model.Repository.LoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class LoginServiceImpl implements LoginService {

    private final LoginRepository loginRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public LoginServiceImpl(LoginRepository loginRepository, PasswordEncoder passwordEncoder) {
        this.loginRepository = loginRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Optional<Login> authenticate(String email, String password) {
        Optional<Login> userOpt = loginRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            Login user = userOpt.get();
            if (passwordEncoder.matches(password, user.getPassword()) || user.getPassword().equals(password)) {
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }

    @Override
    public Login register(Login newLogin) {
        if (newLogin.getRole() == null || newLogin.getRole().isEmpty()) {
            newLogin.setRole("customer");
        }
        if (newLogin.getEmail() == null || newLogin.getEmail().isEmpty()) {
            newLogin.setEmail("sin-email@foodjet.com");
        }
        if (newLogin.getPassword() != null && !newLogin.getPassword().isEmpty()) {
            newLogin.setPassword(passwordEncoder.encode(newLogin.getPassword()));
        }
        return loginRepository.save(newLogin);
    }

    @Override
    public List<Login> getAllLogins() {
        return loginRepository.findAll();
    }
}
