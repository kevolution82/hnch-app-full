package com.hnchapp.controller;

// user controller for handling sign up and login

import com.hnchapp.model.User;
import com.hnchapp.model.UserDTO;
import com.hnchapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Collections;

@CrossOrigin(origins = {"http://localhost:5173", "https://hnch-app-full-4.onrender.com", "https://hnch-app.netlify.app"})
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepo;

    // use BCrypt for password hashing
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // sign up a new user (hash password before saving)
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            if (userRepo.findByUsername(user.getUsername()) != null) {
                // if username already exists 
                return ResponseEntity.status(409).body(Collections.singletonMap("error", "Username already exists!"));
            }
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            User saved = userRepo.save(user);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Collections.singletonMap("error", "Registration failed!"));
        }
    }

    // backend checks if user exists and password matches on login (using BCrypt) 
@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody User login) {
    try {
        User user = userRepo.findByUsername(login.getUsername());
        if (user == null) {
            return ResponseEntity.status(401).body(Collections.singletonMap("error", "invalid credentials"));
        }
        if (!passwordEncoder.matches(login.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body(Collections.singletonMap("error", "invalid credentials"));
        }
        UserDTO safeUser = new UserDTO();
        safeUser.setId(user.getId());
        safeUser.setUsername(user.getUsername());
        safeUser.setEmail(user.getEmail());
        safeUser.setRole(user.getRole());
        safeUser.setFullName(user.getFullName());
        safeUser.setOrganization(user.getOrganization());
        safeUser.setAliases(user.getAliases());
        safeUser.setBirthdate(user.getBirthdate());
        return ResponseEntity.ok(safeUser);
    } catch (Exception e) {
        return ResponseEntity.status(401).body(Collections.singletonMap("error", "Internal server error"));
    }
}

// update user info (rehash password if changed)
    @PutMapping("/{username}")
    public ResponseEntity<?> updateUser(@PathVariable String username, @RequestBody User updatedUser) {
        User user = userRepo.findByUsername(username);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        user.setEmail(updatedUser.getEmail());
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }
        user.setRole(updatedUser.getRole());
        user.setFullName(updatedUser.getFullName());
        user.setOrganization(updatedUser.getOrganization());
        user.setAliases(updatedUser.getAliases());
        user.setBirthdate(updatedUser.getBirthdate());
        userRepo.save(user);
        return ResponseEntity.ok(user);
    }
}