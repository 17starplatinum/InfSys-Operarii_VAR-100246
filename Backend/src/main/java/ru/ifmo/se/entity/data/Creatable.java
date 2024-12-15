package ru.ifmo.se.entity.data;

import ru.ifmo.se.entity.user.User;

public interface Creatable {
    User getCreatedBy();
}
