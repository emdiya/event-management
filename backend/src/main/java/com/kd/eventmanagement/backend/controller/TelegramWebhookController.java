package com.kd.eventmanagement.backend.controller;

import com.kd.eventmanagement.backend.dto.respone.EventResponse;
import com.kd.eventmanagement.backend.entity.Event;
import com.kd.eventmanagement.backend.integration.telegram.TelegramBotClient;
import com.kd.eventmanagement.backend.service.EventService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/telegram")
@RequiredArgsConstructor
public class TelegramWebhookController {

    private final TelegramBotClient telegramBotClient;
    private final EventService eventService;

    @Value("${telegram.bot.web-app-base-url:}")
    private String webAppBaseUrl;

    @PostMapping("/webhook")
    public ResponseEntity<Map<String, Object>> webhook(@RequestBody Map<String, Object> update) {
        try {
            Map<String, Object> message = asMap(update.get("message"));
            if (message != null) {
                handleMessage(message);
            }

            Map<String, Object> callbackQuery = asMap(update.get("callback_query"));
            if (callbackQuery != null) {
                handleCallback(callbackQuery);
            }
        } catch (Exception e) {
            log.error("Telegram webhook error", e);
        }

        return ResponseEntity.ok(Map.of("ok", true));
    }

    private void handleMessage(Map<String, Object> message) {
        String text = asString(message.get("text"));
        if (text == null || text.isBlank()) {
            return;
        }

        Long userId = extractUserId(message);
        Long chatId = extractChatId(message);
        Long targetId = userId != null ? userId : chatId;
        if (targetId == null) {
            return;
        }

        String trimmed = text.trim();

        if (trimmed.startsWith("/start")) {
            sendWelcome(targetId);
            return;
        }

        if (trimmed.startsWith("/help")) {
            sendHelp(targetId);
            return;
        }

        if (trimmed.startsWith("/events")) {
            sendEvents(targetId);
            return;
        }

        if (trimmed.startsWith("/register")) {
            handleRegisterCommand(targetId, trimmed);
            return;
        }

        telegramBotClient.sendMessageToUser(targetId, "I didn't understand that. Use /help to see available commands.");
    }

    private void handleCallback(Map<String, Object> callbackQuery) {
        Map<String, Object> message = asMap(callbackQuery.get("message"));
        Long chatId = message != null ? extractChatId(message) : null;
        if (chatId == null) {
            return;
        }

        telegramBotClient.sendMessageToUser(chatId, "Use /register <EVENT_CODE> to open the registration form.");
    }

    private void sendWelcome(Long targetId) {
        String welcomeMsg = """
                Welcome to EventFlow Bot!

                Commands:
                /events - List upcoming events
                /register <EVENT_CODE> - Register for an event
                /help - Show help
                """;
        telegramBotClient.sendMessageToUser(targetId, welcomeMsg);
    }

    private void sendHelp(Long targetId) {
        String helpMsg = """
                EventFlow Bot Commands:

                /events - List upcoming events
                /register <EVENT_CODE> - Register for an event
                /help - Show help
                """;
        telegramBotClient.sendMessageToUser(targetId, helpMsg);
    }

    private void sendEvents(Long targetId) {
        Page<EventResponse> page = eventService.getAllEvents(1, 5, null, Event.EventStatus.PUBLISHED);
        List<EventResponse> events = page.getContent();

        if (events.isEmpty()) {
            telegramBotClient.sendMessageToUser(targetId, "No events available at the moment.");
            return;
        }

        StringBuilder eventsList = new StringBuilder("Upcoming events:\n\n");
        for (EventResponse event : events) {
            eventsList.append("- ").append(event.getTitle()).append("\n");
            eventsList.append("  Code: ").append(event.getCode()).append("\n");
            if (event.getLocation() != null && !event.getLocation().isBlank()) {
                eventsList.append("  Location: ").append(event.getLocation()).append("\n");
            }
            eventsList.append("\n");
        }
        eventsList.append("Use /register <EVENT_CODE> to open the registration form.");

        telegramBotClient.sendMessageToUser(targetId, eventsList.toString());
    }

    private void handleRegisterCommand(Long targetId, String text) {
        String[] parts = text.split("\\s+");
        if (parts.length < 2) {
            telegramBotClient.sendMessageToUser(targetId, "Usage: /register <EVENT_CODE>");
            return;
        }

        String eventCode = parts[1].trim();
        try {
            EventResponse event = eventService.getByCode(eventCode);
            String webAppUrl = buildWebAppUrl(event.getCode());
            if (webAppUrl == null) {
                telegramBotClient.sendMessageToUser(targetId, "Web App URL is not configured. Please contact the admin.");
                return;
            }

            String message = "Open registration for: " + event.getTitle();
            telegramBotClient.sendMessageWithWebAppButton(targetId, message, "Register", webAppUrl);
        } catch (Exception e) {
            telegramBotClient.sendMessageToUser(targetId, "Event not found. Use /events to list available events.");
        }
    }

    private String buildWebAppUrl(String eventCode) {
        if (webAppBaseUrl == null || webAppBaseUrl.isBlank()) {
            return null;
        }

        String base = webAppBaseUrl.endsWith("/")
                ? webAppBaseUrl.substring(0, webAppBaseUrl.length() - 1)
                : webAppBaseUrl;

        return UriComponentsBuilder.fromUriString(base)
                .path("/telegram/register")
                .queryParam("code", eventCode)
                .build()
                .toUriString();
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> asMap(Object value) {
        if (value instanceof Map) {
            return (Map<String, Object>) value;
        }
        return null;
    }

    private String asString(Object value) {
        return value != null ? value.toString() : null;
    }

    private Long toLong(Object value) {
        if (value instanceof Number) {
            return ((Number) value).longValue();
        }
        if (value instanceof String) {
            try {
                return Long.parseLong((String) value);
            } catch (NumberFormatException ignored) {
                return null;
            }
        }
        return null;
    }

    private Long extractUserId(Map<String, Object> message) {
        Map<String, Object> from = asMap(message.get("from"));
        return from != null ? toLong(from.get("id")) : null;
    }

    private Long extractChatId(Map<String, Object> message) {
        Map<String, Object> chat = asMap(message.get("chat"));
        return chat != null ? toLong(chat.get("id")) : null;
    }
}
