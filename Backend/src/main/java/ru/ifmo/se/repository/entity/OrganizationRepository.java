package ru.ifmo.se.repository.entity;

import ru.ifmo.se.entity.Organization;
import ru.ifmo.se.repository.parent.AbstractRepository;

import jakarta.persistence.Query;

import java.util.List;

public class OrganizationRepository extends AbstractRepository<Organization> {
    public OrganizationRepository() {
        super();
    }

    @Override
    public void add(Organization organization) {
        runQuery(() -> {
            getSession().persist(organization);
            return null;
        });
    }

    @Override
    public Organization find(long Id) {
        return (Organization) runQuery(() -> getSession().get(Organization.class, Id));
    }

    @Override
    public List<Organization> getAll() {
        return (List<Organization>) runQuery(() -> (Organization) getSession().createQuery("FROM Organization", Organization.class).list());
    }

    public List<Organization> findByOfficialAddress(String officialAddress) {
        return (List<Organization>) runQuery(() -> {
            Query query = getSession().createQuery("FROM Organization WHERE officialAddress = :officialAddress");
            query.setParameter("officialAddress", officialAddress);
            return (Organization) query.getResultList();
        });
    }
    public List<Organization> findByType(String type) {
        return (List<Organization>) runQuery(() -> {
            Query query = getSession().createQuery("FROM Organization WHERE type = :type");
            query.setParameter("type", type);
            return (Organization) query.getResultList();
        });
    }
    public List<Organization> findByPostalAddress(String postalAddress) {
        return (List<Organization>) runQuery(() -> {
            Query query = getSession().createQuery("FROM Organization WHERE postalAddress = :postalAddress");
            query.setParameter("postalAddress", postalAddress);
            return (Organization) query.getResultList();
        });
    }

    @Override
    public void update(Organization organization) {
        runQuery(() -> getSession().merge(organization));
    }

    @Override
    public void delete(Organization organization) {
        runQuery(() -> {
            Organization object = getSession().get(Organization.class, (organization).getId());
            getSession().remove(object);
            return null;
        });
    }
}
