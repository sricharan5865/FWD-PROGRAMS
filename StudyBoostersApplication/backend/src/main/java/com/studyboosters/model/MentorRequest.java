package com.studyboosters.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MentorRequest {
    private String id;
    private String rollNumber;
    private String expertise;
    private String year;
    private String status; // Pending, Approved, Rejected
    private String timestamp;
}
