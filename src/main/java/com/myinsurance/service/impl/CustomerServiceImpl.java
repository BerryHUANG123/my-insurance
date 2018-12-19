package com.myinsurance.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.myinsurance.dao.ICustomerDao;
import com.myinsurance.dao.ICustomerHobbyDao;
import com.myinsurance.dao.ICustomerNoteDao;
import com.myinsurance.dao.IMapMarkerDao;
import com.myinsurance.model.dto.CustomerDto;
import com.myinsurance.model.dto.CustomerHobbyDto;
import com.myinsurance.model.dto.CustomerPageDto;
import com.myinsurance.model.po.*;
import com.myinsurance.model.vo.CustomerHobbyVo;
import com.myinsurance.model.vo.CustomerVo;
import com.myinsurance.model.vo.PageVo;
import com.myinsurance.model.vo.Result;
import com.myinsurance.service.ICustomerService;
import com.myinsurance.utils.ResultUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

import static java.util.stream.Collectors.toList;


@Service
public class CustomerServiceImpl implements ICustomerService {

    @Autowired
    private ICustomerDao customerDao;
    @Autowired
    private ICustomerHobbyDao customerHobbyDao;
    @Autowired
    private ICustomerNoteDao customerNoteDao;
    @Autowired
    private IMapMarkerDao mapMarkerDao;

    @Override
    public Result get(Integer uid, Integer customerId) {
        //查询指定客户
        CustomerExample customerExample = new CustomerExample();
        CustomerExample.Criteria customerExampleCriteria = customerExample.createCriteria();
        customerExampleCriteria.andUidEqualTo(uid);
        customerExampleCriteria.andIdEqualTo(customerId);
        Customer customer;
        List<Customer> customerList = customerDao.selectByExample(customerExample);
        if (!customerList.isEmpty()) {
            customer = customerList.get(0);
        } else {
            return ResultUtil.returnError("客户信息不存在!");
        }
        //获取爱好数据
        CustomerHobbyExample customerHobbyExample = new CustomerHobbyExample();
        CustomerHobbyExample.Criteria customerHobbyExampleCriteria = customerHobbyExample.createCriteria();
        customerHobbyExampleCriteria.andUidEqualTo(uid);
        customerHobbyExampleCriteria.andCustomerIdEqualTo(customerId);
        List<CustomerHobby> customerHobbyList = customerHobbyDao.selectByExample(customerHobbyExample);
        List<CustomerHobbyVo> customerHobbyVoList = null;
        if (!customerHobbyList.isEmpty()) {
            customerHobbyVoList = customerHobbyList.stream().map(customerHobby ->
                    new CustomerHobbyVo(customerHobby.getId(), customerHobby.getCustomerId(), customerHobby.getHobby(), customerHobby.getSpecificHobby(), customerHobby.getCustomHobby(), customerHobby.getCreateTime(), customerHobby.getUpdateTime()))
                    .collect(toList());
        }
        CustomerVo customerVo = new CustomerVo(customerId, customer.getName(), customer.getSex(), customer.getBirthday(), customer.getAge(), customerHobbyVoList, customer.getPhone(), customer.getBasicAddress(), customer.getDetailedAddress(), customer.getLng(), customer.getLat(), customer.getRemark(), customer.getMapMarkerId(), customer.getCreateTime(), customer.getUpdateTime());
        return ResultUtil.returnSuccess(customerVo);
    }

    @Override
    @Transactional
    public Result save(Integer uid, CustomerDto customerDto) {
        //检查客户姓名不能空且是否已存在
        String name = customerDto.getName();
        if (StringUtils.isBlank(name)) {
            return ResultUtil.returnError("姓名不能为空!");
        }
        CustomerExample customerExample = new CustomerExample();
        CustomerExample.Criteria customerExampleCriteria = customerExample.createCriteria();
        customerExampleCriteria.andUidEqualTo(uid);
        customerExampleCriteria.andNameEqualTo(name);
        List<Customer> customerList = customerDao.selectByExample(customerExample);
        if (!customerList.isEmpty()) {
            return ResultUtil.returnError("当前客户姓名已存在,请更换!");
        }
        //保存客户信息
        Customer customer = new Customer(null, uid, customerDto.getName(), customerDto.getSex(), customerDto.getBirthday(),
                customerDto.getAge(), customerDto.getPhone(), customerDto.getBasicAddress(), customerDto.getDetailedAddress(),
                customerDto.getLng(), customerDto.getLat(), customerDto.getRemark(), null, new Date(), null);
        customerDao.insertSelective(customer);
        //保存客户爱好信息
        List<CustomerHobbyDto> customerHobbyDtoList = customerDto.getCustomerHobbyDtoList();
        if (customerHobbyDtoList != null && !customerHobbyDtoList.isEmpty()) {
            for (CustomerHobbyDto customerHobbyDto : customerHobbyDtoList) {
                customerHobbyDao.insertSelective(
                        new CustomerHobby(null, uid, customer.getId(), customerHobbyDto.getHobby(), customerHobbyDto.getSpecificHobby(),
                                customerHobbyDto.getCustomHobby(), new Date(), null));
            }
        }
        //是否创建地图标注
        if (StringUtils.isNotBlank(customer.getBasicAddress())
                && customer.getLng() != null
                && customer.getLat() != null
                && customerDto.getCreateMarker() != null
                && customerDto.getCreateMarker()) {
            //查询该点是否已存在,若已存在,则不在创建
            MapMarkerExample mapMarkerExample = new MapMarkerExample();
            MapMarkerExample.Criteria criteria = mapMarkerExample.createCriteria();
            criteria.andLngEqualTo(customer.getLng());
            criteria.andLatEqualTo(customer.getLat());
            criteria.andUidEqualTo(uid);
            List<MapMarker> mapMarkerList = mapMarkerDao.selectByExample(mapMarkerExample);
            if (mapMarkerList.isEmpty()) {
                //创建标注点
                MapMarker mapMarker = new MapMarker(null, uid, customer.getLng(), customer.getLat(), null, new Date(), null);
                mapMarkerDao.insertSelective(mapMarker);
                Customer customer1 = new Customer();
                customer1.setId(customer.getId());
                customer1.setMapMarkerId(mapMarker.getId());
                customerDao.updateByPrimaryKeySelective(customer1);
            } else {
                Customer customer1 = new Customer();
                customer1.setId(customer.getId());
                customer1.setMapMarkerId(mapMarkerList.get(0).getId());
                customerDao.updateByPrimaryKeySelective(customer1);
            }
        }
        return ResultUtil.returnSuccess();
    }

    @Override
    @Transactional
    public Result edit(Integer uid, CustomerDto customerDto) {
        //查询旧的
        CustomerExample customerExample = new CustomerExample();
        CustomerExample.Criteria criteria = customerExample.createCriteria();
        criteria.andUidEqualTo(uid);
        criteria.andIdEqualTo(customerDto.getId());
        List<Customer> oldCustomerList = customerDao.selectByExample(customerExample);
        if (oldCustomerList.isEmpty()) {
            return ResultUtil.returnError("当前客户已不存在!");
        }

        //判断名字是否重复
        CustomerExample otherCustomerExample = new CustomerExample();
        CustomerExample.Criteria otherCustomerExampleCriteria = otherCustomerExample.createCriteria();
        otherCustomerExampleCriteria.andUidEqualTo(uid);
        otherCustomerExampleCriteria.andNameEqualTo(customerDto.getName());
        otherCustomerExampleCriteria.andIdNotEqualTo(customerDto.getId());
        List<Customer> otherCustomerList = customerDao.selectByExample(otherCustomerExample);
        if (!otherCustomerList.isEmpty()) {
            return ResultUtil.returnError("姓名已被其他客户使用,请更换!");
        }

        Customer oldCustomer = oldCustomerList.get(0);
        //编辑客户信息
        Customer newCustomer = new Customer(customerDto.getId(), uid, customerDto.getName(), customerDto.getSex(), customerDto.getBirthday(),
                customerDto.getAge(), customerDto.getPhone(), customerDto.getBasicAddress(), customerDto.getDetailedAddress(),
                customerDto.getLng(), customerDto.getLat(), customerDto.getRemark(), oldCustomer.getMapMarkerId(), oldCustomer.getCreateTime(), new Date());
        customerDao.updateByExample(newCustomer, customerExample);

        //判断是否需要创建,更换或删除地图标注点
        if (StringUtils.isNotBlank(customerDto.getBasicAddress())
                && customerDto.getLng() != null
                && customerDto.getLat() != null
                && customerDto.getCreateMarker() != null
                && customerDto.getCreateMarker()) {
            //查询该点是否已存在,若已存在,则不在创建
            MapMarkerExample mapMarkerExample = new MapMarkerExample();
            MapMarkerExample.Criteria mapMarkerExampleCriteria = mapMarkerExample.createCriteria();
            mapMarkerExampleCriteria.andLngEqualTo(customerDto.getLng());
            mapMarkerExampleCriteria.andLatEqualTo(customerDto.getLat());
            mapMarkerExampleCriteria.andUidEqualTo(uid);
            List<MapMarker> mapMarkerList = mapMarkerDao.selectByExample(mapMarkerExample);
            if (mapMarkerList.isEmpty()) {
                //创建标注点
                MapMarker mapMarker = new MapMarker(null, uid, customerDto.getLng(), customerDto.getLat(), null, new Date(), null);
                mapMarkerDao.insertSelective(mapMarker);
                Customer customer1 = new Customer();
                customer1.setId(oldCustomer.getId());
                customer1.setMapMarkerId(mapMarker.getId());
                customerDao.updateByPrimaryKeySelective(customer1);
            } else {
                Customer customer1 = new Customer();
                customer1.setId(oldCustomer.getId());
                customer1.setMapMarkerId(mapMarkerList.get(0).getId());
                customerDao.updateByPrimaryKeySelective(customer1);
            }

            //查询旧标记点是否没有客户了.若没有客户则删除掉该标记点.
            Integer mapMarkerId = oldCustomer.getMapMarkerId();
            if (mapMarkerId != null) {
                CustomerExample otherMapMarkerCustomerExample = new CustomerExample();
                CustomerExample.Criteria otherMapMarkerCustomerExampleCriteria = otherMapMarkerCustomerExample.createCriteria();
                otherMapMarkerCustomerExampleCriteria.andIdNotEqualTo(oldCustomer.getId());
                otherMapMarkerCustomerExampleCriteria.andMapMarkerIdEqualTo(mapMarkerId);
                List<Customer> otherMapMarkerCustomerList = customerDao.selectByExample(otherMapMarkerCustomerExample);
                if (otherMapMarkerCustomerList.isEmpty()) {
                    //查看该标记点是否有备注，若无备注则删除
                    MapMarker mapMarker = mapMarkerDao.selectByPrimaryKey(mapMarkerId);
                    if (mapMarker != null && StringUtils.isBlank(mapMarker.getRemark())) {
                        mapMarkerDao.deleteByPrimaryKey(mapMarkerId);
                    }
                }
            }
        } else {
            //删除客户的标记点字段,同时查看该标注点是否有其他客户和备注内容,若有则保留,若无则删除标记点
            Integer mapMarkerId = oldCustomer.getMapMarkerId();
            if (mapMarkerId != null) {
                Customer customer1 = new Customer();
                customer1.setId(oldCustomer.getId());
                customer1.setMapMarkerId(null);
                customerDao.updateByPrimaryKeySelective(customer1);

                CustomerExample otherMapMarkerCustomerExample = new CustomerExample();
                CustomerExample.Criteria otherMapMarkerCustomerExampleCriteria = otherMapMarkerCustomerExample.createCriteria();
                otherMapMarkerCustomerExampleCriteria.andIdNotEqualTo(oldCustomer.getId());
                otherMapMarkerCustomerExampleCriteria.andMapMarkerIdEqualTo(mapMarkerId);
                List<Customer> otherMapMarkerCustomerList = customerDao.selectByExample(otherMapMarkerCustomerExample);
                if (otherMapMarkerCustomerList.isEmpty()) {
                    //查看该标记点是否有备注，若无备注则删除
                    MapMarker mapMarker = mapMarkerDao.selectByPrimaryKey(mapMarkerId);
                    if (mapMarker != null && StringUtils.isBlank(mapMarker.getRemark())) {
                        mapMarkerDao.deleteByPrimaryKey(mapMarkerId);
                    }
                }
            }
        }

        //编辑客户爱好信息
        List<CustomerHobbyDto> customerHobbyDtoList = customerDto.getCustomerHobbyDtoList();
        if (customerHobbyDtoList != null && !customerHobbyDtoList.isEmpty()) {
            //删除不需要的
            CustomerHobbyExample customerHobbyExample = new CustomerHobbyExample();
            CustomerHobbyExample.Criteria customerHobbyExampleCriteria = customerHobbyExample.createCriteria();
            customerHobbyExampleCriteria.andUidEqualTo(uid);
            customerHobbyExampleCriteria.andCustomerIdEqualTo(customerDto.getId());
            List<CustomerHobby> customerHobbyList = customerHobbyDao.selectByExample(customerHobbyExample);
            if (!customerHobbyList.isEmpty()) {
                for (Integer id : customerHobbyList.stream().map(CustomerHobby::getId).filter(id -> !customerHobbyDtoList.stream().map(CustomerHobbyDto::getId).collect(toList()).contains(id)).collect(toList())) {
                    customerHobbyDao.deleteByPrimaryKey(id);
                }
            }
            //再更新或新增
            for (CustomerHobbyDto customerHobbyDto : customerHobbyDtoList) {
                Integer customerHobbyId = customerHobbyDto.getId();
                if (customerHobbyId != null) {
                    //查询旧的
                    CustomerHobbyExample customerHobbyExample1 = new CustomerHobbyExample();
                    CustomerHobbyExample.Criteria customerHobbyExampleCriteria1 = customerHobbyExample1.createCriteria();
                    customerHobbyExampleCriteria1.andUidEqualTo(uid);
                    customerHobbyExampleCriteria1.andIdEqualTo(customerHobbyId);
                    CustomerHobby oldCustomerHobby = customerHobbyDao.selectByExample(customerHobbyExample1).get(0);
                    //更新已有的
                    CustomerHobby customerHobby = new CustomerHobby
                            (customerHobbyId, uid, customerHobbyDto.getCustomerId(), customerHobbyDto.getHobby(),
                                    customerHobbyDto.getSpecificHobby(), customerHobbyDto.getCustomHobby(), oldCustomerHobby.getCreateTime(), new Date());
                    customerHobbyDao.updateByExample(customerHobby, customerHobbyExample1);
                } else {
                    //新增
                    CustomerHobby customerHobby = new CustomerHobby(null, uid, newCustomer.getId(),
                            customerHobbyDto.getHobby(), customerHobbyDto.getSpecificHobby(), customerHobbyDto.getCustomHobby(), new Date(), null);
                    customerHobbyDao.insertSelective(customerHobby);
                }
            }
        } else {
            CustomerHobbyExample customerHobbyExample = new CustomerHobbyExample();
            CustomerHobbyExample.Criteria customerHobbyExampleCriteria = customerHobbyExample.createCriteria();
            customerHobbyExampleCriteria.andUidEqualTo(uid);
            customerHobbyExampleCriteria.andCustomerIdEqualTo(customerDto.getId());
            customerHobbyDao.deleteByExample(customerHobbyExample);
        }
        return ResultUtil.returnSuccess();
    }

    @Override
    @Transactional
    public Result delete(Integer uid, Integer customerId) {
        //删除客户
        CustomerExample customerExample = new CustomerExample();
        CustomerExample.Criteria customerExampleCriteria = customerExample.createCriteria();
        customerExampleCriteria.andUidEqualTo(uid);
        customerExampleCriteria.andIdEqualTo(customerId);
        customerDao.deleteByExample(customerExample);
        //删除客户爱好
        CustomerHobbyExample customerHobbyExample = new CustomerHobbyExample();
        CustomerHobbyExample.Criteria customerHobbyExampleCriteria = customerHobbyExample.createCriteria();
        customerHobbyExampleCriteria.andUidEqualTo(uid);
        customerHobbyExampleCriteria.andCustomerIdEqualTo(customerId);
        customerHobbyDao.deleteByExample(customerHobbyExample);
        //删除客户Note
        CustomerNoteExample customerNoteExample = new CustomerNoteExample();
        CustomerNoteExample.Criteria customerNoteExampleCriteria = customerNoteExample.createCriteria();
        customerNoteExampleCriteria.andUidEqualTo(uid);
        customerNoteExampleCriteria.andCustomerIdEqualTo(customerId);
        customerNoteDao.deleteByExample(customerNoteExample);
        return ResultUtil.returnSuccess();
    }

    @Override
    public Result page(Integer uid, CustomerPageDto customerPageDto) {
        CustomerExample customerExample = new CustomerExample();
        //排序
        String orderField = customerPageDto.getOrderField();
        switch (orderField) {
            case "createTime":
                orderField = "`create_time`";
                break;
            case "updateTime":
                orderField = "`update_time`";
                break;
            case "name":
                orderField = "`name`";
                break;
            case "age":
                orderField = "`age`";
                break;
            case "sex":
                orderField = "`sex`";
                break;
            case "birthday":
                orderField = "`birthday`";
                break;
            default:
                orderField = "`create_time`";
        }
        customerExample.setOrderByClause(orderField + (customerPageDto.getDesc() == null || customerPageDto.getDesc() ? " DESC" : " ASC"));
        CustomerExample.Criteria criteria = customerExample.createCriteria();
        String searchType = customerPageDto.getSearchType();
        String searchContent = customerPageDto.getSearchContent();
        if (StringUtils.isNotBlank(searchType) && StringUtils.isNotBlank(searchContent)) {
            switch (searchType) {
                case "name":
                    criteria.andNameLike("%" + searchContent.trim() + "%");
                    break;
                case "basicAddress":
                    criteria.andBasicAddressLike("%" + searchContent.trim() + "%");
                    break;
                case "detailedAddress":
                    criteria.andDetailedAddressLike("%" + searchContent.trim() + "%");
                    break;
                case "remark":
                    criteria.andRemarkLike("%" + searchContent.trim() + "%");
                    break;
                default:
                    criteria.andNameLike("%" + searchContent.trim() + "%");
            }
        }
        criteria.andUidEqualTo(uid);
        PageHelper.startPage(customerPageDto.getPageNum(), customerPageDto.getPageSize());
        List<Customer> list = customerDao.selectByExample(customerExample);
        PageInfo<Customer> pageInfo = new PageInfo<>(list);
        List<CustomerVo> customerVoList = list.stream()
                .map(customer -> {
                            CustomerHobbyExample customerHobbyExample = new CustomerHobbyExample();
                            CustomerHobbyExample.Criteria customerHobbyExampleCriteria = customerHobbyExample.createCriteria();
                            customerHobbyExampleCriteria.andUidEqualTo(uid);
                            customerHobbyExampleCriteria.andCustomerIdEqualTo(customer.getId());
                            List<CustomerHobby> customerHobbyList = customerHobbyDao.selectByExample(customerHobbyExample);
                            List<CustomerHobbyVo> customerHobbyVoList = customerHobbyList.stream().map(customerHobby ->
                                    new CustomerHobbyVo(customerHobby.getId(), customerHobby.getCustomerId(), customerHobby.getHobby(),
                                            customerHobby.getSpecificHobby(), customerHobby.getCustomHobby(), customerHobby.getCreateTime(), customerHobby.getUpdateTime())).collect(toList());
                            CustomerVo vo = new CustomerVo(customer.getId(), customer.getName(), customer.getSex(),
                                    customer.getBirthday(), customer.getAge(), customerHobbyVoList, customer.getPhone(),
                                    customer.getBasicAddress(), customer.getDetailedAddress(), customer.getLng(),
                                    customer.getLat(), customer.getRemark(), customer.getMapMarkerId(), customer.getCreateTime(), customer.getUpdateTime());
                            return vo;
                        }
                )
                .collect(toList());
        PageVo<CustomerVo> resultPageVo = new PageVo<>(pageInfo.getTotal(), pageInfo.getPageSize(), pageInfo.getPageNum(), customerVoList);
        return ResultUtil.returnSuccess(resultPageVo);
    }

    @Override
    public Result removeMapMarkerId(Integer uid, Integer markId, Integer customerId) {
        CustomerExample customerExample = new CustomerExample();
        CustomerExample.Criteria customerExampleCriteria = customerExample.createCriteria();
        customerExampleCriteria.andUidEqualTo(uid);
        customerExampleCriteria.andMapMarkerIdEqualTo(markId);
        customerExampleCriteria.andIdEqualTo(customerId);
        List<Customer> customerList = customerDao.selectByExample(customerExample);
        if (customerList.isEmpty()) {
            return ResultUtil.returnError("当前客户不存在!");
        }
        Customer customer = customerList.get(0);
        customer.setMapMarkerId(null);
        customer.setUpdateTime(new Date());
        customerDao.updateByPrimaryKey(customer);
        return ResultUtil.returnSuccess();
    }

    @Override
    public Result getNoMapMarkerIdCustomerList(Integer uid) {
        CustomerExample customerExample = new CustomerExample();
        CustomerExample.Criteria customerExampleCriteria = customerExample.createCriteria();
        customerExample.setOrderByClause("`create_time` DESC");
        customerExampleCriteria.andUidEqualTo(uid);
        customerExampleCriteria.andMapMarkerIdIsNull();

        List<CustomerVo> customerVoList = customerDao.selectByExample(customerExample).stream().map(customer -> {
            CustomerHobbyExample customerHobbyExample = new CustomerHobbyExample();
            CustomerHobbyExample.Criteria customerHobbyExampleCriteria = customerHobbyExample.createCriteria();
            customerHobbyExample.setOrderByClause("`create_time` ASC");
            customerHobbyExampleCriteria.andUidEqualTo(uid);
            customerHobbyExampleCriteria.andCustomerIdEqualTo(customer.getId());
            List<CustomerHobbyVo> customerHobbyVoList = customerHobbyDao.selectByExample(customerHobbyExample).stream()
                    .map(customerHobby -> new CustomerHobbyVo(customerHobby.getId(), customerHobby.getCustomerId(),
                            customerHobby.getHobby(), customerHobby.getSpecificHobby(), customerHobby.getCustomHobby(),
                            customerHobby.getCreateTime(), customerHobby.getUpdateTime())).collect(toList());

            return new CustomerVo(customer.getId(), customer.getName(), customer.getSex(), customer.getBirthday(), customer.getAge(),
                    customerHobbyVoList, customer.getPhone(), customer.getBasicAddress(),
                    customer.getDetailedAddress(), customer.getLng(), customer.getLat(),
                    customer.getRemark(), customer.getMapMarkerId(), customer.getCreateTime(), customer.getUpdateTime());
        }).collect(toList());
        return ResultUtil.returnSuccess(customerVoList);
    }

    @Override
    public Result editMapMarkId(Integer uid, Integer markId, Integer customerId) {
        MapMarkerExample mapMarkerExample = new MapMarkerExample();
        MapMarkerExample.Criteria mapMarkerExampleCriteria = mapMarkerExample.createCriteria();
        mapMarkerExampleCriteria.andUidEqualTo(uid);
        mapMarkerExampleCriteria.andIdEqualTo(markId);
        List<MapMarker> mapMarkerList = mapMarkerDao.selectByExample(mapMarkerExample);
        if (mapMarkerList.isEmpty()) {
            return ResultUtil.returnError("当前标注不存在!");
        }
        CustomerExample customerExample = new CustomerExample();
        CustomerExample.Criteria customerExampleCriteria = customerExample.createCriteria();
        customerExampleCriteria.andUidEqualTo(uid);
        customerExampleCriteria.andIdEqualTo(customerId);
        List<Customer> customerList = customerDao.selectByExample(customerExample);
        if (customerList.isEmpty()) {
            return ResultUtil.returnError("当前客户不存在!");
        }
        Customer customer = customerList.get(0);
        customer.setUpdateTime(new Date());
        customer.setMapMarkerId(markId);
        customerDao.updateByExample(customer, customerExample);
        CustomerHobbyExample customerHobbyExample = new CustomerHobbyExample();
        CustomerHobbyExample.Criteria customerHobbyExampleCriteria = customerHobbyExample.createCriteria();
        customerHobbyExampleCriteria.andUidEqualTo(uid);
        customerHobbyExampleCriteria.andCustomerIdEqualTo(customerId);
        List<CustomerHobbyVo> customerHobbyVoList = customerHobbyDao.selectByExample(customerHobbyExample).stream().map(
                customerHobby -> new CustomerHobbyVo(customerHobby.getId(), customerHobby.getCustomerId(), customerHobby.getHobby(),
                        customerHobby.getSpecificHobby(), customerHobby.getCustomHobby(), customerHobby.getCreateTime(), customerHobby.getUpdateTime())
        ).collect(toList());
        CustomerVo customerVo = new CustomerVo(customerId, customer.getName(), customer.getSex(), customer.getBirthday(), customer.getAge(), customerHobbyVoList, customer.getPhone(),
                customer.getBasicAddress(), customer.getDetailedAddress(), customer.getLng(), customer.getLat(),
                customer.getRemark(), customer.getMapMarkerId(), customer.getCreateTime(), customer.getUpdateTime());
        return ResultUtil.returnSuccess(customerVo);
    }
}
