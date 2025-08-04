package hnch_app_backend.model;

// this is the message model I'll use for storing the chat messages
// sender can be "user" or "ai", real users can't be used so we're going to simulate it
// userId links the message to a user

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // this links the message to a user
    private Long userId;
    @Lob
    // allows longer text for the message
    @Column(length = 2048)
    // this is the message content
    private String text;
    // shows who sent the message
    private String sender;
    // when the message was sent
    private LocalDateTime timestamp;
    // which character is used for the message
    private String characterName;

    public String getCharacterName() {
    return characterName;
    }

    public void setCharacterName(String characterName) {
    this.characterName = characterName;
    }

    public Message() {}

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}