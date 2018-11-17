package com.myinsurance.controller;

import com.myinsurance.model.vo.Result;
import com.myinsurance.service.ICustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
@RequestMapping("customer")
public class CustomerController extends BaseController{

    @Autowired
    private ICustomerService customerService;

    @RequestMapping("page")
    public Result pageData(int currentPageNum,int pageSize){
        return customerService.page(getUid(),currentPageNum,pageSize);
    }
}
