package ru.ifmo.se.service;

import ru.ifmo.se.entity.*;
import ru.ifmo.se.entity.operation.*;
import ru.ifmo.se.repository.operation.*;
import ru.ifmo.se.util.EntityMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OperationService {

    private AddressOperationRepository addressOperationRepository;
    private CoordinatesOperationRepository coordinatesOperationRepository;
    private LocationOperationRepository locationOperationRepository;
    private OrganizationOperationRepository organizationOperationRepository;
    private PersonOperationRepository personOperationRepository;
    private WorkerOperationRepository workerOperationRepository;
    private EntityMapper entityMapper;

    @Autowired
    private void setAddressOperationRepository(AddressOperationRepository addressOperationRepository) {
        this.addressOperationRepository = addressOperationRepository;
    }
}
