package com.hnchapp.controller;

import com.hnchapp.model.Message;
import com.hnchapp.model.User;
import com.hnchapp.repository.UserRepository;
import com.hnchapp.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;
import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "https://gemini-api-j6vx.onrender.com")
@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageRepository messageRepo;

    @Autowired
    private UserRepository userRepo;

    // normalize character names for consistency
    private String normalizeCharacter(String character) {
        return character == null ? "" : character.trim().toLowerCase();
    }

    // send a message, save it, get AI reply from Gemini, save reply, and return all messages for this chat
    @PostMapping
    public List<Message> sendMessage(@RequestBody Map<String, Object> msg) {
    String userMessage = (String) msg.get("text");
    String character = (String) msg.get("character");
    Long userId = Long.valueOf(msg.get("userId").toString());
    String normalizedCharacter = normalizeCharacter(character);

// insert default message if chat is empty
List<Message> existing = messageRepo.findByUserIdAndCharacterName(userId, normalizedCharacter);

if (existing.isEmpty()) {
    Message defaultMsg = new Message();
    defaultMsg.setUserId(userId);
    defaultMsg.setCharacterName(normalizedCharacter);
    defaultMsg.setSender(normalizedCharacter);
    // sets up a default message if there are no messages yet for this chat
    switch (normalizedCharacter) {
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

// saves the user's message to the database
Message userMsg = new Message();
userMsg.setUserId(userId);
userMsg.setCharacterName(normalizedCharacter);
userMsg.setText(userMessage);
userMsg.setSender("user");
userMsg.setTimestamp(LocalDateTime.now());
messageRepo.save(userMsg);

// get AI reply from Gemini server
String geminiApiUrl = "https://gemini-api-j6vx.onrender.com/api/gemini-chat";
String aiReplyText = "sorry, i got nothin' right now.";
try {
    RestTemplate restTemplate = new RestTemplate();
    Map<String, String> request = new HashMap<>();
    request.put("message", userMessage);
    request.put("character", getCharacterId(normalizedCharacter));

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
aiReply.setCharacterName(normalizedCharacter);
aiReply.setText(aiReplyText);
aiReply.setSender(normalizedCharacter);
aiReply.setTimestamp(LocalDateTime.now());
if (normalizedCharacter.equals("petey no-nose")) {
    aiReply.setAudio("/petey.wav");
}
messageRepo.save(aiReply);

// get all messages for this user and character from the database
return messageRepo.findByUserIdAndCharacterName(userId, normalizedCharacter);
}

@GetMapping("/{userId}/{character}")
public List<Message> getMessages(@PathVariable Long userId, @PathVariable String character) {
    String normalizedCharacter = normalizeCharacter(character);
    List<Message> messages = messageRepo.findByUserIdAndCharacterName(userId, normalizedCharacter);

    if (messages.isEmpty()) {
        Message defaultMsg = new Message();
        defaultMsg.setUserId(userId);
        defaultMsg.setCharacterName(normalizedCharacter);
        defaultMsg.setSender(normalizedCharacter);

        switch (normalizedCharacter) {
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

// update a message by id
@PutMapping("/{id}")
public Message updateMessage(@PathVariable Long id, @RequestBody Message updatedMsg) {
    Message msg = messageRepo.findById(id).orElseThrow();
    msg.setText(updatedMsg.getText());
    msg.setSender(updatedMsg.getSender());
    msg.setTimestamp(updatedMsg.getTimestamp());
    return messageRepo.save(msg);
}

// only admins can delete messages
@DeleteMapping("/{id}")
public ResponseEntity<?> deleteMessage(@PathVariable Long id, @RequestParam String username) {
    User user = userRepo.findByUsername(username);

    if (user == null || !"ADMIN".equals(user.getRole())) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only admins can delete messages.");
    }
    messageRepo.deleteById(id);
    return ResponseEntity.ok().build();
}

// reset chat for a user and character, keeping only the default message
@DeleteMapping("/reset/{userId}/{character}")
public ResponseEntity<?> resetChat(@PathVariable Long userId, @PathVariable String character) {
    String normalizedCharacter = normalizeCharacter(character);

    String defaultText;
    String defaultAudio = null;
    switch (normalizedCharacter) {
        case "sal":
            defaultText = "Ay, I saw your gig post. You need muscle or you need brains? Either way, I'm your guy. Let's talk business.";
            break;
        case "sssteven":
            defaultText = "Hisss... I sssaw your gig. Doesss it involve ratsss? I can handle ratsss... for a price.";
            break;
        case "grandma":
            defaultText = "Hi honey, can you help me with the remote again? I can't find the Netflix button. Love you!";
            break;
        case "petey no-nose":
            defaultText = "🔊 [Voice message]";
            defaultAudio = "/petey.wav";
            break;
        default:
            defaultText = "Hello!";
    }

    List<Message> messages = messageRepo.findByUserIdAndCharacterName(userId, normalizedCharacter);

    // find the oldest default message
    Message defaultMsg = null;
    for (Message m : messages) {
        boolean isDefault = defaultText.equals(m.getText());
        if (normalizedCharacter.equals("petey no-nose")) {
            isDefault = isDefault && defaultAudio != null && defaultAudio.equals(m.getAudio());
        }
        if (isDefault && (defaultMsg == null || m.getTimestamp().isBefore(defaultMsg.getTimestamp()))) {
            defaultMsg = m;
        }
    }

    // delete all messages except the oldest default message
    for (Message m : messages) {
        if (defaultMsg == null || !m.getId().equals(defaultMsg.getId())) {
            messageRepo.delete(m);
        }
    }

    // insert default message if none exists
    if (defaultMsg == null) {
        Message newDefault = new Message();
        newDefault.setUserId(userId);
        newDefault.setCharacterName(normalizedCharacter);
        newDefault.setSender(normalizedCharacter);
        newDefault.setText(defaultText);
        if (defaultAudio != null) {
            newDefault.setAudio(defaultAudio);
        }
        newDefault.setTimestamp(LocalDateTime.now());
        messageRepo.save(newDefault);
    }

    return ResponseEntity.ok().build();
}

// map display name to Gemini character id
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
}}