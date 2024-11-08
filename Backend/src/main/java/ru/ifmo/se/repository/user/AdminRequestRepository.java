package ru.ifmo.se.repository.user;

import ru.ifmo.se.entity.user.AdminRequest;
import ru.ifmo.se.entity.user.User;

import lombok.AllArgsConstructor;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@AllArgsConstructor
public class AdminRequestRepository {
    private final SessionFactory sessionFactory;

    public void save(AdminRequest adminRequest) {
        Transaction transaction = null;
        try (Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            session.save(adminRequest);
            transaction.commit();
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            throw e;
        }
    }

    public AdminRequest findById(long id) {
        try (Session session = sessionFactory.openSession()) {
            return session.get(AdminRequest.class, id);
        } catch (Exception e) {
            return null;
        }
    }

    public Optional<AdminRequest> findByRequester(User requester) {
        try (Session session = sessionFactory.openSession()) {
            String hql = "from AdminRequest where requester = :requester";
            AdminRequest result = session.createQuery(hql, AdminRequest.class)
                    .setParameter("requester", requester)
                    .uniqueResult();
            return Optional.ofNullable(result);
        }
    }

    public void update(AdminRequest adminRequest) {
        Transaction transaction = null;
        try (Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            session.update(adminRequest);
            transaction.commit();
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            throw e;
        }
    }

    @SuppressWarnings("unchecked")
    public List<AdminRequest> findAll() {
        try (Session session = sessionFactory.openSession()) {
            return session.createQuery("from AdminRequest").list();
        }
    }
}
