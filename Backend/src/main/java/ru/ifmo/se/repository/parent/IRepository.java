package ru.ifmo.se.repository.parent;

import java.util.List;

public interface IRepository<T> {
    public void add(T t);
    public T find(long Id);
    public List<T> getAll();
    public void update(T t);
    public void delete(T t);
}
