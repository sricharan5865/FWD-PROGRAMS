package com.studyboosters.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Doubt {
    private String id;
    private String studentName;
    private String subject;
    private String question;
    private String status; // Pending, Answered
    private String timestamp;
}
