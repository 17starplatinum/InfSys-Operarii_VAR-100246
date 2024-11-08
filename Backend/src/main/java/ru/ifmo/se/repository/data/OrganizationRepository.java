package ru.ifmo.se.repository.data;

import ru.ifmo.se.entity.data.Organization;
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
public class OrganizationRepository {

    @Autowired
    private SessionFactory sessionFactory;

    public void save(Organization organization) {
        Transaction transaction = null;
        try(Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            session.save(organization);
            transaction.commit();
        } catch (ConstraintViolationException e) {
            e.printStackTrace();
            Set<ConstraintViolation<?>> violations = e.getConstraintViolations();
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to save organization", e);
        }
    }

    public void update(Organization organization) {
        Transaction transaction = null;
        try(Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            session.merge(organization);
            transaction.commit();
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
        }
    }

    public void delete(Organization organization) {
        Transaction transaction = null;
        try(Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            session.remove(organization);
            transaction.commit();
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
        }
    }

    public List<Organization> findByOwner(User user) {
        try (Session session = sessionFactory.openSession()) {
            return session.createQuery("from Organization where owner = :owner", Organization.class)
                    .setParameter("owner", user).list();
        }
    }

    public Organization findById(long id) {
        try(Session session = sessionFactory.openSession()) {
            return session.get(Organization.class, id);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @SuppressWarnings("unchecked")
    public List<Organization> findAll() {
        try(Session session = sessionFactory.openSession()) {
            return session.createQuery("from Organization").list();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
