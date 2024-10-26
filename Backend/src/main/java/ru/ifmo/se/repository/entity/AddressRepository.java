package ru.ifmo.se.repository.entity;

import jakarta.persistence.Query;
import ru.ifmo.se.entity.Address;
import ru.ifmo.se.repository.parent.AbstractRepository;

import java.util.List;

public class AddressRepository extends AbstractRepository<Address> {

    public AddressRepository() {
        super();
    }

    @Override
    public void add(Address address) {
        runQuery(() -> {
            getSession().persist(address);
            return null;
        });
    }

    @Override
    public Address find(long Id) {
        return (Address) runQuery(() -> getSession().get(Address.class, Id));
    }

    @Override
    public List<Address> getAll() {
        return (List<Address>) runQuery(() -> (Address) getSession().createQuery("FROM Address", Address.class).list());
    }

    public Address findByZipCode(String zipCode) {
        return (Address) runQuery(() -> {
            Query query = getSession().createQuery("FROM Address WHERE zipCode = :zipCode");
            query.setParameter("zipCode", zipCode);
            return (Address) query.getSingleResult();
        });
    }

    @Override
    public void update(Address address) {
        runQuery(() -> getSession().merge(address));
    }

    @Override
    public void delete(Address address) {
        runQuery(() -> {
            Address object = getSession().get(Address.class, (address).getId());
            getSession().remove(object);
            return null;
        });
    }
}
