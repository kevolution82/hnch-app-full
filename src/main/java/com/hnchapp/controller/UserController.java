package com.hnchapp.controller;

// this is the user controller for handling sign up and login
// it uses the user repository to save and find users

import com.hnchapp.model.User;
import com.hnchapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepo;

    // sign up a new user
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userRepo.save(user);
    }

    // login with username and password
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User login) {
        User user = userRepo.findByUsername(login.getUsername());
        if (user != null && user.getPassword().equals(login.getPassword())) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(401).body("invalid credentials");
    }
}