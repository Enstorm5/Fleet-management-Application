package com.example.crew.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // Allows CORS on all paths
                .allowedOrigins("http://localhost:8005")  // Allows requests from this origin
                .allowedMethods("GET", "POST", "PUT", "DELETE")  // Allows these methods
                .allowedHeaders("*")  // Allows all headers
                .allowCredentials(true);  // Allows credentials (cookies, authorization headers, etc.)
    }
}
