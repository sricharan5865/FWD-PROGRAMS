package com.studyboosters.controller;

import com.studyboosters.dto.request.LoginRequest;
import com.studyboosters.security.UserPrincipal;
import com.studyboosters.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) throws ExecutionException, InterruptedException {
        return ResponseEntity.ok(authService.login(request.getRollNumber()));
    }

    @PostMapping("/promote-admin")
    public ResponseEntity<?> promoteToAdmin(@AuthenticationPrincipal UserPrincipal principal)
            throws ExecutionException, InterruptedException {
        return ResponseEntity.ok(authService.promoteToAdmin(principal.getUserId()));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(principal);
    }
}
