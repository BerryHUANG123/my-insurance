package com.myinsurance.service.impl;

import com.google.common.collect.Lists;
import com.myinsurance.dao.ICustomerDao;
import com.myinsurance.dao.IMapMarkerDao;
import com.myinsurance.model.dto.CustomerDto;
import com.myinsurance.model.dto.MarkDto;
import com.myinsurance.model.po.Customer;
import com.myinsurance.model.po.CustomerExample;
import com.myinsurance.model.po.MapMarker;
import com.myinsurance.model.po.MapMarkerExample;
import com.myinsurance.model.vo.CustomerVo;
import com.myinsurance.model.vo.MarkVo;
import com.myinsurance.model.vo.Result;
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
    public Result save(Integer uid, MarkDto markDTO) {
        //先查询该客户是否存在,若存在则取出
        CustomerExample customerExample = new CustomerExample();
        CustomerExample.Criteria criteria = customerExample.createCriteria();
        criteria.andUidEqualTo(uid);
        CustomerDto customerDTO = markDTO.getCustomerDtoList().get(0);
        criteria.andNameEqualTo(customerDTO.getName());
        List<Customer> customerList = customerDao.selectByExample(customerExample);
        Customer customer;
        if (customerList != null && !customerList.isEmpty()) {
            customer = customerList.get(0);
        } else {
            customer = new Customer();
            customer.setUid(uid);
            customer.setName(customerDTO.getName());
            customer.setSex("unknown");
            customer.setAge(1000);
            customer.setPhone(customerDTO.getPhone());
            customer.setAddress(customerDTO.getAddress());
            customer.setRemark(customerDTO.getRemark());
            customer.setCreateTime(new Date());
            customerDao.insert(customer);

            CustomerExample customerExample1 = new CustomerExample();
            CustomerExample.Criteria customerExampleCriteria1 = customerExample1.createCriteria();
            customerExampleCriteria1.andUidEqualTo(uid);
            customerExampleCriteria1.andNameEqualTo(customer.getName());
            List<Customer> customerList1 = customerDao.selectByExample(customerExample1);
            customer = customerList1.get(0);
        }

        //创建标记点
        MapMarker mapMarker = new MapMarker();
        mapMarker.setUid(uid);
        mapMarker.setLng(markDTO.getLng());
        mapMarker.setLat(markDTO.getLat());
        mapMarker.setCustomerId(customer.getId());
        mapMarker.setRemark(markDTO.getRemark());
        mapMarker.setCreateTime(new Date());
        mapMarkerDao.insert(mapMarker);

        MapMarkerExample mapMarkerExample = new MapMarkerExample();
        MapMarkerExample.Criteria mapMarkerExampleCriteria = mapMarkerExample.createCriteria();
        mapMarkerExampleCriteria.andUidEqualTo(uid);
        mapMarkerExampleCriteria.andLngEqualTo(markDTO.getLng());
        mapMarkerExampleCriteria.andLatEqualTo(markDTO.getLat());
        List<MapMarker> mapMarkerList = mapMarkerDao.selectByExample(mapMarkerExample);
        mapMarker = mapMarkerList.get(0);
        return ResultUtil.returnSuccess(transformate(customer, mapMarker));
    }

    @Override
    public Result edit(Integer uid, MarkDto markDTO) {
        //若标注或客户不存在,则无法完成编辑
        Integer markId = markDTO.getMarkId();
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
        newMapMarker.setRemark(markDTO.getRemark());
        newMapMarker.setUpdateTime(updateTime);
        mapMarkerDao.updateByExampleSelective(newMapMarker, mapMarkerExample);

        Customer newCustomer = new Customer();
        CustomerDto customerDTO = markDTO.getCustomerDtoList().get(0);
        newCustomer.setId(oldMapMarker.getCustomerId());
        newCustomer.setPhone(customerDTO.getPhone());
        newCustomer.setName(customerDTO.getName());
        newCustomer.setAddress(customerDTO.getAddress());
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
        List<CustomerVo> customerVOList = Lists.newArrayList();
        CustomerVo customerVO = new CustomerVo(customer.getId(), customer.getName(), customer.getSex(), customer.getBirthday(), customer.getPhone(), customer.getAddress(), customer.getRemark());
        customerVOList.add(customerVO);
        markVo.setCustomerVoList(customerVOList);
        markVo.setLat(mapMarker.getLat());
        markVo.setLng(mapMarker.getLng());
        markVo.setRemark(mapMarker.getRemark());
        return markVo;
    }
}
