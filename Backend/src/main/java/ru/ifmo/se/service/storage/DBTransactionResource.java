package ru.ifmo.se.service.storage;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;

@Slf4j
@Component
@RequiredArgsConstructor
public class DBTransactionResource implements TwoPCResource {
    private final PlatformTransactionManager transactionManager;
    private TransactionStatus status;

    @Override
    public void prepare() throws Exception {
        log.info("БД: Начинается стадия подготовки. Открывается новая транзакция...");
        this.status = transactionManager.getTransaction(new DefaultTransactionDefinition());
        log.info("БД: Транзакция открыта.");
    }

    @Override
    public void commit() throws Exception {
        log.info("БД: Выполняется транзакция...");
        transactionManager.commit(status);
        log.info("БД: Транзакция выполнена.");
    }

    @Override
    public void rollback() throws Exception {
        log.info("БД: Откатывается транзакция...");
        if(status != null && !status.isCompleted()) {
            transactionManager.rollback(status);
            log.info("БД: Транзакция успешно откатана.");
        } else {
            log.info("БД: Транзакция является null или уже выполненной, откат не выполнен.");
        }
    }
}
