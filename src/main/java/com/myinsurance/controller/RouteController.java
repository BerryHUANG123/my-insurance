package com.myinsurance.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * 路由控制器
 */

@Controller
@RequestMapping("route")
public class RouteController extends BaseController {

    @RequestMapping("page")
    public ModelAndView page(String moduleName){
        ModelAndView mv = new ModelAndView("common/main-frame");
        mv.addObject("viewName",moduleName);
       /* switch (moduleName){
            case "map":
                break;
            case "customer":
                break;
        }*/
        return mv;
    }
}
