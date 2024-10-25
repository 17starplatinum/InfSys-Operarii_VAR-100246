package ru.ifmo.se.repository.entity;

import jakarta.persistence.Query;

import ru.ifmo.se.entity.Person;
import ru.ifmo.se.repository.parent.AbstractRepository;

import java.util.List;

public class PersonRepository extends AbstractRepository<Person> {
    public PersonRepository() {
        super();
    }

    @Override
    public void add(Person person) {
        runQuery(() -> {
            getSession().persist(person);
            return null;
        });
    }

    @Override
    public Person find(long Id) {
        return (Person) runQuery(() -> getSession().get(Person.class, Id));
    }

    @Override
    public List<Person> getAll() {
        return (List<Person>) runQuery(() -> (Person) getSession().createQuery("FROM Person", Person.class).list());
    }

    public List<Person> findByEyeColor(String eyeColor) {
        return (List<Person>) runQuery(() -> {
            Query query = getSession().createQuery("FROM Person WHERE eyeColor = :eyeColor");
            query.setParameter("eyeColor", eyeColor);
            return (Person) query.getResultList();
        });
    }
    public List<Person> findByHairColor(String hairColor) {
        return (List<Person>) runQuery(() -> {
            Query query = getSession().createQuery("FROM Person WHERE hairColor = :hairColor");
            query.setParameter("hairColor", hairColor);
            return (Person) query.getResultList();
        });
    }
    public List<Person> findByNationality(String nationality) {
        return (List<Person>) runQuery(() -> {
            Query query = getSession().createQuery("FROM Person WHERE nationality = :nationality");
            query.setParameter("nationality", nationality);
            return (Person) query.getResultList();
        });
    }

    @Override
    public void update(Person person) {
        runQuery(() -> getSession().merge(person));
    }

    @Override
    public void delete(Person person) {
        runQuery(() -> {
            Person object = getSession().get(Person.class, (person).getId());
            getSession().remove(object);
            return null;
        });
    }
}

