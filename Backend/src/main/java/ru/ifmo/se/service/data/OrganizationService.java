package ru.ifmo.se.service.data;

import ru.ifmo.se.entity.data.enumerated.OrganizationType;
import ru.ifmo.se.entity.user.User;
import ru.ifmo.se.entity.data.Organization;
import ru.ifmo.se.entity.data.Address;
import ru.ifmo.se.dto.data.OrganizationDTOwID;
import ru.ifmo.se.exception.ResourceNotFoundException;
import ru.ifmo.se.repository.data.OrganizationRepository;
import ru.ifmo.se.repository.data.AddressRepository;

import org.hibernate.HibernateException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class OrganizationService {
    private final OrganizationRepository organizationRepository;
    private final AddressRepository addressRepository;

    @Transactional
    public Organization saveOrganization(OrganizationDTOwID organizationDTOwID, User user) {
        try {
            Organization organization = new Organization();
            if (organizationDTOwID.getOfficialAddressWrapper().getAddressId() != null) {
                Address existingAddress = organizationDTOwID.getOfficialAddressWrapper().getAddress();
                organization.setOfficialAddress(existingAddress);
            } else if (organizationDTOwID.getOfficialAddressWrapper().getAddress() != null) {
                Address newAddress = organizationDTOwID.getOfficialAddressWrapper().getAddress();
                newAddress.setOwner(user);
                organizationRepository.save(organization);
                organization.setOfficialAddress(newAddress);
            }
            organization.setAnnualTurnover(organizationDTOwID.getAnnualTurnover());
            try {
                organization.setEmployeesCount(organizationDTOwID.getEmployeesCount());
            } catch (Exception e) {
                organization.setEmployeesCountwNull(null);
            }
            try {
                organization.setFullName(organizationDTOwID.getFullName());
            } catch (Exception e) {
                organization.setFullName(null);
            }
            try {
                organization.setType(OrganizationType.valueOf(organizationDTOwID.getType()));
            } catch (Exception e) {
                organization.setType(null);
            }
            if (organizationDTOwID.getPostalAddressWrapper().getAddressId() != null) {
                Address existingAddress = organizationDTOwID.getPostalAddressWrapper().getAddress();
                organization.setPostalAddress(existingAddress);
            } else if (organizationDTOwID.getPostalAddressWrapper().getAddress() != null) {
                Address newAddress = organizationDTOwID.getPostalAddressWrapper().getAddress();
                newAddress.setOwner(user);
                organizationRepository.save(organization);
                organization.setPostalAddress(newAddress);
            }
            organizationRepository.save(organization);
            return organization;
        } catch (HibernateException e) {
            throw new RuntimeException("Error while saving organization", e);
        }
    }
    public List<Organization> getAllOrganizations() {
        try {
            return organizationRepository.findAll();
        } catch (HibernateException e) {
            throw new RuntimeException("Error while getting all organizations", e);
        }
    }

    public Organization getOrganizationById(long id) {
        try {
            Organization organization = organizationRepository.findById(id);

            if (organization == null) {
                throw new ResourceNotFoundException("Organization with id " + id + " not found");
            }
            return organization;
        } catch (Exception e) {
            throw new ResourceNotFoundException("There's no such organization with id = " + id);
        }
    }

    @Transactional
    public Organization updateOrganization(Organization organization, OrganizationDTOwID organizationDTOwID, User user) {
        try {
            if(organization == null) {
                throw new IllegalArgumentException("Address with this id not found");
            }

            Address officialAddress = organizationDTOwID.getOfficialAddressWrapper().getAddress();
            if(officialAddress != null) {

                addressRepository.update(officialAddress);
                organization.setOfficialAddress(officialAddress);
            }
            organization.setAnnualTurnover(organizationDTOwID.getAnnualTurnover());
            organization.setEmployeesCount(organizationDTOwID.getEmployeesCount());
            if(organizationDTOwID.getFullName() == null || organizationDTOwID.getFullName().isEmpty()) {
                organization.setFullName(null);
            } else {
                organization.setFullName(organizationDTOwID.getFullName());
            }
            if(organizationDTOwID.getType() == null || organizationDTOwID.getType().isEmpty()) {
                organization.setType(null);
            } else {
                organization.setType(OrganizationType.valueOf(organizationDTOwID.getType()));
            }
            Address postalAddress = organizationDTOwID.getPostalAddressWrapper().getAddress();
            if(postalAddress != null) {

                addressRepository.update(officialAddress);
                organization.setOfficialAddress(officialAddress);
            }
            organizationRepository.update(organization);
            return organization;
        } catch (HibernateException e) {
            throw new RuntimeException("Error while updating organization", e);
        }
    }

    public List<Organization> getAllOrganizationByUser(User user) {
        return organizationRepository.findByOwner(user);
    }

    @Transactional
    public void deleteOrganizationById(Long id) {
        Organization organization = organizationRepository.findById(id);

        if(organization.getOfficialAddress() != null) {
            Address officialAddress = organization.getOfficialAddress();
            organization.setOfficialAddress(null);
            addressRepository.delete(officialAddress);
        }

        if (organization.getPostalAddress() != null) {
            Address postalAddress = organization.getPostalAddress();
            organization.setPostalAddress(null);
            addressRepository.delete(postalAddress);
        }

        organizationRepository.delete(organization);
    }
}
