package ru.ifmo.se.status;

import org.springframework.stereotype.Component;

@Component("PENDING")
public class PendingStatusHandler implements AdminRequestStatusHandler {
    @Override
    public String getStatusMessage() {
        return "Your application request has not been processed yet.";
    }
}
