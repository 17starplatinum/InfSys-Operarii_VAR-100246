package ru.ifmo.se.service.storage;

public interface TwoPCResource {
    void prepare() throws Exception;
    void commit() throws Exception;
    void rollback() throws Exception;
}
