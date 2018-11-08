package com.myinsurance.interceptor;

import org.apache.commons.lang3.time.DateFormatUtils;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class EventInterceptor extends BaseInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o) throws Exception {
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) throws Exception {
    }

    @Override
    public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {
        // 保存日志
        String message = "开始时间: {}; 结束时间: {}; 耗时: {}s; URI: {}; ";
        long startTime = System.currentTimeMillis();
        long endTime = System.currentTimeMillis();
        logger.info(message, DateFormatUtils.format(startTime, "HH:mm:ss.SSS"),
                DateFormatUtils.format(endTime, "HH:mm:ss.SSS"),
                (endTime - startTime) / 1000.00, httpServletRequest.getServletPath());
    }
}
