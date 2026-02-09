package com.studyboosters.controller;

import com.studyboosters.dto.request.SubjectRequest;
import com.studyboosters.exception.UnauthorizedException;
import com.studyboosters.model.Subject;
import com.studyboosters.security.UserPrincipal;
import com.studyboosters.service.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectService subjectService;

    @GetMapping
    public ResponseEntity<List<Subject>> getAllSubjects() throws ExecutionException, InterruptedException {
        return ResponseEntity.ok(subjectService.getAllSubjects());
    }

    @PostMapping
    public ResponseEntity<Subject> addSubject(@RequestBody SubjectRequest request,
            @AuthenticationPrincipal UserPrincipal principal)
            throws ExecutionException, InterruptedException {
        if (!"Admin".equals(principal.getRole())) {
            throw new UnauthorizedException("Only admins can add subjects");
        }

        return ResponseEntity.ok(subjectService.addSubject(request.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSubject(@PathVariable String id,
            @AuthenticationPrincipal UserPrincipal principal)
            throws ExecutionException, InterruptedException {
        if (!"Admin".equals(principal.getRole())) {
            throw new UnauthorizedException("Only admins can delete subjects");
        }

        subjectService.deleteSubject(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Subject deleted successfully");
        return ResponseEntity.ok(response);
    }
}
