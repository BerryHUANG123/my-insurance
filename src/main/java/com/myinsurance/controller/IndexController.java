package com.myinsurance.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller()
@RequestMapping("index")
public class IndexController {

    @RequestMapping("page")
    public ModelAndView page(){
        return new ModelAndView("index");
    }
}
