package com.studyboosters.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudyFile {
    private String id;
    private String title;
    private String subject;
    private String semester;
    private String uploader;
    private String uploaderId;
    private String fileType; // PDF, DOC, PPT, ZIP, IMG
    private String fileSize;
    private String uploadDate;
    private Integer downloadCount;
    private String description;
    private String status; // Pending, Approved, Rejected
    private String fileBlobData; // Base64 encoded file data
    private List<String> fileChunks; // For large files split into chunks
}
