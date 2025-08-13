package com.hnchapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
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
    private String characterName;
    private String audio;

    public String getCharacterName() {
    return characterName;
    }

    public String getAudio() {
    return audio;
    }

    public void setAudio(String audio) {
    this.audio = audio;
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