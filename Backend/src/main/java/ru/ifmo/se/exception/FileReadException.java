package ru.ifmo.se.exception;

public class FileReadException extends RuntimeException {
    public FileReadException(String message) {
        super(message);
    }
}
