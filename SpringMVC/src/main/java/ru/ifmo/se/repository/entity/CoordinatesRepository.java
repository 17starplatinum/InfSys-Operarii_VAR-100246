package ru.ifmo.se.repository.entity;

import ru.ifmo.se.entity.Coordinates;
import ru.ifmo.se.repository.parent.AbstractRepository;

import java.util.List;

public class CoordinatesRepository extends AbstractRepository<Coordinates> {
    public CoordinatesRepository() {
        super();
    }

    @Override
    public void add(Coordinates coordinates) {
        runQuery(() -> {
            getSession().persist(coordinates);
            return null;
        });
    }

    @Override
    public Coordinates find(long Id) {
        return (Coordinates) runQuery(() -> getSession().get(Coordinates.class, Id));
    }

    @Override
    public List<Coordinates> getAll() {
        return (List<Coordinates>) runQuery(() -> (Coordinates) getSession().createQuery("FROM Coordinates", Coordinates.class).list());
    }

    @Override
    public void update(Coordinates coordinates) {
        runQuery(() -> getSession().merge(coordinates));
    }

    @Override
    public void delete(Coordinates coordinates) {
        runQuery(() -> {
            Coordinates object = getSession().get(Coordinates.class, (coordinates).getId());
            getSession().remove(object);
            return null;
        });
    }
}
