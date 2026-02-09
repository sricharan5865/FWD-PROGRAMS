package com.studyboosters.controller;

import com.studyboosters.exception.UnauthorizedException;
import com.studyboosters.model.Settings;
import com.studyboosters.security.UserPrincipal;
import com.studyboosters.service.SettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SettingsController {

    private final SettingsService settingsService;

    @GetMapping
    public ResponseEntity<Settings> getSettings() throws ExecutionException, InterruptedException {
        return ResponseEntity.ok(settingsService.getSettings());
    }

    @PutMapping
    public ResponseEntity<?> updateSettings(@RequestBody Settings settings,
            @AuthenticationPrincipal UserPrincipal principal)
            throws ExecutionException, InterruptedException {
        if (!"Admin".equals(principal.getRole())) {
            throw new UnauthorizedException("Only admins can update settings");
        }

        settingsService.updateSettings(settings);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Settings updated successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/toggle-manual-review")
    public ResponseEntity<?> toggleManualReview(@AuthenticationPrincipal UserPrincipal principal)
            throws ExecutionException, InterruptedException {
        if (!"Admin".equals(principal.getRole())) {
            throw new UnauthorizedException("Only admins can toggle manual review");
        }

        settingsService.toggleManualReview();

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Manual review toggled successfully");
        response.put("settings", settingsService.getSettings());
        return ResponseEntity.ok(response);
    }
}
