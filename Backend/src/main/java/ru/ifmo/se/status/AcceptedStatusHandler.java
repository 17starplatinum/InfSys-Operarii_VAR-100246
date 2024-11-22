package ru.ifmo.se.status;

import org.springframework.stereotype.Component;

@Component("ACCEPTED")
public class AcceptedStatusHandler implements AdminRequestStatusHandler {

    @Override
    public String getStatusMessage() {
        return "Accepted. You are now an admin.";
    }
}
