package ru.ifmo.se.repository.data;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import ru.ifmo.se.entity.data.Coordinates;
import ru.ifmo.se.entity.user.User;

import java.util.List;

@Repository
public interface CoordinatesRepository extends CrudRepository<Coordinates, Long>, PagingAndSortingRepository<Coordinates, Long> {

    List<Coordinates> findByOwner(User user);

    Coordinates findById(long id);

}