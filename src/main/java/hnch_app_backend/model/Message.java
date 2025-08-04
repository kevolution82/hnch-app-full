package hnch_app_backend.model;

// this is the message model I'll use for storing the chat messages
// sender can be "user" or "ai", real users can't be used so we're going to simulate it
// userId links the message to a user

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    @Lob
    @Column(length = 2048)
    private String text;
    private String sender;
    private LocalDateTime timestamp;
    private String character;

    public String getCharacter() {
    return character;
    }

    public void setCharacter(String character) {
    this.character = character;
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