package ru.ifmo.se.repository.data;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import ru.ifmo.se.entity.data.Address;

@Repository
public interface AddressRepository extends CrudRepository<Address, Long>, PagingAndSortingRepository<Address, Long> {
    Page<Address> findByZipCodeContaining(String zipCode, Pageable pageable);
}
