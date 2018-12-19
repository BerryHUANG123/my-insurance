package com.myinsurance.controller;

import com.myinsurance.model.dto.MarkDto;
import com.myinsurance.model.vo.Result;
import com.myinsurance.service.ICustomerService;
import com.myinsurance.service.IMarkerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("marker")
public class MarkerController extends BaseController {

    @Autowired
    private IMarkerService markerService;
    @Autowired
    private ICustomerService customerService;

    @RequestMapping("get")
    @ResponseBody
    public Result get(Integer markId) {
        return markerService.get(getUid(), markId);
    }

    @RequestMapping("list")
    @ResponseBody
    public Result list() {
        return markerService.list(getUid());
    }

    @RequestMapping("save")
    @ResponseBody
    public Result save(@RequestBody MarkDto markDTO) {
        return markerService.save(getUid(), markDTO);
    }

    @RequestMapping(value="edit")
    @ResponseBody
    public Result edit(@RequestBody MarkDto markDto) {
        return markerService.edit(getUid(), markDto);
    }

    @RequestMapping("remove")
    @ResponseBody
    public Result remove(Integer markId) {
        return markerService.remove(getUid(), markId);
    }

    @RequestMapping("removeCustomer")
    @ResponseBody
    public Result removeCustomer(Integer markId,Integer customerId) {
        System.out.println(markId);
        System.out.println(customerId);
       return customerService.removeMapMarkerId(getUid(),markId,customerId);
    }
}
