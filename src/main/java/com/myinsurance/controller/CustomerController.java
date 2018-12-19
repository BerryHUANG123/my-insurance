package com.myinsurance.controller;

import com.myinsurance.model.dto.CustomerDto;
import com.myinsurance.model.dto.CustomerPageDto;
import com.myinsurance.model.vo.Result;
import com.myinsurance.service.ICustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;


@Controller
@RequestMapping("customer")
public class CustomerController extends BaseController{

    @Autowired
    private ICustomerService customerService;

    @RequestMapping("pageData")
    @ResponseBody
    public Result pageData(CustomerPageDto customerPageDto){
        return customerService.page(getUid(),customerPageDto);
    }

    @RequestMapping("page")
    public ModelAndView page(){
        return new ModelAndView("customer/page");
    }

    @RequestMapping("get")
    @ResponseBody
    public Result get(Integer customerId){
        return customerService.get(getUid(),customerId);
    }

    @RequestMapping("save")
    @ResponseBody
    public Result save(@RequestBody CustomerDto customerDto){
        return customerService.save(getUid(),customerDto);
    }

    @RequestMapping("edit")
    @ResponseBody
    public Result edit(@RequestBody CustomerDto customerDto){
        return customerService.edit(getUid(),customerDto);
    }

    @RequestMapping("delete")
    @ResponseBody
    public Result delete(@RequestBody Integer customerId){
        return customerService.delete(getUid(),customerId);
    }

    @RequestMapping("getNoMapMarkerIdCustomerList")
    @ResponseBody
    public Result getNoMapMarkerIdCustomerList(){
        return customerService.getNoMapMarkerIdCustomerList(getUid());
    }

    @RequestMapping("editMapMarkId")
    @ResponseBody
    public Result editMapMarkId(Integer markId,Integer customerId){
        return customerService.editMapMarkId(getUid(),markId,customerId);
    }

}
