package com.myinsurance.service;

import com.myinsurance.model.vo.Result;


public interface ICustomerService {
    Result page(Integer uid,int currentPageNum, int pageSize);
}
