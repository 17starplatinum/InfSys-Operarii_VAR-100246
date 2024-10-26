package ru.ifmo.se.repository.entity;

import ru.ifmo.se.entity.Location;
import ru.ifmo.se.repository.parent.AbstractRepository;

import java.util.List;

public class LocationRepository extends AbstractRepository<Location> {
    public LocationRepository() {
        super();
    }

    @Override
    public void add(Location location) {
        runQuery(() -> {
            getSession().persist(location);
            return null;
        });
    }

    @Override
    public Location find(long Id) {
        return (Location) runQuery(() -> getSession().get(Location.class, Id));
    }

    @Override
    public List<Location> getAll() {
        return (List<Location>) runQuery(() -> (Location) getSession().createQuery("FROM Location", Location.class).list());
    }

    @Override
    public void update(Location location) {
        runQuery(() -> getSession().merge(location));
    }

    @Override
    public void delete(Location location) {
        runQuery(() -> {
            Location object = getSession().get(Location.class, (location).getId());
            getSession().remove(object);
            return null;
        });
    }
}
