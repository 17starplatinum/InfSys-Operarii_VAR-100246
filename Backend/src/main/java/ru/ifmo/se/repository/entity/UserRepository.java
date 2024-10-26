package ru.ifmo.se.repository.entity;

import ru.ifmo.se.entity.User;
import ru.ifmo.se.repository.parent.AbstractRepository;

import jakarta.persistence.Query;

import java.util.List;

public class UserRepository extends AbstractRepository<User> {
    public UserRepository() {
        super();
    }

    @Override
    public void add(User object) {
        runQuery(() -> {
            getSession().persist(object);
            return null;
        });
    }

    @Override
    public User find(long ID) {
        return (User) runQuery(() -> getSession().get(User.class, ID));
    }

    public User findByUsername(String username) {
        return (User) runQuery(() -> {
            Query query = getSession().createQuery("FROM User where username = :username");
            query.setParameter("username", username);
            return (User) query.getSingleResult();
        });
    }

    @Override
    public List<User> getAll() {
        return (List<User>) runQuery(() -> (User) getSession().createQuery("FROM User", User.class).list());
    }

    @Override
    public void update(User updatedObject) {
        runQuery(() -> getSession().merge(updatedObject));
    }

    @Override
    public void delete(User user) {
        runQuery(() -> {
            User user1 = getSession().get(User.class, (user).getId());
            getSession().remove(user1);
            return null;
        });
    }
}