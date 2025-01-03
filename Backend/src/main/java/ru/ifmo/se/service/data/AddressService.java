package ru.ifmo.se.service.data;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.ifmo.se.dto.data.AddressDTO;
import ru.ifmo.se.dto.data.filter.AddressFilterCriteria;
import ru.ifmo.se.entity.data.Address;
import ru.ifmo.se.entity.data.Location;
import ru.ifmo.se.entity.data.audit.AuditOperation;
import ru.ifmo.se.repository.data.AddressRepository;
import ru.ifmo.se.service.data.audit.AuditService;
import ru.ifmo.se.service.user.UserService;
import ru.ifmo.se.util.EntityMapper;
import ru.ifmo.se.util.filter.AddressFilterProcessor;
import ru.ifmo.se.util.filter.FilterProcessor;
import ru.ifmo.se.util.pagination.PaginationHandler;

@Service
@RequiredArgsConstructor
public class AddressService {
    private AddressRepository addressRepository;
    private UserService userService;
    private AuditService auditService;
    private EntityMapper entityMapper;
    private PaginationHandler paginationHandler;
    private LocationService locationService;
    private FilterProcessor<AddressDTO, AddressFilterCriteria> addressFilterProcessor;

    private static final String NOT_FOUND_MESSAGE = "Address not found";
    @Autowired
    public void setAddressRepository(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    @Autowired
    public void setAuditService(AuditService auditService) {
        this.auditService = auditService;
    }

    @Autowired
    public void setEntityMapper(EntityMapper entityMapper) {
        this.entityMapper = entityMapper;
    }

    @Autowired
    public void setPaginationHandler(PaginationHandler paginationHandler) {
        this.paginationHandler = paginationHandler;
    }

    @Autowired
    public void setLocationService(LocationService locationService) {
        this.locationService = locationService;
    }

    @Autowired
    public void setAddressFilterProcessor(AddressFilterProcessor addressFilterProcessor) {
        this.addressFilterProcessor = addressFilterProcessor;
    }

    @Transactional(readOnly = true)
    public Page<AddressDTO> getAllAddresses(String zipCode, int page, int size, String sortBy, String sortDirection) {
        AddressFilterCriteria addressFilterCriteria = new AddressFilterCriteria();
        addressFilterCriteria.setZipCode(zipCode);
        Pageable pageable = paginationHandler.createPageable(page, size, sortBy, sortDirection);
        return addressFilterProcessor.filter(addressFilterCriteria, pageable);
    }

    @Transactional(readOnly = true)
    public AddressDTO getAddressById(Long id) {
        Address address = addressRepository.findById(id).orElseThrow(() -> new IllegalArgumentException(NOT_FOUND_MESSAGE));
        return entityMapper.toAddressDTO(address);
    }

    @Transactional
    public AddressDTO createAddress(AddressDTO addressDTO) {
        Location savedLocation = locationService.createOrUpdateLocationForObjects(addressDTO.getTown());
        Address address = entityMapper.toAddressEntity(addressDTO, savedLocation);
        address.setCreatedBy(userService.getCurrentUser());
        Address savedAddress = addressRepository.save(address);
        auditService.auditAddress(savedAddress, AuditOperation.CREATE);
        return entityMapper.toAddressDTO(savedAddress);
    }

    @Transactional
    public AddressDTO updateAddress(Long id, AddressDTO addressDTO) {
        Address address = addressRepository.findById(id).orElseThrow(() -> new IllegalArgumentException(NOT_FOUND_MESSAGE));

        if (userService.cantModifyEntity(address)) {
            throw new IllegalArgumentException("You are not allowed to modify this Address.");
        }

        address.setZipCode(addressDTO.getZipCode());
        address.setTown(locationService.createOrUpdateLocationForObjects(addressDTO.getTown()));

        Address savedAddress = addressRepository.save(address);
        auditService.auditAddress(savedAddress, AuditOperation.UPDATE);
        return entityMapper.toAddressDTO(savedAddress);
    }

    @Transactional
    public void deleteAddress(Long id) {
        Address address = addressRepository.findById(id).orElseThrow(() -> new IllegalArgumentException(NOT_FOUND_MESSAGE));
        if (userService.cantModifyEntity(address)) {
            throw new IllegalArgumentException("You are not allowed to delete this Address.");
        }
        auditService.deleteAddressAudits(address.getId());
        addressRepository.delete(address);
    }

    @Transactional
    public Address createOrUpdateAddressForOrganization(AddressDTO addressDTO) {
        Location town = (addressDTO == null) ?
                locationService.createOrUpdateLocationForObjects(null) :
                locationService.createOrUpdateLocationForObjects(addressDTO.getTown());
        if (addressDTO.getId() != null) {
            Address existingAddress = addressRepository.findById(addressDTO.getId()).orElseThrow(() -> new IllegalArgumentException(NOT_FOUND_MESSAGE));
            if (userService.cantModifyEntity(existingAddress)) {
                throw new IllegalArgumentException("You are not allowed to modify this Address.");
            }
            existingAddress.setZipCode(addressDTO.getZipCode());
            existingAddress.setTown(town);

            Address savedAddress = addressRepository.save(existingAddress);
            auditService.auditAddress(savedAddress, AuditOperation.UPDATE);
            return savedAddress;
        } else {
            Address address = entityMapper.toAddressEntity(addressDTO, town);
            address.setCreatedBy(userService.getCurrentUser());
            Address savedAddress = addressRepository.save(address);
            auditService.auditAddress(savedAddress, AuditOperation.CREATE);
            return savedAddress;
        }
    }
}
