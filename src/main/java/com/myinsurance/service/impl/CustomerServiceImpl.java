package com.myinsurance.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.myinsurance.dao.ICustomerDao;
import com.myinsurance.model.persistant.Customer;
import com.myinsurance.model.persistant.CustomerExample;
import com.myinsurance.model.view.Page;
import com.myinsurance.model.view.Result;
import com.myinsurance.service.ICustomerService;
import com.myinsurance.utils.ResultUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class CustomerServiceImpl implements ICustomerService {

    @Autowired
    private ICustomerDao customerDao;

    @Override
    public Result page(Integer uid,int currentPageNum, int pageSize) {
        PageHelper.startPage(currentPageNum,pageSize);
        CustomerExample customerExample = new CustomerExample();
        customerExample.setOrderByClause("`create_time` DESC");
        CustomerExample.Criteria criteria = customerExample.createCriteria();
        criteria.andUidEqualTo(uid);
        criteria.andNameLike("黄%");
       List<Customer> list =  customerDao.selectByExample(customerExample);
        PageInfo<Customer> pageInfo = new PageInfo<>(list);
        Page<Customer> resultPage = new Page<>(pageInfo.getTotal(),pageInfo.getPageSize(),pageInfo.getPageNum(),list);
        return ResultUtil.returnSuccess(resultPage);
    }
}
