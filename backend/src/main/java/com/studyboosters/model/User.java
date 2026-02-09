package com.studyboosters.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private String id;
    private String rollNumber;
    private String role; // Student, Admin, Mentor
    private String createdAt;
    private String lastLogin;
}
