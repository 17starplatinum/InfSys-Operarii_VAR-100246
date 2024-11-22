package ru.ifmo.se.repository.data;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import ru.ifmo.se.entity.data.Location;
import ru.ifmo.se.entity.user.User;

import java.util.List;

@Repository
public interface LocationRepository extends CrudRepository<Location, Long>, PagingAndSortingRepository<Location, Long> {

    List<Location> findByOwner(User user);

    Location findById(long id);

}
