package ru.ifmo.se.util;

import ru.ifmo.se.dto.data.*;
import ru.ifmo.se.dto.data.response.*;
import ru.ifmo.se.dto.data.wrappers.AddressWrapper;
import ru.ifmo.se.dto.data.wrappers.LocationWrapper;
import ru.ifmo.se.entity.data.*;
import org.springframework.stereotype.Service;

@Service
public class DTOUtil {
    public static WorkerDTOResponse convertToResponse(Worker worker) {
        WorkerDTOResponse response = new WorkerDTOResponse();
        response.setId(worker.getId());
        response.setName(worker.getName());
        CoordinatesDTOResponse coordinatesDTOResponse = new CoordinatesDTOResponse();
        coordinatesDTOResponse.setX(worker.getCoordinates().getX());
        coordinatesDTOResponse.setY(worker.getCoordinates().getY());
        response.setCoordinates(coordinatesDTOResponse);

        LocationDTOResponse townDTOResponse = new LocationDTOResponse();
        townDTOResponse.setX(worker.getOrganization().getOfficialAddress().getTown().getX());
        townDTOResponse.setY(worker.getOrganization().getOfficialAddress().getTown().getY());
        townDTOResponse.setZ(worker.getOrganization().getOfficialAddress().getTown().getZ());

        LocationDTOResponse locationDTOResponse = new LocationDTOResponse();
        locationDTOResponse.setX(worker.getPerson().getLocation().getX());
        locationDTOResponse.setY(worker.getPerson().getLocation().getY());
        locationDTOResponse.setZ(worker.getPerson().getLocation().getZ());

        AddressDTOResponse officialDTOResponse = new AddressDTOResponse();
        officialDTOResponse.setZipCode(worker.getOrganization().getOfficialAddress().getZipCode());
        officialDTOResponse.setTown(townDTOResponse);

        AddressDTOResponse postalDTOResponse = new AddressDTOResponse();
        postalDTOResponse.setZipCode(worker.getOrganization().getPostalAddress().getZipCode());
        postalDTOResponse.setTown(townDTOResponse);

        OrganizationDTOResponse organizationDTOResponse = new OrganizationDTOResponse();
        organizationDTOResponse.setOfficialAddress(officialDTOResponse);
        organizationDTOResponse.setAnnualTurnover(worker.getOrganization().getAnnualTurnover());
        organizationDTOResponse.setEmployeesCount(worker.getOrganization().getEmployeesCount());
        organizationDTOResponse.setFullName(worker.getOrganization().getFullName());
        if(worker.getOrganization().getType() != null) {
            organizationDTOResponse.setType(String.valueOf(worker.getOrganization().getType()));
        } else {
            organizationDTOResponse.setType(null);
        }
        organizationDTOResponse.setPostalAddress(postalDTOResponse);
        response.setOrganization(organizationDTOResponse);

        PersonDTOResponse personDTOResponse = new PersonDTOResponse();
        personDTOResponse.setEyeColor(String.valueOf(worker.getPerson().getEyeColor()));
        if(worker.getPerson().getHairColor() != null) {
            personDTOResponse.setHairColor(String.valueOf(worker.getPerson().getHairColor()));
        } else {
            personDTOResponse.setHairColor(null);
        }
        personDTOResponse.setLocation(locationDTOResponse);
        personDTOResponse.setBirthday(worker.getPerson().getBirthday().toString());
        personDTOResponse.setWeight(worker.getPerson().getWeight());
        personDTOResponse.setNationality(String.valueOf(worker.getPerson().getNationality()));
        response.setPerson(personDTOResponse);

        response.setSalary(worker.getSalary());
        response.setRating(worker.getRating());
        response.setStatus(String.valueOf(worker.getStatus()));
        response.setPosition(String.valueOf(worker.getPosition()));
        return response;
    }

    public static LocationDTOwID convertToLocationDTOwIDResponse(Location location) {
        LocationDTOwID locationDTOwID = new LocationDTOwID();
        locationDTOwID.setId(location.getId());
        locationDTOwID.setX(location.getX());
        locationDTOwID.setY(location.getY());
        locationDTOwID.setZ(location.getZ());
        return locationDTOwID;
    }

    public static AddressDTOwID convertToAddressDTOwIDResponse(Address address) {
        AddressDTOwID addressDTOwID = new AddressDTOwID();
        addressDTOwID.setId(address.getId());
        addressDTOwID.setZipCode(address.getZipCode());
        addressDTOwID.setLocationWrapper(new LocationWrapper(address.getTown().getId(), address.getTown()));
        return addressDTOwID;
    }

    public static CoordinatesDTOwID convertToCoordinatesDTOwIDResponse(Coordinates coordinates) {
        CoordinatesDTOwID coordinatesDTOwID = new CoordinatesDTOwID();
        coordinatesDTOwID.setId(coordinates.getId());
        coordinatesDTOwID.setX(coordinates.getX());
        coordinatesDTOwID.setY(coordinates.getY());
        return coordinatesDTOwID;
    }

    public static OrganizationDTOwID convertToOrganizationDTOwIDResponse(Organization organization) {
        OrganizationDTOwID organizationDTOwID = new OrganizationDTOwID();
        organizationDTOwID.setId(organization.getId());
        organizationDTOwID.setOfficialAddressWrapper(new AddressWrapper(organization.getOfficialAddress().getId(), organization.getOfficialAddress()));
        organizationDTOwID.setAnnualTurnover(organization.getAnnualTurnover());
        organizationDTOwID.setEmployeesCount(organization.getEmployeesCount());
        organizationDTOwID.setFullName(organization.getFullName());
        organizationDTOwID.setType(String.valueOf(organization.getType()));
        organizationDTOwID.setPostalAddressWrapper(new AddressWrapper(organization.getPostalAddress().getId(), organization.getPostalAddress()));
        return organizationDTOwID;
    }

    public static PersonDTOwID convertToPersonDTOwIDResponse(Person person) {
        PersonDTOwID personDTOwID = new PersonDTOwID();
        personDTOwID.setId(person.getId());
        personDTOwID.setEyeColor(String.valueOf(person.getEyeColor()));
        personDTOwID.setHairColor(String.valueOf(person.getHairColor()));
        personDTOwID.setBirthday(person.getBirthday().toString());
        personDTOwID.setLocationWrapper(new LocationWrapper(person.getLocation().getId(), person.getLocation()));
        personDTOwID.setWeight(person.getWeight());
        personDTOwID.setNationality(String.valueOf(person.getNationality()));
        return personDTOwID;
    }
}
