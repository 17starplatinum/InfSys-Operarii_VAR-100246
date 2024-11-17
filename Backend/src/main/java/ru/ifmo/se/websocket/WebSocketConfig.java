package ru.ifmo.se.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    private final AdminWebSocketHandler adminWebSocketHandler;
    private final WorkerWebSocketHandler workerWebSocketHandler;

    public WebSocketConfig(AdminWebSocketHandler adminWebSocketHandler, WorkerWebSocketHandler workerWebSocketHandler) {
        this.adminWebSocketHandler = adminWebSocketHandler;
        this.workerWebSocketHandler = workerWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(workerWebSocketHandler, "ws/worker").setAllowedOrigins("*");
        registry.addHandler(adminWebSocketHandler, "ws/admin").setAllowedOrigins("*");
    }
}
