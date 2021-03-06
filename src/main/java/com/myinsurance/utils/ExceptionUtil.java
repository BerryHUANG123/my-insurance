package com.myinsurance.utils;

public final class ExceptionUtil {

    public static String getExceptionAllinformation(Exception ex) {
        String sOut = ex.getClass().getName();
        StackTraceElement[] trace = ex.getStackTrace();
        for (StackTraceElement s : trace) {
            sOut += "\r\n" + "\tat " + s;
        }
        return sOut;
    }
}
