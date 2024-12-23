package ru.ifmo.se.service.info;


import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;

@Slf4j
@Component
@RequiredArgsConstructor
public class DBTransactionResource implements TwoPCResource {
    private final PlatformTransactionManager transactionManager;
    private TransactionStatus status;

    @Override
    public void prepare() throws Exception {
        log.info("MinIO: ");
    }
}
