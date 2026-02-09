package com.studyboosters.service;

import com.studyboosters.exception.BadRequestException;
import com.studyboosters.model.StudyFile;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudyFileService {

    private final FirebaseService firebaseService;
    private final ActivityLogService activityLogService;
    private final SettingsService settingsService;

    public List<StudyFile> getAllFiles() throws ExecutionException, InterruptedException {
        return firebaseService.getList("files", StudyFile.class);
    }

    public List<StudyFile> getApprovedFiles() throws ExecutionException, InterruptedException {
        List<StudyFile> files = getAllFiles();
        return files.stream()
                .filter(f -> "Approved".equals(f.getStatus()))
                .collect(Collectors.toList());
    }

    public StudyFile getFileById(String id) throws ExecutionException, InterruptedException {
        return firebaseService.getById("files", id, StudyFile.class);
    }

    public StudyFile uploadFile(StudyFile file, String uploaderId, String uploaderRollNumber)
            throws ExecutionException, InterruptedException {

        // Set metadata
        file.setUploadDate(LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE));
        file.setDownloadCount(0);
        file.setUploaderId(uploaderId);
        file.setUploader(uploaderRollNumber);

        // Check if manual review is enabled
        boolean manualReview = settingsService.isManualReviewEnabled();
        file.setStatus(manualReview ? "Pending" : "Approved");

        // Save to Firebase
        String fileId = firebaseService.push("files", file);
        file.setId(fileId);

        activityLogService.addLog("Incoming Upload", uploaderRollNumber + " submitted \"" + file.getTitle() + "\"", 0);

        return file;
    }

    public void approveFile(String fileId) throws ExecutionException, InterruptedException {
        StudyFile file = getFileById(fileId);

        Map<String, Object> updates = new HashMap<>();
        updates.put("status", "Approved");
        firebaseService.update("files", fileId, updates);

        activityLogService.addLog("Resource Approved", "Admin verified \"" + file.getTitle() + "\"",
                file.getDownloadCount());
    }

    public void deleteFile(String fileId) throws ExecutionException, InterruptedException {
        StudyFile file = getFileById(fileId);
        firebaseService.delete("files", fileId);

        activityLogService.addLog("Resource Purged", "Asset \"" + file.getTitle() + "\" removed permanently",
                file.getDownloadCount());
    }

    public void incrementDownloadCount(String fileId, String userRollNumber)
            throws ExecutionException, InterruptedException {
        StudyFile file = getFileById(fileId);

        int newCount = (file.getDownloadCount() != null ? file.getDownloadCount() : 0) + 1;

        Map<String, Object> updates = new HashMap<>();
        updates.put("downloadCount", newCount);
        firebaseService.update("files", fileId, updates);

        activityLogService.addLog("Resource Accessed",
                "User " + userRollNumber + " downloaded \"" + file.getTitle() + "\"", newCount);
    }
}
