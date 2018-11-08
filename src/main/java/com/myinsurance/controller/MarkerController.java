package com.myinsurance.controller;

import com.myinsurance.model.domain.MarkDo;
import com.myinsurance.model.view.Result;
import com.myinsurance.utils.ResultUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("marker")
public class MarkerController extends BaseController {

    @RequestMapping("/save")
    @ResponseBody
    public Result save(MarkDo markDo) {
        logger.info(markDo);
        return ResultUtil.returnSuccess();
    }

}
