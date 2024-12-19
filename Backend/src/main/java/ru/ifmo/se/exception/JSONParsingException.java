package ru.ifmo.se.exception;

public class JSONParsingException extends RuntimeException {
    public JSONParsingException(String message, Throwable cause) {
        super(message, cause);
    }
}
