package com.appsports.backend.model.request;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String adminUser;
    private String adminPassword;
    private String accountEmail;
    private String accountNewPassword;
}
