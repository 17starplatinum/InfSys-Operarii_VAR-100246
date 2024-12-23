package ru.ifmo.se.service.info;

public interface TwoPCResource {
    void prepare() throws Exception;
    void commit() throws Exception;
    void rollback() throws Exception;
}
