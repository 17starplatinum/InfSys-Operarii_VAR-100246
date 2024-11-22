package ru.ifmo.se.status;

import org.springframework.stereotype.Component;

@Component("REJECTED")
public class RejectedStatusHandler implements AdminRequestStatusHandler {
    @Override
    public String getStatusMessage() {
        return "Your application request has been rejected.";
    }
}
