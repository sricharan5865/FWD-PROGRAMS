package com.studyboosters.service;

import com.studyboosters.model.Settings;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
@RequiredArgsConstructor
public class SettingsService {

    private final FirebaseService firebaseService;
    private final ActivityLogService activityLogService;

    public Settings getSettings() throws ExecutionException, InterruptedException {
        Settings settings = firebaseService.getValue("settings", Settings.class);
        if (settings == null) {
            settings = new Settings(true, "");
        }
        return settings;
    }

    public boolean isManualReviewEnabled() throws ExecutionException, InterruptedException {
        Settings settings = getSettings();
        return settings.getManualReview() != null ? settings.getManualReview() : true;
    }

    public void updateSettings(Settings settings) throws ExecutionException, InterruptedException {
        firebaseService.setValue("settings", settings);
        activityLogService.addLog("Settings Update", "Admin updated system configuration");
    }

    public void toggleManualReview() throws ExecutionException, InterruptedException {
        Settings settings = getSettings();
        boolean newState = !settings.getManualReview();
        settings.setManualReview(newState);

        firebaseService.setValue("settings", settings);
        activityLogService.addLog("Mode Change", "Manual Review set to " + (newState ? "ON" : "OFF"));
    }
}
