package com.studyboosters.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityLog {
    private String id;
    private String action;
    private String details;
    private Integer downloads;
    private String timestamp;
}
