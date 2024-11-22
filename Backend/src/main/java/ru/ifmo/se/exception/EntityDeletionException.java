package ru.ifmo.se.exception;

public class EntityDeletionException extends RuntimeException {
    public EntityDeletionException(String message) {
        super(message);
    }
}
