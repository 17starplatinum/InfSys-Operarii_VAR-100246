package ru.ifmo.se.repository.parent;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;
import lombok.Getter;

public abstract class AbstractRepository<T> implements IRepository<T> {
    @Getter
    private static SessionFactory sessionFactory;

    @Getter
    private Session session;

    private Transaction transaction;

    public AbstractRepository() {
        configure();
    }

    private void configure() {
        sessionFactory = new Configuration().configure().buildSessionFactory();
    }
    void startSession() {
        session = sessionFactory.openSession();
        transaction = session.beginTransaction();
    }

    final void closeSession() {
        transaction.commit();
        session.close();
        transaction = null;
    }

    public Object runQuery(IQuery<T> query) {
        startSession();
        Object result = query.run();
        closeSession();
        return result;
    }
}
