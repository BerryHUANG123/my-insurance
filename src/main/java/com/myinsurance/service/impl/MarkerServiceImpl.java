package com.myinsurance.service.impl;

import com.google.common.collect.Lists;
import com.myinsurance.dao.ICustomerDao;
import com.myinsurance.dao.ICustomerHobbyDao;
import com.myinsurance.dao.IMapMarkerDao;
import com.myinsurance.model.dto.CustomerDto;
import com.myinsurance.model.dto.CustomerHobbyDto;
import com.myinsurance.model.dto.MarkDto;
import com.myinsurance.model.po.*;
import com.myinsurance.model.vo.CustomerHobbyVo;
import com.myinsurance.model.vo.CustomerVo;
import com.myinsurance.model.vo.MarkVo;
import com.myinsurance.model.vo.Result;
import com.myinsurance.service.BaseService;
import com.myinsurance.service.IMarkerService;
import com.myinsurance.utils.ResultUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@Service
public class MarkerServiceImpl extends BaseService implements IMarkerService {

    @Autowired
    private IMapMarkerDao mapMarkerDao;
    @Autowired
    private ICustomerDao customerDao;
    @Autowired
    private ICustomerHobbyDao customerHobbyDao;

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
        //获取该标注点所有客户信息
        CustomerExample customerExample = new CustomerExample();
        CustomerExample.Criteria customerExampleCriteria = customerExample.createCriteria();
        customerExampleCriteria.andUidEqualTo(uid);
        customerExampleCriteria.andMapMarkerIdEqualTo(mapMarker.getId());
        List<Customer> customerList = customerDao.selectByExample(customerExample);

        List<CustomerVo> customerVoList = customerList.stream().map(
                customer -> {
                    //查询客户爱好数据
                    CustomerHobbyExample customerHobbyExample = new CustomerHobbyExample();
                    CustomerHobbyExample.Criteria criteria = customerHobbyExample.createCriteria();
                    criteria.andUidEqualTo(uid);
                    criteria.andCustomerIdEqualTo(customer.getId());
                    List<CustomerHobbyVo> customerHobbyVoList = customerHobbyDao.selectByExample(customerHobbyExample).stream().map(
                            customerHobby -> new CustomerHobbyVo(customerHobby.getId(), customerHobby.getCustomerId(), customerHobby.getHobby(),
                                    customerHobby.getSpecificHobby(), customerHobby.getCustomHobby(), customerHobby.getCreateTime(), customerHobby.getUpdateTime())
                    ).collect(toList());
                    return new CustomerVo(customer.getId(), customer.getName(), customer.getSex(), customer.getBirthday(), customer.getAge(), customerHobbyVoList, customer.getPhone(), customer.getBasicAddress(),
                            customer.getDetailedAddress(), customer.getLng(), customer.getLat(), customer.getRemark(), customer.getMapMarkerId(), customer.getCreateTime(), customer.getUpdateTime());
                }
        ).collect(toList());
        return ResultUtil.returnSuccess(new MarkVo(mapMarker.getId(), mapMarker.getRemark(), mapMarker.getLng(), mapMarker.getLat(), customerVoList));
    }

    @Override
    public Result list(Integer uid) {
        MapMarkerExample mapMarkerExample = new MapMarkerExample();
        MapMarkerExample.Criteria mapMarkerExampleCriteria = mapMarkerExample.createCriteria();
        mapMarkerExampleCriteria.andUidEqualTo(uid);
        mapMarkerExample.setOrderByClause("`create_time` DESC");
        List<MapMarker> mapMarkerList = mapMarkerDao.selectByExample(mapMarkerExample);
        List<MarkVo> markVoList = Lists.newArrayList();
        for (MapMarker mapMarker : mapMarkerList) {
            //查询客户实体
            CustomerExample customerExample = new CustomerExample();
            CustomerExample.Criteria customerExampleCriteria = customerExample.createCriteria();
            customerExampleCriteria.andUidEqualTo(uid);
            customerExampleCriteria.andMapMarkerIdEqualTo(mapMarker.getId());
            List<Customer> customerList = customerDao.selectByExample(customerExample);
            List<CustomerVo> customerVoList = customerList.stream().map(
                    customer -> {
                        //查询客户爱好
                        CustomerHobbyExample customerHobbyExample = new CustomerHobbyExample();
                        CustomerHobbyExample.Criteria customerHobbyExampleCriteria = customerHobbyExample.createCriteria();
                        customerHobbyExampleCriteria.andUidEqualTo(uid);
                        customerHobbyExampleCriteria.andCustomerIdEqualTo(customer.getId());
                        List<CustomerHobbyVo> customerHobbyVoList = customerHobbyDao.selectByExample(customerHobbyExample).stream().map(customerHobby ->
                                new CustomerHobbyVo(customerHobby.getId(), customerHobby.getCustomerId(), customerHobby.getHobby(),
                                        customerHobby.getSpecificHobby(), customerHobby.getCustomHobby(), customerHobby.getCreateTime(), customerHobby.getUpdateTime())).collect(toList());
                        CustomerVo customerVo = new CustomerVo(customer.getId(), customer.getName(), customer.getSex(), customer.getBirthday(), customer.getAge(), customerHobbyVoList, customer.getPhone(), customer.getBasicAddress(), customer.getDetailedAddress(),
                                customer.getLng(), customer.getLat(), customer.getRemark(), customer.getMapMarkerId(), customer.getCreateTime(), customer.getUpdateTime());
                        return customerVo;
                    }
            ).collect(Collectors.toList());
            MarkVo markVo = new MarkVo(mapMarker.getId(), mapMarker.getRemark(), mapMarker.getLng(), mapMarker.getLat(), customerVoList);
            markVoList.add(markVo);
        }
        return ResultUtil.returnSuccess(markVoList);
    }

    @Transactional
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
            customer.setSex(customerDTO.getSex());
            customer.setAge(customerDTO.getAge());
            customer.setBirthday(customerDTO.getBirthday());
            customer.setPhone(customerDTO.getPhone());
            customer.setRemark(customerDTO.getRemark());
            customer.setCreateTime(new Date());
            customerDao.insert(customer);

            CustomerExample customerExample1 = new CustomerExample();
            CustomerExample.Criteria customerExampleCriteria1 = customerExample1.createCriteria();
            customerExampleCriteria1.andUidEqualTo(uid);
            customerExampleCriteria1.andNameEqualTo(customer.getName());
            List<Customer> customerList1 = customerDao.selectByExample(customerExample1);
            customer = customerList1.get(0);

            //插入爱好数据
            List<CustomerHobbyDto> customerHobbyDtoList = customerDTO.getCustomerHobbyDtoList();
            if (customerHobbyDtoList != null && !customerHobbyDtoList.isEmpty()) {
                for (CustomerHobbyDto customerHobbyDto : customerHobbyDtoList) {
                    CustomerHobby customerHobby = new CustomerHobby();
                    customerHobby.setUid(uid);
                    customerHobby.setCustomerId(customer.getId());
                    customerHobby.setHobby(customerHobbyDto.getHobby());
                    customerHobby.setSpecificHobby(customerHobbyDto.getSpecificHobby());
                    customerHobby.setCustomHobby(customerHobbyDto.getCustomHobby());
                    customerHobby.setCreateTime(new Date());
                    customerHobbyDao.insertSelective(customerHobby);
                }
            }
        }

        //查询爱好数据
        CustomerHobbyExample customerHobbyExample = new CustomerHobbyExample();
        CustomerHobbyExample.Criteria customerHobbyExampleCriteria = customerHobbyExample.createCriteria();
        customerHobbyExampleCriteria.andUidEqualTo(uid);
        customerHobbyExampleCriteria.andCustomerIdEqualTo(customer.getId());
        List<CustomerHobby> customerHobbyList = customerHobbyDao.selectByExample(customerHobbyExample);

        //创建标记点
        MapMarker mapMarker = new MapMarker();
        mapMarker.setUid(uid);
        mapMarker.setLng(markDTO.getLng());
        mapMarker.setLat(markDTO.getLat());
        //  mapMarker.setCustomerId(customer.getId());
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


        return ResultUtil.returnSuccess(transformate(mapMarker, customer, customerHobbyList));
    }

    @Override
    public Result edit(Integer uid, MarkDto markDto) {
        //若标注不存在,则无法完成编辑
        Integer markId = markDto.getMarkId();
        MapMarkerExample mapMarkerExample = new MapMarkerExample();
        MapMarkerExample.Criteria mapMarkerExampleCriteria = mapMarkerExample.createCriteria();
        mapMarkerExampleCriteria.andUidEqualTo(uid);
        mapMarkerExampleCriteria.andIdEqualTo(markId);
        List<MapMarker> mapMarkerList = mapMarkerDao.selectByExample(mapMarkerExample);
        if (mapMarkerList == null || mapMarkerList.isEmpty()) {
            return ResultUtil.returnError("标注点已不存在!");
        }
        MapMarker oldMapMarker = mapMarkerList.get(0);
        oldMapMarker.setRemark(markDto.getRemark());
        oldMapMarker.setUpdateTime(new Date());
        mapMarkerDao.updateByPrimaryKey(oldMapMarker);
        return ResultUtil.returnSuccess();
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

    private MarkVo transformate(MapMarker mapMarker, Customer customer, List<CustomerHobby> customerHobbyList) {
        MarkVo markVo = new MarkVo();
        markVo.setMarkId(mapMarker.getId());
        List<CustomerVo> customerVOList = Lists.newArrayList();
        CustomerVo customerVo = new CustomerVo();
        List<CustomerHobbyVo> customerHobbyVoList = null;
        if (customerHobbyList != null && !customerHobbyList.isEmpty()) {
            customerHobbyVoList = Lists.newArrayList();
            for (CustomerHobby customerHobby : customerHobbyList) {
                CustomerHobbyVo customerHobbyVo = new CustomerHobbyVo(
                        customerHobby.getId(), customerHobby.getCustomerId(), customerHobby.getHobby(),
                        customerHobby.getSpecificHobby(), customerHobby.getCustomHobby(),
                        customerHobby.getCreateTime(), customerHobby.getUpdateTime());
                customerHobbyVoList.add(customerHobbyVo);
            }
        }
        customerVo.setCustomerHobbyVoList(customerHobbyVoList);
        customerVOList.add(customerVo);
        markVo.setCustomerVoList(customerVOList);
        markVo.setLat(mapMarker.getLat());
        markVo.setLng(mapMarker.getLng());
        markVo.setRemark(mapMarker.getRemark());
        return markVo;
    }
}