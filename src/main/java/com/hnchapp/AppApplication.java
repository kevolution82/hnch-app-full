package com.hnchapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

// main entry point for the Spring Boot application
@SpringBootApplication
@EntityScan(basePackages = "com.hnchapp.model")

public class AppApplication {
    public static void main(String[] args) {
        SpringApplication.run(AppApplication.class, args);        
    }
}

