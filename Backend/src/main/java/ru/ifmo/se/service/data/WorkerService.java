package ru.ifmo.se.service.data;

import ru.ifmo.se.dto.data.WorkerDTORequest;
import ru.ifmo.se.entity.data.Worker;
import ru.ifmo.se.entity.data.enumerated.*;
import ru.ifmo.se.repository.data.*;
import ru.ifmo.se.entity.user.User;
import ru.ifmo.se.exception.ResourceNotFoundException;
import ru.ifmo.se.entity.data.*;
import ru.ifmo.se.websocket.WorkerWebSocketHandler;
import ru.ifmo.se.util.DTOUtil;


import lombok.RequiredArgsConstructor;
import org.hibernate.HibernateException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkerService {

    private final WorkerRepository workerRepository;
    private final CoordinatesRepository coordinatesRepository;
    private final OrganizationRepository organizationRepository;
    private final PersonRepository personRepository;
    private final WorkerWebSocketHandler workerWebSocketHandler;

    @Transactional
    public Worker saveWorker(WorkerDTORequest workerDTORequest, User user) {
        try {
            Worker worker = new Worker();
            worker.setName(workerDTORequest.getName());

            if(workerDTORequest.getCoordinatesWrapper().getCoordinatesId() != null) {
                Coordinates existingCoordinates = coordinatesRepository.findById(workerDTORequest.getCoordinatesWrapper().getCoordinatesId());
                worker.setCoordinates(existingCoordinates);
            } else if (workerDTORequest.getCoordinatesWrapper().getCoordinates() != null) {
                Coordinates newCoordinates = workerDTORequest.getCoordinatesWrapper().getCoordinates();
                newCoordinates.setOwner(user);
                coordinatesRepository.save(newCoordinates);
                worker.setCoordinates(newCoordinates);
            }

            if(workerDTORequest.getOrganizationWrapper() != null && workerDTORequest.getOrganizationWrapper().getOrganizationId() != null) {
                Organization existingOrganization = organizationRepository.findById(workerDTORequest.getOrganizationWrapper().getOrganizationId());
                worker.setOrganization(existingOrganization);
            } else if (workerDTORequest.getOrganizationWrapper() != null && workerDTORequest.getOrganizationWrapper().getOrganization() != null) {
                Organization newOrganization = workerDTORequest.getOrganizationWrapper().getOrganization();
                newOrganization.setOwner(user);
                organizationRepository.save(newOrganization);
                worker.setOrganization(newOrganization);
            }

            if(workerDTORequest.getPersonWrapper() != null && workerDTORequest.getPersonWrapper().getPersonId() != null) {
                Person existingPerson = personRepository.findById(workerDTORequest.getPersonWrapper().getPersonId());
                worker.setPerson(existingPerson);
            } else if (workerDTORequest.getPersonWrapper() != null && workerDTORequest.getPersonWrapper().getPerson() != null) {
                Person newPerson = workerDTORequest.getPersonWrapper().getPerson();
                newPerson.setOwner(user);
                personRepository.save(newPerson);
                worker.setPerson(newPerson);
            }

            worker.setSalary(workerDTORequest.getSalary());
            worker.setRating(workerDTORequest.getRating());
            worker.setPosition(Position.valueOf(workerDTORequest.getPosition()));
            try {
                worker.setStatus(Status.valueOf(workerDTORequest.getStatus()));
            } catch (Exception e) {
                worker.setStatus(null);
            }
            workerRepository.save(worker);
            workerWebSocketHandler.sendUpdate("create", DTOUtil.convertToResponse(worker));
            return worker;
        } catch (HibernateException e) {
            throw new RuntimeException("Не удалось сохранить рабочего", e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public List<Worker> getAllWorkers() {
        try {
            return workerRepository.findAll();
        } catch (HibernateException e) {
            throw new RuntimeException("Не удалось получить всех рабочих", e);
        }
    }

    public Worker getWorkerById(long id) {
        try {
            Worker worker = workerRepository.findById(id);

            if(worker == null) {
                throw new IllegalArgumentException("Работник с id " + id + " не найден");
            }
            return worker;
        } catch (Exception e) {
            throw new ResourceNotFoundException("Нет такого работника");
        }
    }

    @Transactional
    public Worker updateWorker(Worker worker, WorkerDTORequest workerDTORequest, User user) {
        try {
            if(worker == null) {
                throw new IllegalArgumentException("Работник с таким id не найден");
            }
            worker.setName(workerDTORequest.getName());
            worker.setSalary(workerDTORequest.getSalary());
            worker.setRating(workerDTORequest.getRating());
            worker.setPosition(Position.valueOf(workerDTORequest.getPosition()));

            if(workerDTORequest.getStatus() == null || workerDTORequest.getStatus().isEmpty()) {
                worker.setStatus(null);
            } else {
                worker.setStatus(Status.valueOf(workerDTORequest.getStatus()));
            }

            Coordinates coordinates = workerDTORequest.getCoordinatesWrapper().getCoordinates();
            if(coordinates != null) {
                coordinatesRepository.update(coordinates);
                worker.setCoordinates(coordinates);
            }

            Organization organization = workerDTORequest.getOrganizationWrapper().getOrganization();
            if(organization != null) {
                organizationRepository.update(organization);
                worker.setOrganization(organization);
            }
            Person person = workerDTORequest.getPersonWrapper().getPerson();
            if(person != null) {
                personRepository.update(person);
                worker.setPerson(person);
            }

            worker.setUpdatedBy(user);

            workerRepository.update(worker);
            workerWebSocketHandler.sendUpdate("update", DTOUtil.convertToResponse(worker));
            return worker;
        } catch (HibernateException e) {
            throw new RuntimeException("Не удалось обновить рабочего", e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Transactional
    public void deleteWorkerById(long id) {
        Worker worker = workerRepository.findById(id);

        if(worker.getCoordinates() != null) {
            Coordinates coordinates = worker.getCoordinates();
            worker.setCoordinates(null);
            coordinatesRepository.delete(coordinates);
        }

        if(worker.getOrganization() != null) {
            Organization organization = worker.getOrganization();
            worker.setOrganization(null);
            organizationRepository.delete(organization);
        }

        if(worker.getPerson() != null) {
            Person person = worker.getPerson();
            worker.setPerson(null);
            personRepository.delete(person);
        }

        workerRepository.delete(worker);

        try {
            workerWebSocketHandler.sendUpdate("delete", id);
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

}
