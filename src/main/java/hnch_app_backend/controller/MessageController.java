package hnch_app_backend.controller;

// this is the message controller for sending and getting messages
// it uses the message repository to save and find messages
// ai replies are simple for now, can be replaced with a real (in character) bot later

import hnch_app_backend.model.Message;
import hnch_app_backend.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageRepository messageRepo;

    // send a message and get ai reply
    @PostMapping
    public List<Message> sendMessage(@RequestBody Message msg) {
        msg.setSender("user");
        msg.setTimestamp(LocalDateTime.now());
        messageRepo.save(msg);

        // simple ai reply
        Message aiReply = new Message();
        aiReply.setUserId(msg.getUserId());
        aiReply.setText("Big Sal says: " + msg.getText());
        aiReply.setSender("Big Sal");
        aiReply.setTimestamp(LocalDateTime.now());
        messageRepo.save(aiReply);

        // return all messages for this user
        return messageRepo.findByUserId(msg.getUserId());
    }

    // get all messages for a user
    @GetMapping("/{userId}")
    public List<Message> getMessages(@PathVariable Long userId) {
        return messageRepo.findByUserId(userId);
    }
}