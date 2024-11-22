package ru.ifmo.se.dto.data.filter;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddressFilterCriteria {
    private String zipCode;
}
