package ru.ifmo.se.status;

import org.springframework.stereotype.Component;

@Component("NONE")
public class NoneStatusHandler implements AdminRequestStatusHandler {
    @Override
    public String getStatusMessage() {
        return "You haven't sent an application for an admin yet.";
    }
}
