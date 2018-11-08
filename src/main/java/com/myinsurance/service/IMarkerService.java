package com.myinsurance.service;

import com.myinsurance.model.domain.MarkDo;
import com.myinsurance.model.view.Result;

/**
 * 标记服务层
 */
public interface IMarkerService {

    Result get(Integer uid,Integer markId);

    Result list(Integer uid);

    Result save(Integer uid,MarkDo markDo);

    Result edit(Integer uid,MarkDo markDo);

    Result remove(Integer uid,Integer markId);
}
