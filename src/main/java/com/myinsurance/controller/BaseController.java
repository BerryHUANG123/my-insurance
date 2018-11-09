package com.myinsurance.controller;

import com.myinsurance.model.persistant.User;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import javax.servlet.http.HttpServletRequest;

public abstract class BaseController {

    protected final Logger logger = LogManager.getLogger(this.getClass());

    /**
     * 获取用户ID
     *
     * @return
     */
    protected Integer getUid() {
        Integer uid = null;
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        User user = (User) request.getSession().getAttribute("user");
        if (user != null) {
            uid = user.getId();
        }
        return uid;
    }
}
