package com.studyboosters.service;

import com.studyboosters.model.ActivityLog;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
@RequiredArgsConstructor
public class ActivityLogService {

    private final FirebaseService firebaseService;

    public void addLog(String action, String details) throws ExecutionException, InterruptedException {
        addLog(action, details, 0);
    }

    public void addLog(String action, String details, Integer downloads)
            throws ExecutionException, InterruptedException {
        try {
            ActivityLog log = new ActivityLog();
            log.setAction(action);
            log.setDetails(details != null ? details : "");
            log.setDownloads(downloads != null ? downloads : 0);
            log.setTimestamp(getCurrentTimestamp());

            firebaseService.push("logs", log);
        } catch (Exception e) {
            System.err.println("Failed to add log: " + e.getMessage());
        }
    }

    public List<ActivityLog> getAllLogs() throws ExecutionException, InterruptedException {
        return firebaseService.getList("logs", ActivityLog.class);
    }

    private String getCurrentTimestamp() {
        return LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }
}
