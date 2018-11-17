package com.myinsurance.service;

import com.myinsurance.model.po.User;

public interface ILoginService {

    User doLogin(String userName, String password);
}
