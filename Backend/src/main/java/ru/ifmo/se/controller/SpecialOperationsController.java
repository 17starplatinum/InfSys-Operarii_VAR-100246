package ru.ifmo.se.controller;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import ru.ifmo.se.dto.data.MusicDTOResponse;
import ru.ifmo.se.dto.data.response.WorkerDTOResponse;
import ru.ifmo.se.entity.user.User;
import ru.ifmo.se.entity.data.Worker;
import ru.ifmo.se.service.data.MusicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import ru.ifmo.se.service.data.WorkerService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/special")
@RequiredArgsConstructor
public class SpecialOperationsController {
    private final WorkerService workerService;
/*
 * - Удалить один (любой) объект, значение поля person которого эквивалентно заданному.
 * - Вернуть количество объектов, значение поля person которых равно заданному.
 * - Вернуть количество объектов, значение поля rating которых меньше заданного.
 * - Уволить сотрудника с заданным id из организации.
 * - Переместить сотрудника из одной организации в другую с сохранением должности и заработной платы.
 */
    @PostMapping("/remove-worker-by-person")
    public ResponseEntity<Void> removeWorkerByPerson(@RequestParam("workerId") long personId) throws IOException {
        Worker existingWorker = workerService.getWorkerByPerson(personId);
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        if(!existingWorker.getOwner().getId().equals(user.getId()) && user.getAuthorities().stream().noneMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"))) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        workerService.deleteWorkerByPerson(personId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/count-workers-with-equal-person")
    public ResponseEntity<Long> countWorkersWithEqualPerson(@RequestParam("personId") long personId) {
        return ResponseEntity.ok(workerService.getWorkersByPerson(personId));
    }

    @GetMapping("/count-ratings-less-than")
    public ResponseEntity<Long> countRatingsLessThan(@RequestParam("rating") int reting) {
        return ResponseEntity.ok(workerService.countRatingsLessThan(reting));
    }

    @GetMapping("/fire-worker-from-org")
    public ResponseEntity<Void> fireWorkerFromOrganization(@RequestParam long id) {
        Worker existingWorker = workerService.getWorkerById(id);
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        if(!existingWorker.getOwner().getId().equals(user.getId()) && user.getAuthorities().stream().noneMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"))) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        workerService.fireWorkerFromOrganization(id);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/transfer-worker-between-orgs")
    public ResponseEntity<Void> transferWorkerBetweenOrgs(@RequestParam long workerId, @RequestParam long toId) {
        Worker existingWorker = workerService.getWorkerById(workerId);
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        if(!existingWorker.getOwner().getId().equals(user.getId()) && user.getAuthorities().stream().noneMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"))) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        workerService.transferWorkerToOrganization(workerId, toId);
        return ResponseEntity.ok().build();
    }

}
