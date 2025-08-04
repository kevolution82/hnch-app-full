package hnch_app_backend.repository;

// this is the repository for saving and finding the messages
// it uses spring data jpa to make things easier

import hnch_app_backend.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    @Query("SELECT m FROM Message m WHERE m.userId = :userId AND LOWER(m.characterName) = LOWER(:characterName)")
    List<Message> findByUserIdAndCharacterName(@Param("userId") Long userId, @Param("characterName") String characterName);
}
