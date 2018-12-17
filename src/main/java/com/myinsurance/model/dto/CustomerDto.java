package com.myinsurance.model.dto;

import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

public class CustomerDto extends BaseDto {

    private Integer id;

    private String name;

    private String sex;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date birthday;

    private Integer age;

    private List<CustomerHobbyDto> customerHobbyDtoList;

    private String phone;

    private String basicAddress;

    private String detailedAddress;

    private Double lng;

    private Double lat;

    private Boolean createMarker;

    private String remark;

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

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public List<CustomerHobbyDto> getCustomerHobbyDtoList() {
        return customerHobbyDtoList;
    }

    public void setCustomerHobbyDtoList(List<CustomerHobbyDto> customerHobbyDtoList) {
        this.customerHobbyDtoList = customerHobbyDtoList;
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

    public Boolean getCreateMarker() {
        return createMarker;
    }

    public void setCreateMarker(Boolean createMarker) {
        this.createMarker = createMarker;
    }
}

