package ru.ifmo.se.validators;

import ru.ifmo.se.dto.data.wrappers.*;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ObjectValidator implements ConstraintValidator<ValidObject, Object>{
    @Override
    public void initialize(ValidObject constraintAnnotation) {

    }

    @Override
    public boolean isValid(Object value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }

        if (value instanceof CoordinatesWrapper) {
            CoordinatesWrapper wrapper = (CoordinatesWrapper) value;
            return validateWrapper(wrapper.getCoordinatesId(), wrapper.getCoordinates(), context, "Coordinates");
        }

        if (value instanceof AddressWrapper) {
            AddressWrapper wrapper = (AddressWrapper) value;
            return validateWrapper(wrapper.getAddressId(), wrapper.getAddress(), context, "Address");
        }

        if (value instanceof LocationWrapper) {
            LocationWrapper wrapper = (LocationWrapper) value;
            return validateWrapper(wrapper.getLocationId(), wrapper.getLocation(), context, "Location");
        }

        if (value instanceof OrganizationWrapper) {
            OrganizationWrapper wrapper = (OrganizationWrapper) value;
            return validateWrapper(wrapper.getOrganizationId(), wrapper.getOrganization(), context, "Organization");
        }
        if (value instanceof PersonWrapper) {
            PersonWrapper wrapper = (PersonWrapper) value;
            return validateWrapper(wrapper.getPersonId(), wrapper.getPerson(), context, "Person");
        }
        return false;
    }

    private boolean validateWrapper(Long id, Object obj, ConstraintValidatorContext context, String objectName) {
        if (id != null) {
            return true;
        } else if (obj != null) {
            return true;
        } else {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(objectName + " cannot be null when no ID is provided")
                    .addConstraintViolation();
            return false;
        }
    }
}
