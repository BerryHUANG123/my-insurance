package com.myinsurance.commons;

import com.myinsurance.model.view.Result;
import com.myinsurance.utils.ExceptionUtil;
import com.myinsurance.utils.ResultUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import javax.servlet.http.HttpServletRequest;

/*@ControllerAdvice
@EnableWebMvc*/
public class GlobalExceptionHandler {

    private Logger logger = LogManager.getLogger();

    /*@ExceptionHandler(Exception.class)
    @ResponseBody*/
    public Result<String> ajaxException(HttpServletRequest req, Exception e) {
        logger.error(ExceptionUtil.getExceptionAllinformation(e));
        return ResultUtil.returnError(e.getLocalizedMessage());
    }

}
