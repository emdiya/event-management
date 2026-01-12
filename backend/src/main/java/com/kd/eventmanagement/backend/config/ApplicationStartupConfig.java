package com.kd.eventmanagement.backend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.net.InetAddress;
import java.net.UnknownHostException;

@Component
public class ApplicationStartupConfig {

    private static final Logger logger = LoggerFactory.getLogger(ApplicationStartupConfig.class);
    
    private final Environment env;

    public ApplicationStartupConfig(Environment env) {
        this.env = env;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        logApplicationStartup();
    }

    private void logApplicationStartup() {
        String protocol = "http";
        String serverPort = env.getProperty("server.port", "8080");
        String contextPath = env.getProperty("server.servlet.context-path", "/");
        String hostAddress = "localhost";
        
        try {
            hostAddress = InetAddress.getLocalHost().getHostAddress();
        } catch (UnknownHostException e) {
            logger.warn("Unable to determine host address");
        }
        
        String activeProfiles = env.getActiveProfiles().length == 0 
            ? "default" 
            : String.join(", ", env.getActiveProfiles());
        
        logger.info("\n" +
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                "🎉  Event Management Application Started Successfully!\n" +
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                "📋  Application: {}\n" +
                "🌐  Local URL:   {}://localhost:{}{}\n" +
                "🌍  Network URL: {}://{}:{}{}\n" +
                "📊  Profile(s):  {}\n" +
                "🔧  Database:    PostgreSQL (localhost:5432)\n" +
                "💡  API Docs:    {}://localhost:{}/swagger-ui.html\n" +
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n",
                env.getProperty("spring.application.name"),
                protocol, serverPort, contextPath,
                protocol, hostAddress, serverPort, contextPath,
                activeProfiles,
                protocol, serverPort
        );
    }
}
