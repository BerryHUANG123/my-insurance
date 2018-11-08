package com.myinsurance.controller;

import com.myinsurance.model.view.Result;
import com.myinsurance.service.ILoginService;
import com.myinsurance.utils.ResultUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Controller
@RequestMapping("login")
public class LoginController extends BaseController {

    @Autowired
    private ILoginService loginService;

    @RequestMapping("doLogin")
    public void doLogin(HttpServletRequest request, HttpServletResponse response,String userName, String password)  throws ServletException, IOException {

        boolean loginResult = loginService.doLogin(userName, password);

        if(loginResult){
            request.getSession().setAttribute("userName",userName);
            response.sendRedirect("index");
        }else{
            request.setAttribute("warning","用户名或密码错误!");
            request.getRequestDispatcher("login").forward(request,response);
        }
    }

}
