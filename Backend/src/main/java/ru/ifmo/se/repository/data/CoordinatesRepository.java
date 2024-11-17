package ru.ifmo.se.repository.data;

import org.springframework.beans.factory.annotation.Autowired;
import ru.ifmo.se.entity.data.Coordinates;
import ru.ifmo.se.entity.user.User;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CoordinatesRepository {
    @Autowired
    private SessionFactory sessionFactory;

    public List<Coordinates> findByOwner(User user) {
        try (Session session = sessionFactory.openSession()) {
            return session.createQuery("from Coordinates where owner = :owner", Coordinates.class)
                    .setParameter("owner", user).list();
        }
    }

    public Coordinates findById(long id) {
        Transaction transaction = null;
        try (Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            return session.get(Coordinates.class, id);
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
        }
        return null;
    }

    public void delete(Coordinates coordinates) {
        Transaction transaction = null;
        try (Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            session.merge(coordinates);
            transaction.commit();
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
        }
    }

    public void save(Coordinates coordinates) {
        Transaction transaction = null;
        try (Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            session.save(coordinates);
            transaction.commit();
        } catch (Exception e) {
            e.printStackTrace();
            if (transaction != null) {
                transaction.rollback();
            }
        }
    }

    public void update(Coordinates coordinates) {
        try (Session session = sessionFactory.openSession()) {
            session.update(coordinates);
        }
    }
}