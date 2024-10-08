package ru.ifmo.se.util;

import ru.ifmo.se.dto.WorkerDTO;
import ru.ifmo.se.entity.Worker;

import org.springframework.stereotype.Component;

@Component
public class EntityMapper {

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
