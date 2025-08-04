package hnch_app_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

// this is the main entry point for the spring boot app
// this starts the whole backend server

@SpringBootApplication
@EntityScan(basePackages = "hnch_app_backend.model")
public class AppApplication {
    public static void main(String[] args) {
        SpringApplication.run(AppApplication.class, args);
    }
}