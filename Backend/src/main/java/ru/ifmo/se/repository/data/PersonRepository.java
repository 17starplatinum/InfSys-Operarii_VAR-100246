package ru.ifmo.se.repository.data;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import ru.ifmo.se.entity.data.Person;
import ru.ifmo.se.entity.user.User;

import java.util.List;

@Repository
public interface PersonRepository extends CrudRepository<Person, Long>, PagingAndSortingRepository<Person, Long> {

    Person findById(long id);
}
