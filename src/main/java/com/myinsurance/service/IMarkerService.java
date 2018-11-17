package com.myinsurance.service;

import com.myinsurance.model.dto.MarkDto;
import com.myinsurance.model.vo.Result;

/**
 * 标记服务层
 */
public interface IMarkerService {

    Result get(Integer uid,Integer markId);

    Result list(Integer uid);

    Result save(Integer uid, MarkDto markDo);

    Result edit(Integer uid, MarkDto markDo);

    Result remove(Integer uid,Integer markId);
}
