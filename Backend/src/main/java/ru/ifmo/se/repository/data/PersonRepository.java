package ru.ifmo.se.repository.data;

import ru.ifmo.se.entity.data.Person;
import ru.ifmo.se.entity.user.User;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public class PersonRepository {

    @Autowired
    private SessionFactory sessionFactory;

    public void save(Person person) {
        Transaction transaction = null;
        try(Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            session.save(person);
            transaction.commit();
        } catch (ConstraintViolationException e) {
            e.printStackTrace();
            Set<ConstraintViolation<?>> violations = e.getConstraintViolations();
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to save person", e);
        }
    }

    public void update(Person person) {
        Transaction transaction = null;
        try(Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            session.merge(person);
            transaction.commit();
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
        }
    }

    public void delete(Person person) {
        Transaction transaction = null;
        try(Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            session.remove(person);
            transaction.commit();
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
        }
    }

    public List<Person> findByOwner(User user) {
        try (Session session = sessionFactory.openSession()) {
            return session.createQuery("from Person where owner = :owner", Person.class)
                    .setParameter("owner", user).list();
        }
    }

    public Person findById(long id) {
        try(Session session = sessionFactory.openSession()) {
            return session.get(Person.class, id);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @SuppressWarnings("unchecked")
    public List<Person> findAll() {
        try(Session session = sessionFactory.openSession()) {
            return session.createQuery("from Person").list();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
