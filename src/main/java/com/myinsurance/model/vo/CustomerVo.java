package com.myinsurance.model.vo;


import java.util.Date;
import java.util.List;

public class CustomerVo extends BaseVo {

    private Integer id;

    private String name;

    private String sex;

    private Date birthday;

    private Integer age;

    private List<CustomerHobbyVo> customerHobbyVoList;

    private String phone;

    private String basicAddress;

    private String detailedAddress;

    private Double lng;

    private Double lat;

    private String remark;

    private Integer mapMarkerId;

    private Date createTime;

    private Date updateTime;

    public CustomerVo() {

    }

    public CustomerVo(Integer id, String name, String sex, Date birthday, Integer age, List<CustomerHobbyVo> customerHobbyVoList, String phone, String basicAddress, String detailedAddress, Double lng, Double lat, String remark, Integer mapMarkerId, Date createTime, Date updateTime) {
        this.id = id;
        this.name = name;
        this.sex = sex;
        this.birthday = birthday;
        this.age = age;
        this.customerHobbyVoList = customerHobbyVoList;
        this.phone = phone;
        this.basicAddress = basicAddress;
        this.detailedAddress = detailedAddress;
        this.lng = lng;
        this.lat = lat;
        this.remark = remark;
        this.mapMarkerId = mapMarkerId;
        this.createTime = createTime;
        this.updateTime = updateTime;
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

    public String getBasicAddress() {
        return basicAddress;
    }

    public void setBasicAddress(String basicAddress) {
        this.basicAddress = basicAddress;
    }

    public String getDetailedAddress() {
        return detailedAddress;
    }

    public void setDetailedAddress(String detailedAddress) {
        this.detailedAddress = detailedAddress;
    }

    public Double getLng() {
        return lng;
    }

    public void setLng(Double lng) {
        this.lng = lng;
    }

    public Double getLat() {
        return lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    public Integer getMapMarkerId() {
        return mapMarkerId;
    }

    public void setMapMarkerId(Integer mapMarkerId) {
        this.mapMarkerId = mapMarkerId;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public List<CustomerHobbyVo> getCustomerHobbyVoList() {
        return customerHobbyVoList;
    }

    public void setCustomerHobbyVoList(List<CustomerHobbyVo> customerHobbyVoList) {
        this.customerHobbyVoList = customerHobbyVoList;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }
}

