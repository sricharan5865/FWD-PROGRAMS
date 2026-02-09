package com.studyboosters.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Settings {
    private Boolean manualReview;
    private String latestNews;
}
