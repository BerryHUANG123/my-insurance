package com.myinsurance.controller;

import com.myinsurance.model.dto.CustomerNoteDto;
import com.myinsurance.model.dto.CustomerNotePageDto;
import com.myinsurance.model.vo.Result;
import com.myinsurance.service.ICustomerNoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("customerNote")
public class CustomerNoteController extends BaseController {

    @Autowired
    private ICustomerNoteService customerNoteService;

    @RequestMapping("pageData")
    @ResponseBody
    public Result pageData(CustomerNotePageDto customerNotePageDto) {
        return customerNoteService.pageData(getUid(), customerNotePageDto);
    }

    @RequestMapping("edit")
    @ResponseBody
    public Result edit(@RequestBody CustomerNoteDto customerNoteDto) {
        return customerNoteService.edit(getUid(), customerNoteDto);
    }

    @RequestMapping("delete")
    @ResponseBody
    public Result delete(Integer id) {
        return customerNoteService.delete(getUid(), id);
    }
}
