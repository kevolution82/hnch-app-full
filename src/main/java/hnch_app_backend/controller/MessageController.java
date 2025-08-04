package hnch_app_backend.controller;

// this is the message controller for sending and getting messages
// it uses the message repository to save and find messages
// now it will get ai replies from the gemini server

import hnch_app_backend.model.Message;
import hnch_app_backend.model.User;
import hnch_app_backend.repository.UserRepository;
import hnch_app_backend.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
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

    @Autowired
    private UserRepository userRepo;

    // send a message and get ai reply from gemini
    @PostMapping
    public List<Message> sendMessage(@RequestBody Map<String, Object> msg) {
    String userMessage = (String) msg.get("text");
    String character = (String) msg.get("character");
    Long userId = Long.valueOf(msg.get("userId").toString());

    // get messages for this user and this character
    List<Message> existing = messageRepo.findByUserIdAndCharacterName(userId, character);
    if (existing.isEmpty()) {
        Message defaultMsg = new Message();
        defaultMsg.setUserId(userId);
        defaultMsg.setCharacterName(character);
        defaultMsg.setSender(character);
        switch (character.trim().toLowerCase()) {
            case "sal":
                defaultMsg.setText("Ay, I saw your gig post. You need muscle or you need brains? Either way, I'm your guy. Let's talk business.");
                break;
            case "sssteven":
                defaultMsg.setText("Hisss... I sssaw your gig. Doesss it involve ratsss? I can handle ratsss... for a price.");
                break;
            case "grandma":
                defaultMsg.setText("Hi honey, can you help me with the remote again? I can't find the Netflix button. Love you!");
                break;
            case "petey no-nose":
                defaultMsg.setText("🔊 [Voice message]");
                defaultMsg.setAudio("/petey.wav");
                break;
            default:
        defaultMsg.setText("Hello!");
    }
        defaultMsg.setTimestamp(LocalDateTime.now());
        messageRepo.save(defaultMsg);
    }

    // save the user's message
    Message userMsg = new Message();
    userMsg.setUserId(userId);
    userMsg.setCharacterName(character);
    userMsg.setText(userMessage);
    userMsg.setSender("user");
    userMsg.setTimestamp(LocalDateTime.now());
    messageRepo.save(userMsg);

    // talk to the gemini ai server for a reply
    String geminiApiUrl = "http://localhost:4000/api/gemini-chat";
    String aiReplyText = "sorry, i got nothin' right now.";

    try {
        RestTemplate restTemplate = new RestTemplate();
        Map<String, String> request = new HashMap<>();
        request.put("message", userMessage);
        request.put("character", getCharacterId(character));

        ResponseEntity<Map> response = restTemplate.postForEntity(geminiApiUrl, request, Map.class);
        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            Object replyObj = response.getBody().get("reply");
            if (replyObj != null) {
                aiReplyText = replyObj.toString();
            }
        }
    } catch (Exception e) {
        e.printStackTrace();
           }

    Message aiReply = new Message();
    aiReply.setUserId(userId);
    aiReply.setCharacterName(character);
    aiReply.setText(aiReplyText);
    aiReply.setSender(character);
    aiReply.setTimestamp(LocalDateTime.now());
    if (character.trim().toLowerCase().equals("petey no-nose")) {
    aiReply.setAudio("/petey.wav");
    }
    messageRepo.save(aiReply);

    // return all messages for this user and character
    return messageRepo.findByUserIdAndCharacterName(userId, character);
    }

    // get all messages for a user
    @GetMapping("/{userId}/{character}")
    public List<Message> getMessages(@PathVariable Long userId, @PathVariable String character) {
    List<Message> messages = messageRepo.findByUserIdAndCharacterName(userId, character);
    if (messages.isEmpty()) {
        Message defaultMsg = new Message();
        defaultMsg.setUserId(userId);
        defaultMsg.setCharacterName(character);
        defaultMsg.setSender(character);
        switch (character.trim().toLowerCase()) {
            case "sal":
                defaultMsg.setText("Ay, I saw your gig post. You need muscle or you need brains? Either way, I'm your guy. Let's talk business.");
                break;
            case "sssteven":
                defaultMsg.setText("Hisss... I sssaw your gig. Doesss it involve ratsss? I can handle ratsss... for a price.");
                break;
            case "grandma":
                defaultMsg.setText("Hi honey, can you help me with the remote again? I can't find the Netflix button. Love you!");
                break;
            case "petey no-nose":
                defaultMsg.setText("🔊 [Voice message]");
                defaultMsg.setAudio("/petey.wav");
                break;
            default:
                defaultMsg.setText("Hello!");
        }
        defaultMsg.setTimestamp(LocalDateTime.now());
        messageRepo.save(defaultMsg);
        messages = List.of(defaultMsg);
    }
    return messages;
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
    public ResponseEntity<?> deleteMessage(@PathVariable Long id, @RequestParam String username) {
        User user = userRepo.findByUsername(username);
        if (user == null || !"ADMIN".equals(user.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only admins can delete messages.");
        }
        messageRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // this helper turns the display name into the id for gemini
    private String getCharacterId(String character) {
    if (character == null) return "sal";
    switch (character.trim().toLowerCase()) {
        case "sal":
            return "sal";
        case "sssteven":
            return "sssteven";
        case "grandma":
            return "grandma";
        case "petey no-nose":
            return "petey";
        default:
            return "sal";
    }
}
}
