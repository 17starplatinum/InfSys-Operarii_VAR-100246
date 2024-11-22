package ru.ifmo.se.util.filter;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import ru.ifmo.se.dto.data.AddressDTO;
import ru.ifmo.se.dto.data.filter.AddressFilterCriteria;
import ru.ifmo.se.repository.data.AddressRepository;
import ru.ifmo.se.util.EntityMapper;

@Component
@RequiredArgsConstructor
public class AddressFilterProcessor implements FilterProcessor<AddressDTO, AddressFilterCriteria> {
    private final EntityMapper entityMapper;
    private final AddressRepository addressRepository;

    @Override
    public Page<AddressDTO> filter(AddressFilterCriteria criteria, Pageable pageable) {
        if (criteria.getZipCode() == null || criteria.getZipCode().isEmpty()) {
            return addressRepository.findAll(pageable).map(entityMapper::toAddressDTO);
        } else {
            return addressRepository.findByZipCodeContaining(criteria.getZipCode(), pageable).map(entityMapper::toAddressDTO);
        }
    }
}
