package com.foodjet.backend.Model.Service;

import com.foodjet.backend.Model.Entity.Login;
import java.util.List;
import java.util.Optional;

public interface LoginService {
    Optional<Login> authenticate(String email, String password);
    Login register(Login newLogin);
    List<Login> getAllLogins();
}
