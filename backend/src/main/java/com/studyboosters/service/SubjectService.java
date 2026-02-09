package com.studyboosters.service;

import com.studyboosters.model.Subject;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
@RequiredArgsConstructor
public class SubjectService {

    private final FirebaseService firebaseService;
    private final ActivityLogService activityLogService;

    public List<Subject> getAllSubjects() throws ExecutionException, InterruptedException {
        return firebaseService.getList("subjects", Subject.class);
    }

    public Subject addSubject(String name) throws ExecutionException, InterruptedException {
        Subject subject = new Subject();
        subject.setName(name);

        String subjectId = firebaseService.push("subjects", subject);
        subject.setId(subjectId);

        activityLogService.addLog("Subject Created", "Admin added \"" + name + "\"");

        return subject;
    }

    public void deleteSubject(String id) throws ExecutionException, InterruptedException {
        firebaseService.delete("subjects", id);
        activityLogService.addLog("Subject Deleted", "Admin removed subject");
    }
}
