package ru.ifmo.se.controller;

import ru.ifmo.se.dto.data.AddressDTOwID;
import ru.ifmo.se.entity.data.Address;
import ru.ifmo.se.entity.user.User;
import ru.ifmo.se.service.data.AddressService;
import ru.ifmo.se.util.DTOUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {
    private final AddressService addressService;
    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @GetMapping
    public ResponseEntity<AddressDTOwID> getUserAddresses() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = (User) auth.getPrincipal();

            List<Address> addresses = addressService.getAllAddressesByUser(user);

            List<AddressDTOwID> response = addresses.stream()
                    .map(DTOUtil::convertToAddressDTOwIDResponse)
                    .collect(Collectors.toList());
            return ResponseEntity.ok((AddressDTOwID) response);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
