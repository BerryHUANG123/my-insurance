package com.myinsurance.utils;

import com.myinsurance.model.view.Result;

import java.io.Serializable;

public class ResultUtil implements Serializable {

    private ResultUtil() {
    }

    public static Result<Object> returnSuccess() {
        Result<Object> result = new Result<>();
        result.setSuccess(true);
        return result;
    }

    public static Result<Object> returnSuccess(Object o) {
        Result<Object> result = new Result<>();
        result.setSuccess(true);
        result.setData(o);
        return result;
    }

    public static Result<Object> returnError(String msg,Object o) {
        Result<Object> result = new Result<>();
        result.setSuccess(false);
        result.setMsg(msg);
        result.setData(o);
        return result;
    }

    public static Result<Object> returnError(String msg) {
        Result<Object> result = new Result<>();
        result.setSuccess(false);
        return result;
    }

}