package com.cluelesscloset;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean(name = "cvTaskExecutor")
    public Executor cvTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(4); // Always-alive threads
        executor.setMaxPoolSize(8); // Burst capacity
        executor.setQueueCapacity(100); // Queue before rejecting
        executor.setThreadNamePrefix("cv-worker-");
        executor.initialize();
        return executor;
    }
}
