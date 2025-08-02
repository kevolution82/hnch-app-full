package hnch_app_backend.controller;

// this is the message controller for sending and getting messages
// it uses the message repository to save and find messages
// now it will get ai replies from the gemini server

import hnch_app_backend.model.Message;
import hnch_app_backend.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;
import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageRepository messageRepo;

    // send a message and get ai reply from gemini
    @PostMapping
    public List<Message> sendMessage(@RequestBody Message msg) {
        msg.setSender("user");
        msg.setTimestamp(LocalDateTime.now());
        messageRepo.save(msg);

        // talk to the gemini ai server for a reply
        String userMessage = msg.getText();
        String geminiApiUrl = "http://localhost:4000/api/gemini-chat";
        String aiReplyText = "sorry, i got nothin' right now.";

        try {
            RestTemplate restTemplate = new RestTemplate();
            Map<String, String> request = new HashMap<>();
            request.put("message", userMessage);

            ResponseEntity<Map> response = restTemplate.postForEntity(geminiApiUrl, request, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Object replyObj = response.getBody().get("reply");
                if (replyObj != null) {
                    aiReplyText = replyObj.toString();
                }
            }
        } catch (Exception e) {
            // log the error if needed
            System.out.println("could not get ai reply: " + e.getMessage());
        }

        Message aiReply = new Message();
        aiReply.setUserId(msg.getUserId());
        aiReply.setText(aiReplyText);
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

    // update a message
    @PutMapping("/{id}")
    public Message updateMessage(@PathVariable Long id, @RequestBody Message updatedMsg) {
        Message msg = messageRepo.findById(id).orElseThrow();
        msg.setText(updatedMsg.getText());
        msg.setSender(updatedMsg.getSender());
        msg.setTimestamp(updatedMsg.getTimestamp());
        return messageRepo.save(msg);
    }

    // delete a message
    @DeleteMapping("/{id}")
    public void deleteMessage(@PathVariable Long id) {
        messageRepo.deleteById(id);
    }
}

