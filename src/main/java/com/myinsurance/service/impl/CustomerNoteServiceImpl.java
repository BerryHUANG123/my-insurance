package com.myinsurance.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.myinsurance.dao.ICustomerDao;
import com.myinsurance.dao.ICustomerNoteDao;
import com.myinsurance.model.dto.CustomerNoteDto;
import com.myinsurance.model.dto.CustomerNotePageDto;
import com.myinsurance.model.po.Customer;
import com.myinsurance.model.po.CustomerExample;
import com.myinsurance.model.po.CustomerNote;
import com.myinsurance.model.po.CustomerNoteExample;
import com.myinsurance.model.vo.CustomerNoteVo;
import com.myinsurance.model.vo.PageVo;
import com.myinsurance.model.vo.Result;
import com.myinsurance.service.ICustomerNoteService;
import com.myinsurance.utils.ResultUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerNoteServiceImpl implements ICustomerNoteService {

    @Autowired
    private ICustomerNoteDao customerNoteDao;
    @Autowired
    private ICustomerDao customerDao;

    @Override
    public Result pageData(Integer uid, CustomerNotePageDto customerNotePageDto) {
        CustomerNoteExample customerNoteExample = new CustomerNoteExample();

        //排序
        String orderField = customerNotePageDto.getOrderField();
        switch (orderField) {
            case "createTime":
                orderField = "`create_time`";
                break;
            case "updateTime":
                orderField = "`update_time`";
                break;
            default:
                orderField = "`create_time`";
        }
        customerNoteExample.setOrderByClause((orderField + " ") + (customerNotePageDto.getDesc() == null || !customerNotePageDto.getDesc() ? "ASC" : "DESC"));
        CustomerNoteExample.Criteria criteria = customerNoteExample.createCriteria();
        criteria.andUidEqualTo(uid);
        criteria.andCustomerIdEqualTo(customerNotePageDto.getCustomerId());

        //搜索内容
        String searchContent = customerNotePageDto.getSearchContent();
        if (StringUtils.isNotBlank(searchContent)) {
            criteria.andContentLike("%" + searchContent.trim() + "%");
        }

        PageHelper.startPage(customerNotePageDto.getPageNum(), customerNotePageDto.getPageSize());
        List<CustomerNote> customerNoteList = customerNoteDao.selectByExample(customerNoteExample);
        List<CustomerNoteVo> customerNoteVoList = customerNoteList.stream().map(customerNote -> new CustomerNoteVo(customerNote.getId(), customerNote.getCustomerId(), customerNote.getContent(), customerNote.getCreateTime(), customerNote.getUpdateTime())).collect(Collectors.toList());
        PageInfo<CustomerNote> pageInfo = new PageInfo<>(customerNoteList);
        PageVo<CustomerNoteVo> resultPageVo = new PageVo<>(pageInfo.getTotal(), pageInfo.getPageSize(), pageInfo.getPageNum(), customerNoteVoList);
        return ResultUtil.returnSuccess(resultPageVo);
    }

    @Override
    public Result create(Integer uid, CustomerNoteDto customerNoteDto) {
        String content = customerNoteDto.getContent();
        if (StringUtils.isBlank(content)) {
            return ResultUtil.returnError("请输入Note内容!");
        }
        CustomerExample customerExample = new CustomerExample();
        CustomerExample.Criteria criteria = customerExample.createCriteria();
        criteria.andUidEqualTo(uid);
        criteria.andIdEqualTo(customerNoteDto.getCustomerId());
        List<Customer> list = customerDao.selectByExample(customerExample);
        if (list == null || list.isEmpty()) {
            return ResultUtil.returnError("当前客户信息不存在!");
        }

        CustomerNote customerNote = new CustomerNote();
        customerNote.setUid(uid);
        customerNote.setCustomerId(customerNoteDto.getCustomerId());
        customerNote.setContent(content);
        customerNote.setCreateTime(new Date());
        int insertResult = customerNoteDao.insertSelective(customerNote);
        if (insertResult > 0) {
            return ResultUtil.returnSuccess();
        } else {
            return ResultUtil.returnError("数据库无法保存数据,请重试!");
        }

    }

    @Override
    public Result edit(Integer uid, CustomerNoteDto customerNoteDto) {

        String content = customerNoteDto.getContent();
        if (StringUtils.isBlank(content)) {
            return ResultUtil.returnError("Note内容不能为空!");
        }

        Integer id = customerNoteDto.getId();
        CustomerNoteExample customerNoteExample = new CustomerNoteExample();
        CustomerNoteExample.Criteria criteria = customerNoteExample.createCriteria();
        criteria.andIdEqualTo(id);
        criteria.andUidEqualTo(uid);
        List<CustomerNote> list = customerNoteDao.selectByExample(customerNoteExample);
        CustomerNote customerNote;
        if (list != null && !list.isEmpty()) {
            customerNote = list.get(0);
        } else {
            return ResultUtil.returnError("该记录已不存在!");
        }

        customerNote.setContent(content);
        customerNote.setUpdateTime(new Date());
        customerNoteDao.updateByPrimaryKey(customerNote);
        CustomerNote newCustomerNote = customerNoteDao.selectByPrimaryKey(customerNote.getId());
        CustomerNoteVo customerNoteVo = new CustomerNoteVo(
                newCustomerNote.getId(), newCustomerNote.getCustomerId(), newCustomerNote.getContent(),
                newCustomerNote.getCreateTime(), newCustomerNote.getUpdateTime());
        return ResultUtil.returnSuccess(customerNoteVo);
    }

    @Override
    public Result delete(Integer uid, Integer id) {
        CustomerNoteExample customerNoteExample = new CustomerNoteExample();
        CustomerNoteExample.Criteria criteria = customerNoteExample.createCriteria();
        criteria.andUidEqualTo(uid);
        criteria.andIdEqualTo(id);
        customerNoteDao.deleteByExample(customerNoteExample);
        return ResultUtil.returnSuccess();
    }
}
