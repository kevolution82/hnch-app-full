package hnch_app_backend.repository;

// this is the repository for saving and finding the messages
// it uses spring data jpa to make things easier

import hnch_app_backend.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByUserIdAndCharacterName(Long userId, String characterName);
}
