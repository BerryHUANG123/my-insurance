package com.myinsurance.service.impl;

import com.google.common.collect.Lists;
import com.myinsurance.dao.ICustomerDao;
import com.myinsurance.dao.IMapMarkerDao;
import com.myinsurance.model.domain.MarkDo;
import com.myinsurance.model.persistant.Customer;
import com.myinsurance.model.persistant.CustomerExample;
import com.myinsurance.model.persistant.MapMarker;
import com.myinsurance.model.persistant.MapMarkerExample;
import com.myinsurance.model.view.MarkVo;
import com.myinsurance.model.view.Result;
import com.myinsurance.service.BaseService;
import com.myinsurance.service.IMarkerService;
import com.myinsurance.utils.ResultUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class MarkServiceImpl extends BaseService implements IMarkerService {

    @Autowired
    private IMapMarkerDao mapMarkerDao;
    @Autowired
    private ICustomerDao customerDao;

    @Override
    public Result get(Integer uid, Integer markId) {
        MapMarkerExample mapMarkerExample = new MapMarkerExample();
        MapMarkerExample.Criteria mapMarkerExampleCriteria = mapMarkerExample.createCriteria();
        mapMarkerExampleCriteria.andUidEqualTo(uid);
        mapMarkerExampleCriteria.andIdEqualTo(markId);
        List<MapMarker> mapMarkerList = mapMarkerDao.selectByExample(mapMarkerExample);
        if (mapMarkerList == null || mapMarkerList.isEmpty()) {
            return ResultUtil.returnError("标注点已不存在!");
        }
        MapMarker mapMarker = mapMarkerList.get(0);
        Customer customer = customerDao.selectByPrimaryKey(mapMarker.getCustomerId());
        if (customer == null) {
            return ResultUtil.returnError("该点所属客户资料不存在!");
        }
        return ResultUtil.returnSuccess(transformate(customer, mapMarker));
    }

    @Override
    public Result list(Integer uid) {
        MapMarkerExample mapMarkerExample = new MapMarkerExample();
        MapMarkerExample.Criteria mapMarkerExampleCriteria = mapMarkerExample.createCriteria();
        mapMarkerExampleCriteria.andUidEqualTo(uid);
        List<MapMarker> mapMarkerList = mapMarkerDao.selectByExample(mapMarkerExample);
        List<MarkVo> markVoList = Lists.newArrayList();
        for (MapMarker mapMarker : mapMarkerList) {
            markVoList.add(transformate(customerDao.selectByPrimaryKey(mapMarker.getCustomerId()), mapMarker));
        }
        return ResultUtil.returnSuccess(markVoList);
    }

    @Override
    public Result save(Integer uid, MarkDo markDo) {
        //先查询该客户是否存在,若存在则取出
        CustomerExample customerExample = new CustomerExample();
        CustomerExample.Criteria criteria = customerExample.createCriteria();
        criteria.andUidEqualTo(uid);
        criteria.andNameEqualTo(markDo.getName());
        List<Customer> customerList = customerDao.selectByExample(customerExample);
        Customer customer;
        if (customerList != null && !customerList.isEmpty()) {
            customer = customerList.get(0);
        } else {
            customer = new Customer();
            customer.setUid(uid);
            customer.setName(markDo.getName());
            customer.setSex("unknown");
            customer.setAge(1000);
            customer.setPhone(markDo.getPhone());
            customer.setAddress(markDo.getAddress());
            customer.setRemark(markDo.getContent());
            customer.setCreateTime(new Date());
            customerDao.insert(customer);

            CustomerExample customerExample1 = new CustomerExample();
            CustomerExample.Criteria customerExampleCriteria1 = customerExample.createCriteria();
            customerExampleCriteria1.andUidEqualTo(uid);
            customerExampleCriteria1.andNameEqualTo(customer.getName());
            List<Customer> customerList1 = customerDao.selectByExample(customerExample);
            customer = customerList1.get(0);
        }

        //创建标记点
        MapMarker mapMarker = new MapMarker();
        mapMarker.setUid(uid);
        mapMarker.setLng(markDo.getLng());
        mapMarker.setLat(markDo.getLat());
        mapMarker.setCustomerId(customer.getId());
        mapMarker.setRemark(markDo.getContent());
        mapMarker.setCreateTime(new Date());
        mapMarkerDao.insert(mapMarker);

        MapMarkerExample mapMarkerExample = new MapMarkerExample();
        MapMarkerExample.Criteria mapMarkerExampleCriteria = mapMarkerExample.createCriteria();
        mapMarkerExampleCriteria.andUidEqualTo(uid);
        mapMarkerExampleCriteria.andLngEqualTo(markDo.getLng());
        mapMarkerExampleCriteria.andLatEqualTo(markDo.getLat());
        List<MapMarker> mapMarkerList = mapMarkerDao.selectByExample(mapMarkerExample);
        mapMarker = mapMarkerList.get(0);
        return ResultUtil.returnSuccess(transformate(customer, mapMarker));
    }

    @Override
    public Result edit(Integer uid, MarkDo markDo) {
        //若标注或客户不存在,则无法完成编辑
        Integer markId = markDo.getMarkId();
        MapMarkerExample mapMarkerExample = new MapMarkerExample();
        MapMarkerExample.Criteria mapMarkerExampleCriteria = mapMarkerExample.createCriteria();
        mapMarkerExampleCriteria.andUidEqualTo(uid);
        mapMarkerExampleCriteria.andIdEqualTo(markId);
        List<MapMarker> mapMarkerList = mapMarkerDao.selectByExample(mapMarkerExample);
        if (mapMarkerList == null || mapMarkerList.isEmpty()) {
            return ResultUtil.returnError("标注点已不存在!");
        }
        MapMarker oldMapMarker = mapMarkerList.get(0);
        Customer oldCustomer = customerDao.selectByPrimaryKey(oldMapMarker.getCustomerId());
        if (oldCustomer == null) {
            return ResultUtil.returnError("该点所属客户资料不存在!");
        }

        //先保存标注,再保存客户
        Date updateTime = new Date();
        MapMarker newMapMarker = new MapMarker();
        newMapMarker.setRemark(markDo.getContent());
        newMapMarker.setUpdateTime(updateTime);
        mapMarkerDao.updateByExampleSelective(newMapMarker, mapMarkerExample);

        Customer newCustomer = new Customer();
        newCustomer.setId(oldMapMarker.getCustomerId());
        newCustomer.setPhone(markDo.getPhone());
        newCustomer.setName(markDo.getName());
        newCustomer.setAddress(markDo.getAddress());
        newCustomer.setUpdateTime(updateTime);
        customerDao.updateByPrimaryKeySelective(newCustomer);

        //查询更新后的客户信息和标注信息并返回给页面
        MapMarker lastMapMarker = mapMarkerDao.selectByExample(mapMarkerExample).get(0);
        Customer lastCustomer = customerDao.selectByPrimaryKey(oldMapMarker.getCustomerId());
        return ResultUtil.returnSuccess(transformate(lastCustomer, lastMapMarker));
    }

    @Override
    public Result remove(Integer uid, Integer markId) {
        //删除标记,但不删除客户信息
        MapMarkerExample mapMarkerExample = new MapMarkerExample();
        MapMarkerExample.Criteria mapMarkerExampleCriteria = mapMarkerExample.createCriteria();
        mapMarkerExampleCriteria.andUidEqualTo(uid);
        mapMarkerExampleCriteria.andIdEqualTo(markId);
        mapMarkerDao.deleteByExample(mapMarkerExample);
        return ResultUtil.returnSuccess();
    }

    private MarkVo transformate(Customer customer, MapMarker mapMarker) {
        MarkVo markVo = new MarkVo();
        markVo.setMarkId(mapMarker.getId());
        markVo.setCustomerId(customer.getId());
        markVo.setName(customer.getName());
        markVo.setAddress(customer.getAddress());
        markVo.setLat(mapMarker.getLat());
        markVo.setLng(mapMarker.getLng());
        markVo.setContent(mapMarker.getRemark());
        markVo.setPhone(customer.getPhone());
        return markVo;
    }
}
