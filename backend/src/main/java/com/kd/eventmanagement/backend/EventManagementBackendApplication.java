package com.kd.eventmanagement.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

@SpringBootApplication
public class EventManagementBackendApplication {

    private static ApplicationContext applicationContext;

    public static void main(String[] args) {
        applicationContext = SpringApplication.run(EventManagementBackendApplication.class, args);
    }

    /**
     * Get Spring bean by class type
     */
    public static <T> T getBean(Class<T> beanClass) {
        return applicationContext.getBean(beanClass);
    }

    /**
     * Get Spring bean by bean name
     */
    public static Object getBean(String beanName) {
        return applicationContext.getBean(beanName);
    }

    /**
     * Get Spring ApplicationContext
     */
    public static ApplicationContext getContext() {
        return applicationContext;
    }
}
