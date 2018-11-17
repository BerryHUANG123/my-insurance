package com.myinsurance.model.vo;


import java.util.Date;

public class CustomerVo extends BaseVo {

    private Integer id;

    private String name;

    private String sex;

    private Date birthday;

    private Integer age;

    private String phone;

    private String address;

    private String remark;

    public CustomerVo() {

    }

    public CustomerVo(Integer id, String name, String sex, Date birthday, String phone, String address, String remark) {
        this.id = id;
        this.name = name;
        this.sex = sex;
        this.birthday = birthday;
        this.phone = phone;
        this.address = address;
        this.remark = remark;
    }


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public Date getBirthday() {
        return birthday;
    }

    public void setBirthday(Date birthday) {
        this.birthday = birthday;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
}

