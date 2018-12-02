package com.myinsurance.service;

import com.myinsurance.model.dto.CustomerNoteDto;
import com.myinsurance.model.dto.CustomerNotePageDto;
import com.myinsurance.model.vo.Result;

public interface ICustomerNoteService {

    Result pageData(Integer uid, CustomerNotePageDto customerNotePageDto);

    Result create(Integer uid, CustomerNoteDto customerNoteDto);

    Result edit(Integer uid, CustomerNoteDto customerNoteDto);

    Result delete(Integer uid,Integer id);
}
