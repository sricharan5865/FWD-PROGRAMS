package com.studyboosters.service;

import com.studyboosters.model.User;
import com.studyboosters.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final FirebaseService firebaseService;
    private final JwtTokenProvider jwtTokenProvider;
    private final ActivityLogService activityLogService;

    public Map<String, Object> login(String rollNumber) throws ExecutionException, InterruptedException {
        // Check if user exists
        User user = getUserByRollNumber(rollNumber);

        if (user == null) {
            // Create new user
            user = createUser(rollNumber);
            activityLogService.addLog("System Access: " + rollNumber, "Role assigned: " + user.getRole());
        } else {
            // Update last login
            Map<String, Object> updates = new HashMap<>();
            updates.put("lastLogin", getCurrentTimestamp());
            firebaseService.update("users", user.getId(), updates);
            user.setLastLogin(getCurrentTimestamp());
            activityLogService.addLog("System Access: " + rollNumber, "User logged in");
        }

        // Generate JWT token
        String token = jwtTokenProvider.generateToken(user.getId(), user.getRollNumber(), user.getRole());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", user);

        return response;
    }

    public User promoteToAdmin(String userId) throws ExecutionException, InterruptedException {
        User user = firebaseService.getById("users", userId, User.class);

        Map<String, Object> updates = new HashMap<>();
        updates.put("role", "Admin");
        firebaseService.update("users", userId, updates);

        user.setRole("Admin");
        activityLogService.addLog("Privilege Escalation", "User " + user.getRollNumber() + " granted Admin control");

        return user;
    }

    private User getUserByRollNumber(String rollNumber) throws ExecutionException, InterruptedException {
        // Firebase doesn't support queries in the same way, so we fetch all and filter
        // In production, you might want to structure data differently or add indexes
        java.util.List<User> users = firebaseService.getList("users", User.class);
        return users.stream()
                .filter(u -> u.getRollNumber().equals(rollNumber))
                .findFirst()
                .orElse(null);
    }

    private User createUser(String rollNumber) throws ExecutionException, InterruptedException {
        String role = rollNumber.toUpperCase().contains("ADMIN") ? "Admin" : "Student";

        User user = new User();
        user.setRollNumber(rollNumber);
        user.setRole(role);
        user.setCreatedAt(getCurrentTimestamp());
        user.setLastLogin(getCurrentTimestamp());

        String userId = firebaseService.push("users", user);
        user.setId(userId);

        return user;
    }

    private String getCurrentTimestamp() {
        return LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }
}
