package ru.ifmo.se.service.data;

import ru.ifmo.se.dto.data.AddressDTOwID;
import ru.ifmo.se.entity.user.User;
import ru.ifmo.se.entity.data.Address;
import ru.ifmo.se.entity.data.Location;
import ru.ifmo.se.repository.data.AddressRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.ifmo.se.repository.data.LocationRepository;

import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class AddressService {
    private final AddressRepository addressRepository;
    private final LocationRepository locationRepository;

    @Transactional
    public Address saveAddress(AddressDTOwID addressDTOwID, User user) {
        Address address = new Address();
        address.setZipCode(addressDTOwID.getZipCode());
        if(addressDTOwID.getLocationWrapper().getLocationId() != null) {
            Location existingLocation = locationRepository.findById(addressDTOwID.getLocationWrapper().getLocationId());
            address.setTown(existingLocation);
        } else if (addressDTOwID.getLocationWrapper().getLocation() != null) {
            Location newTown = addressDTOwID.getLocationWrapper().getLocation();
            newTown.setOwner(user);
            addressRepository.save(address);
            address.setTown(newTown);
        }
    }

    public List<Address> getAllAddressesByUser(User user) {
        return addressRepository.findByOwner(user);
    }
}
