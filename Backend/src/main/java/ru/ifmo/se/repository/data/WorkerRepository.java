package ru.ifmo.se.repository.data;

import ru.ifmo.se.entity.data.Worker;
import ru.ifmo.se.entity.user.User;
import jakarta.persistence.ParameterMode;
import jakarta.persistence.StoredProcedureQuery;
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
public class WorkerRepository {

    @Autowired
    private SessionFactory sessionFactory;

    public void save(Worker worker) {
        Transaction transaction = null;
        try(Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            session.save(worker);
            transaction.commit();
        } catch (ConstraintViolationException e) {
            e.printStackTrace();
            Set<ConstraintViolation<?>> violations = e.getConstraintViolations();
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to save worker", e);
        }
    }

    public void update(Worker worker) {
        Transaction transaction = null;
        try(Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            session.merge(worker);
            transaction.commit();
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
        }
    }

    public void delete(Worker worker) {
        Transaction transaction = null;
        try(Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            session.remove(worker);
            transaction.commit();
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
        }
    }

    public List<Worker> findByOwner(User user) {
        try (Session session = sessionFactory.openSession()) {
            return session.createQuery("from Worker where owner = :owner", Worker.class)
                    .setParameter("owner", user).list();
        }
    }

    public Worker findById(long id) {
        try(Session session = sessionFactory.openSession()) {
            return session.get(Worker.class, id);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @SuppressWarnings("unchecked")
    public List<Worker> findAll() {
        try(Session session = sessionFactory.openSession()) {
            return session.createQuery("from Worker").list();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }


}
