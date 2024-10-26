package ru.ifmo.se.repository.entity;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.ifmo.se.entity.Worker;
import ru.ifmo.se.entity.enumerated.Position;
import ru.ifmo.se.entity.enumerated.Status;
import ru.ifmo.se.repository.parent.AbstractRepository;

import java.util.List;

public class WorkerRepository extends AbstractRepository<Worker> {

    public WorkerRepository() {
        super();
    }

    @Override
    public void add(Worker object) {
        runQuery(() -> {
            getSession().persist(object);
            return null;
        });
    }

    @Override
    public Worker find(long ID) {
        return (Worker) runQuery(() -> getSession().get(Worker.class, ID));
    }
    @Query("SELECT w FROM Worker w WHERE " +
        "(:name IS NULL OR w.name LIKE %:name%) AND " +
        "(:position IS NULL OR w.position = :position) AND " +
        "(:status IS NULL OR w.status = :status)")
    Page<Worker> findByFilters(@Param("name") String name, @Param("position") Position position, @Param("status") Status status) {
        return null;
    }

    @Override
    public List<Worker> getAll() {
        return (List<Worker>) runQuery(() -> (Worker) getSession().createQuery("FROM Worker", Worker.class).list());
    }

    @Override
    public void update(Worker updatedObject) {
        runQuery(() -> getSession().merge(updatedObject));
    }

    @Override
    public void delete(Worker object) {
        runQuery(() -> {
            Worker worker1 = (Worker) getSession().get(Worker.class, (object).getId());
            getSession().remove(worker1);
            return null;
        });
    }
}
