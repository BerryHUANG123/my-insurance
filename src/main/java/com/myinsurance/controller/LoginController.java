package com.myinsurance.controller;

import com.myinsurance.model.persistant.User;
import com.myinsurance.model.view.Result;
import com.myinsurance.service.ILoginService;
import com.myinsurance.utils.ResultUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@Controller
@RequestMapping("login")
public class LoginController extends BaseController {

    @Autowired
    private ILoginService loginService;

    @RequestMapping("page")
    public ModelAndView page(){
        return new ModelAndView("login");
    }

    @RequestMapping("doLogin")
    public void doLogin(HttpServletRequest request, HttpServletResponse response, String userName, String password) throws ServletException, IOException {

        User user = loginService.doLogin(userName, password);

        if (user != null) {
            HttpSession httpSession = request.getSession();
            httpSession.setAttribute("user", user);
            response.sendRedirect("/index/page.htm");
        } else {
            request.setAttribute("warning", "用户名或密码错误!");
            request.getRequestDispatcher("/login/page.htm").forward(request, response);
        }
    }

}
