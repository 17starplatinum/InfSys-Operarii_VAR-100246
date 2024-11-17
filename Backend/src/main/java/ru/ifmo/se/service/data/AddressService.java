package ru.ifmo.se.service.data;

import ru.ifmo.se.dto.data.AddressDTOwID;
import ru.ifmo.se.entity.user.User;
import ru.ifmo.se.entity.data.Address;
import ru.ifmo.se.entity.data.Location;
import ru.ifmo.se.exception.ResourceNotFoundException;
import ru.ifmo.se.repository.data.AddressRepository;
import ru.ifmo.se.repository.data.LocationRepository;

import org.hibernate.HibernateException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class AddressService {
    private final AddressRepository addressRepository;
    private final LocationRepository locationRepository;

    @Transactional
    public Address saveAddress(AddressDTOwID addressDTOwID, User user) {
        try {
            Address address = new Address();
            address.setZipCode(addressDTOwID.getZipCode());
            if (addressDTOwID.getLocationWrapper().getLocationId() != null) {
                Location existingLocation = locationRepository.findById(addressDTOwID.getLocationWrapper().getLocationId());
                address.setTown(existingLocation);
            } else if (addressDTOwID.getLocationWrapper().getLocation() != null) {
                Location newTown = addressDTOwID.getLocationWrapper().getLocation();
                newTown.setOwner(user);
                addressRepository.save(address);
                address.setTown(newTown);
            }
            address.setZipCode(addressDTOwID.getZipCode());
            return address;
        } catch (HibernateException e) {
            throw new HibernateException("Failed to save address", e);
        }
    }

    public List<Address> getAllAddressesByUser(User user) {
        return addressRepository.findByOwner(user);
    }

    public Address getAddressById(long id) {
        try {
            Address address = addressRepository.findById(id);
            if (address == null) {
                throw new ResourceNotFoundException("Address with id = " + id + " not found");
            }
            return address;
        } catch (Exception e) {
            throw new ResourceNotFoundException("No such address exists");
        }
    }

    @Transactional
    public Address updateAddress(Address address, AddressDTOwID addressDTOwID) {
        try {
            if(address == null) {
                throw new IllegalArgumentException("Address with this ID not found");
            }
            address.setZipCode(addressDTOwID.getZipCode());
            Location town = addressDTOwID.getLocationWrapper().getLocation();
            if(town == null) {
                locationRepository.update(null);
                address.setTown(null);
            } else {
                locationRepository.update(town);
                address.setTown(town);
            }

            addressRepository.update(address);
            return address;
        } catch (HibernateException e) {
            throw new HibernateException("Failed to update address", e);
        }
    }

    @Transactional
    public void deleteAddressById(long id) {
        Address address = addressRepository.findById(id);
        addressRepository.delete(address);
    }
}
