package com.hnchapp.controller;

// user controller for handling sign up and login

import com.hnchapp.model.User;
import com.hnchapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
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

    // backend checks if user exists and password matches on login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User login) {
        User user = userRepo.findByUsername(login.getUsername());
        if (user != null && user.getPassword().equals(login.getPassword())) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(401).body("invalid credentials"); // sends error if login fails
    }

    @PutMapping("/{username}")
    public ResponseEntity<?> updateUser(@PathVariable String username, @RequestBody User updatedUser) {
        User user = userRepo.findByUsername(username);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        // only update fields that exist in your user entity
        user.setEmail(updatedUser.getEmail());
        user.setPassword(updatedUser.getPassword());
        user.setRole(updatedUser.getRole());
        userRepo.save(user);
        return ResponseEntity.ok(user);
    }
    
}