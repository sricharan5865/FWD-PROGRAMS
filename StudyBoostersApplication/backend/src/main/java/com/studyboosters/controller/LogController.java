package com.studyboosters.controller;

import com.studyboosters.exception.UnauthorizedException;
import com.studyboosters.model.ActivityLog;
import com.studyboosters.security.UserPrincipal;
import com.studyboosters.service.ActivityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class LogController {

    private final ActivityLogService activityLogService;

    @GetMapping
    public ResponseEntity<List<ActivityLog>> getAllLogs(@AuthenticationPrincipal UserPrincipal principal)
            throws ExecutionException, InterruptedException {
        if (!"Admin".equals(principal.getRole())) {
            throw new UnauthorizedException("Only admins can view logs");
        }

        return ResponseEntity.ok(activityLogService.getAllLogs());
    }
}
