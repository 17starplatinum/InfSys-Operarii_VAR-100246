package ru.ifmo.se.service.data;

import ru.ifmo.se.entity.user.User;
import ru.ifmo.se.entity.data.Address;
import ru.ifmo.se.repository.data.AddressRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class AddressService {
    private final AddressRepository addressRepository;

    public List<Address> getAllAddressesByUser(User user) {
        return addressRepository.findByOwner(user);
    }
}
