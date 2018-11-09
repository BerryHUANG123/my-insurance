package com.myinsurance.service;

import com.myinsurance.model.persistant.User;
import com.myinsurance.model.view.Result;

public interface ILoginService {

    User doLogin(String userName, String password);
}
