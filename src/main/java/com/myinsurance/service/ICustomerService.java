package com.myinsurance.service;

import com.myinsurance.model.view.Result;


public interface ICustomerService {
    Result page(Integer uid,int currentPageNum, int pageSize);
}
