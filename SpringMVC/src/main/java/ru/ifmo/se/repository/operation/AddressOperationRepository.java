package ru.ifmo.se.repository.operation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.ifmo.se.entity.operation.AddressOperation;

@Repository
public interface AddressOperationRepository extends JpaRepository<AddressOperation, Integer> {
}
