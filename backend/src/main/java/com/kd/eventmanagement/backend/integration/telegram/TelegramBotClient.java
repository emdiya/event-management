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

    /**
     * Send message to default chat
     */
    public void sendMessage(String message) {
        sendMessage(chatId, message);
    }

    /**
     * Send message to specific user by telegram user ID
     */
    public void sendMessageToUser(Long telegramUserId, String message) {
        sendMessage(String.valueOf(telegramUserId), message);
    }

    /**
     * Send message with inline keyboard (for Web App button)
     */
    public void sendMessageWithWebAppButton(Long telegramUserId, String message, String buttonText, String webAppUrl) {
        try {
            String url = "https://api.telegram.org/bot" + botToken + "/sendMessage";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> webApp = new HashMap<>();
            webApp.put("url", webAppUrl);

            Map<String, Object> button = new HashMap<>();
            button.put("text", buttonText);
            button.put("web_app", webApp);

            Map<String, Object> keyboard = new HashMap<>();
            keyboard.put("inline_keyboard", new Object[][]{
                {button}
            });

            Map<String, Object> body = new HashMap<>();
            body.put("chat_id", String.valueOf(telegramUserId));
            body.put("text", message);
            body.put("parse_mode", "HTML");
            body.put("reply_markup", keyboard);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            restTemplate.postForObject(url, request, String.class);
            logger.info("✅ Telegram message with Web App button sent to user {}", telegramUserId);

        } catch (Exception e) {
            logger.error("❌ Telegram send failed", e);
        }
    }

    private void sendMessage(String chatIdOrUserId, String message) {
        try {
            String url = "https://api.telegram.org/bot" + botToken + "/sendMessage";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> body = new HashMap<>();
            body.put("chat_id", chatIdOrUserId);
            body.put("text", message);
            body.put("parse_mode", "HTML");

            HttpEntity<Map<String, Object>> request =
                    new HttpEntity<>(body, headers);

            restTemplate.postForObject(url, request, String.class);
            logger.info("✅ Telegram message sent to {}", chatIdOrUserId);

        } catch (Exception e) {
            logger.error("❌ Telegram send failed", e);
        }
    }
}
