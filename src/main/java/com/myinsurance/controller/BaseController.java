package com.myinsurance.controller;

import com.myinsurance.model.persistant.User;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.http.HttpSession;

public abstract class BaseController {

    protected final Logger logger = LogManager.getLogger(this.getClass());

    /**
     * 获取用户ID
     * @return
     */
    protected Integer getUid() {
        return 1;
    }
}
