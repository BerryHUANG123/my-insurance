package com.myinsurance.service.impl;

import com.myinsurance.dao.IUserDao;
import com.myinsurance.model.persistant.User;
import com.myinsurance.model.persistant.UserExample;
import com.myinsurance.model.view.Result;
import com.myinsurance.service.BaseService;
import com.myinsurance.service.ILoginService;
import com.myinsurance.utils.ResultUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LoginServiceImpl extends BaseService implements ILoginService {
    @Autowired
    private IUserDao userDao;

    @Override
    public boolean doLogin(String userName, String password) {
        UserExample userExample = new UserExample();
        UserExample.Criteria criteria = userExample.createCriteria();
        criteria.andUserNameEqualTo(userName);
        criteria.andPasswordEqualTo(password);
        List<User> userList = userDao.selectByExample(userExample);
        if (userList == null || userList.isEmpty()) {
            return false;
        }
        return true;
    }
}
