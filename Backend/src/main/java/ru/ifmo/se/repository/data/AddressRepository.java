package ru.ifmo.se.repository.data;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.ifmo.se.entity.data.Address;
import ru.ifmo.se.entity.user.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends CrudRepository<Address, Long>, PagingAndSortingRepository<Address, Long> {

    List<Address> findAddressByOwner(@Param("owner") User user);

    Optional<Address> findAddressById(Long id);

    Page<Address> findByZipCodeContaining(String zipCode, Pageable pageable);

    void updateAddressById(Long id, Address address);
}
