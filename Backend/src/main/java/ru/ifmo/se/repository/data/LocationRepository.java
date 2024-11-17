package ru.ifmo.se.repository.data;

import org.hibernate.HibernateException;
import ru.ifmo.se.entity.data.Address;
import ru.ifmo.se.entity.data.Coordinates;
import ru.ifmo.se.entity.data.Location;
import ru.ifmo.se.entity.user.User;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.stereotype.Repository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

@Repository
public class LocationRepository {
    @Autowired
    private SessionFactory sessionFactory;

    public List<Location> findByOwner(User user) {
        try (Session session = sessionFactory.openSession()) {
            return session.createQuery("from Location where owner = :owner", Location.class)
                    .setParameter("owner", user).list();
        }
    }

    public Location findById(long id) {
        Transaction transaction = null;
        try(Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            return session.get(Location.class, id);
        } catch (Exception e) {
            if(transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
        }
        return null;
    }

    public void delete(Location location) {
        Transaction transaction = null;
        try (Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            session.merge(location);
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

    public void update(Location location) {
        try (Session session = sessionFactory.openSession()) {
            session.update(location);
        }
    }
}
