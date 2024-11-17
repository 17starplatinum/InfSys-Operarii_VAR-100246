package ru.ifmo.se.exception;

import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
public class ErrorDetails {
    private Date timeStamp;
    private String message;
    private String details;
}
