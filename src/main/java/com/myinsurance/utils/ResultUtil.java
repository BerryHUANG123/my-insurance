package com.myinsurance.utils;

import com.myinsurance.model.vo.Result;

import java.io.Serializable;

public final class ResultUtil implements Serializable {

    private ResultUtil() {
    }

    public static Result returnSuccess() {
        Result result = new Result<>();
        result.setSuccess(true);
        return result;
    }

    public static Result returnSuccess(Object o) {
        Result result = new Result<>();
        result.setSuccess(true);
        result.setData(o);
        return result;
    }

    public static Result returnError(String msg,Object o) {
        Result<Object> result = new Result<>();
        result.setSuccess(false);
        result.setMsg(msg);
        result.setData(o);
        return result;
    }

    public static Result returnError(String msg) {
        Result result = new Result<>();
        result.setSuccess(false);
        result.setMsg(msg);
        return result;
    }

}