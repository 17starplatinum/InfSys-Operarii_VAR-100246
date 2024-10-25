package ru.ifmo.se.util;

import ru.ifmo.se.dto.WorkerDTO;
import ru.ifmo.se.dto.CoordinatesDTO;
import ru.ifmo.se.dto.PersonDTO;
import ru.ifmo.se.dto.OrganizationDTO;
import ru.ifmo.se.dto.LocationDTO;
import ru.ifmo.se.dto.AddressDTO;
import ru.ifmo.se.entity.*;
import ru.ifmo.se.service.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class EntityMapper {
    //TODO: абсолютная хуйня
    public WorkerDTO toWorkerDTO(Worker worker) {
        WorkerDTO workerDTO = new WorkerDTO();
        workerDTO.setName(worker.getName());
        workerDTO.setCoordinates(worker.getCoordinates());
        workerDTO.setCreationDate(worker.getCreationDate());
        workerDTO.setOrganization(worker.getOrganization());
        workerDTO.setSalary(worker.getSalary());
        workerDTO.setRating(worker.getRating());
        workerDTO.setPosition(worker.getPosition());
        workerDTO.setStatus(worker.getStatus());
        workerDTO.setPerson(worker.getPerson());
        workerDTO.setCreator(worker.getCreator());
        return workerDTO;
    }

    public Worker toWorkerEntity(WorkerDTO workerDTO) {
        Worker worker = new Worker();
        worker.setName(workerDTO.getName());
        worker.setCoordinates(workerDTO.getCoordinates());
        worker.setCreationDate(workerDTO.getCreationDate());
        worker.setOrganization(workerDTO.getOrganization());
        worker.setSalary(workerDTO.getSalary());
        worker.setRating(workerDTO.getRating());
        worker.setPosition(workerDTO.getPosition());
        worker.setStatus(workerDTO.getStatus());
        worker.setPerson(workerDTO.getPerson());
        worker.setCreator(workerDTO.getCreator());
        return worker;
    }
}
