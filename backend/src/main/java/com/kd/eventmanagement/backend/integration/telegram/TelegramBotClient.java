package com.kd.eventmanagement.backend.integration.telegram;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component
public class TelegramBotClient {

    private static final Logger logger = LoggerFactory.getLogger(TelegramBotClient.class);

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${telegram.bot.token}")
    private String botToken;

    @Value("${telegram.bot.chat-id}")
    private String chatId;

    public void sendMessage(String message) {
        try {
            String url = "https://api.telegram.org/bot" + botToken + "/sendMessage";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> body = new HashMap<>();
            body.put("chat_id", chatId);
            body.put("text", message);
            body.put("parse_mode", "HTML");

            HttpEntity<Map<String, Object>> request =
                    new HttpEntity<>(body, headers);

            restTemplate.postForObject(url, request, String.class);
            logger.info("✅ Telegram message sent");

        } catch (Exception e) {
            logger.error("❌ Telegram send failed", e);
        }
    }
}
