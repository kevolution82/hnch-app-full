package com.hnchapp.repository;

// this is the repository for saving and finding users
// it uses spring data jpa to make things easier

import com.hnchapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}