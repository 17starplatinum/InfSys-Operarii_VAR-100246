package ru.ifmo.se.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.ifmo.se.dto.PaginationResponseDTO;
import ru.ifmo.se.dto.data.AddressDTO;
import ru.ifmo.se.service.data.AddressService;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {
    private final AddressService addressService;

    @GetMapping
    public ResponseEntity<PaginationResponseDTO<AddressDTO>> getAllAddresses(
            @RequestParam(required = false) String zipCode,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection
    ) {
        Page<AddressDTO> peoplePage = addressService.getAllAddresses(zipCode, page, size, sortBy, sortDirection);
        PaginationResponseDTO<AddressDTO> responseDTO = new PaginationResponseDTO<>(
                peoplePage.getContent(),
                peoplePage.getNumber(),
                peoplePage.getTotalElements(),
                peoplePage.getTotalPages()
        );
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AddressDTO> getAddressById(@PathVariable Long id) {
        return ResponseEntity.ok(addressService.getAddressById(id));
    }

    @PostMapping
    public ResponseEntity<AddressDTO> createAddress(@RequestBody AddressDTO addressDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(addressService.createAddress(addressDTO));
    }

    @PutMapping
    public ResponseEntity<AddressDTO> updateAddress(@RequestBody AddressDTO addressDTO) {
        return ResponseEntity.ok(addressService.updateAddress(addressDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<AddressDTO> deleteAddress(@PathVariable Long id) {
        addressService.deleteAddress(id);
        return ResponseEntity.noContent().build();
    }
}
