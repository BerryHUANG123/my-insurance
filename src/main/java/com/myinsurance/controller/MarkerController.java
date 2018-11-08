package com.myinsurance.controller;

import com.myinsurance.model.domain.MarkDo;
import com.myinsurance.model.view.Result;
import com.myinsurance.service.IMarkerService;
import com.myinsurance.utils.ResultUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("marker")
public class MarkerController extends BaseController {

    @Autowired
    private IMarkerService markerService;

    @RequestMapping("list")
    @ResponseBody
    public Result list() {
        return markerService.list(getUid());
    }

    @RequestMapping("/save")
    @ResponseBody
    public Result save(MarkDo markDo) {
        return markerService.save(getUid(), markDo);
    }

}
