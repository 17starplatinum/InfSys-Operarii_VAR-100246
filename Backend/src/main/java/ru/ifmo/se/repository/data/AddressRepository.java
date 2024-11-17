package ru.ifmo.se.repository.data;

import ru.ifmo.se.entity.data.Address;
import ru.ifmo.se.entity.user.User;

import lombok.AllArgsConstructor;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@AllArgsConstructor
public class AddressRepository {
    private final SessionFactory sessionFactory;

    public List<Address> findByOwner(User user) {
        try (Session session = sessionFactory.openSession()) {
            return session.createQuery("from Address where owner = :owner", Address.class)
                    .setParameter("owner", user).list();
        }
    }

    public Address findById(long id) {
        try (Session session = sessionFactory.openSession()) {
            return session.get(Address.class, id);
        }
    }

    public void delete(Address address) {
        Transaction transaction = null;
        try (Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            session.merge(address);
            transaction.commit();
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
        }
    }

    public void save(Address address) {
        Transaction transaction = null;
        try (Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            session.save(address);
            transaction.commit();
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
        }
    }

    public void update(Address address) {
        try (Session session = sessionFactory.openSession()) {
            session.update(address);
        }
    }
}
