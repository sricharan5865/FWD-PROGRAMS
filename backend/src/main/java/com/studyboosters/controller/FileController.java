package com.studyboosters.controller;

import com.studyboosters.exception.UnauthorizedException;
import com.studyboosters.model.StudyFile;
import com.studyboosters.security.UserPrincipal;
import com.studyboosters.service.StudyFileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final StudyFileService fileService;

    @GetMapping
    public ResponseEntity<List<StudyFile>> getAllFiles(@AuthenticationPrincipal UserPrincipal principal)
            throws ExecutionException, InterruptedException {
        // Students only see approved files, admins see all
        if ("Admin".equals(principal.getRole())) {
            return ResponseEntity.ok(fileService.getAllFiles());
        } else {
            return ResponseEntity.ok(fileService.getApprovedFiles());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudyFile> getFileById(@PathVariable String id)
            throws ExecutionException, InterruptedException {
        return ResponseEntity.ok(fileService.getFileById(id));
    }

    @PostMapping("/upload")
    public ResponseEntity<StudyFile> uploadFile(@RequestBody StudyFile file,
            @AuthenticationPrincipal UserPrincipal principal)
            throws ExecutionException, InterruptedException {
        StudyFile uploadedFile = fileService.uploadFile(file, principal.getUserId(), principal.getRollNumber());
        return ResponseEntity.ok(uploadedFile);
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approveFile(@PathVariable String id,
            @AuthenticationPrincipal UserPrincipal principal)
            throws ExecutionException, InterruptedException {
        if (!"Admin".equals(principal.getRole())) {
            throw new UnauthorizedException("Only admins can approve files");
        }

        fileService.approveFile(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "File approved successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFile(@PathVariable String id,
            @AuthenticationPrincipal UserPrincipal principal)
            throws ExecutionException, InterruptedException {
        if (!"Admin".equals(principal.getRole())) {
            throw new UnauthorizedException("Only admins can delete files");
        }

        fileService.deleteFile(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "File deleted successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/download")
    public ResponseEntity<StudyFile> downloadFile(@PathVariable String id,
            @AuthenticationPrincipal UserPrincipal principal)
            throws ExecutionException, InterruptedException {
        fileService.incrementDownloadCount(id, principal.getRollNumber());
        StudyFile file = fileService.getFileById(id);
        return ResponseEntity.ok(file);
    }
}
