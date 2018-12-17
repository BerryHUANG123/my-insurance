package com.myinsurance.service;

import com.myinsurance.model.dto.CustomerDto;
import com.myinsurance.model.dto.CustomerPageDto;
import com.myinsurance.model.vo.Result;


public interface ICustomerService {

    Result get(Integer uid, Integer customerId);

    Result save(Integer uid, CustomerDto customerDto);

    Result edit(Integer uid, CustomerDto customerDto);

    Result delete(Integer uid, Integer customerId);

    Result page(Integer uid, CustomerPageDto customerPageDto);
}
