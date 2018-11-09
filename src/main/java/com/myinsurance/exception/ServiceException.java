package com.myinsurance.exception;

public class ServiceException extends RuntimeException {

    //构造器
    public ServiceException(String message) {
        super(message);
    }
}
