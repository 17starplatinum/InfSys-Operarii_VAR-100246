package ru.ifmo.se.exception.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class APIError {
    private int status;
    private String message;
    private String details;
}
