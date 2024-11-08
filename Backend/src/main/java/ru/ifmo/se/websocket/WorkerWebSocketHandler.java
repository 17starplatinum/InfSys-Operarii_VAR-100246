package ru.ifmo.se.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@AllArgsConstructor
public class WorkerWebSocketHandler extends TextWebSocketHandler {
    private final ObjectMapper objectMapper;
    private final List<WebSocketSession> sessions = new ArrayList<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session);
    }

    public void sendUpdate(String type, Object payload) throws IOException {
        Map<String, Object> message = new HashMap<>();
        message.put("type", type);

        if("delete".equals(type)){
            message.put("id", payload);
        } else {
            message.put("worker", payload);
        }

        String jsonMessage = objectMapper.writeValueAsString(message);
        for (WebSocketSession session : sessions) {
            session.sendMessage(new TextMessage(jsonMessage));
        }
    }
}
