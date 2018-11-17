package com.myinsurance.model.dto;

import java.util.List;

/**
 * 业务实体Mark(页面传来的数据)
 */
public class MarkDto extends BaseDto {

    /**
     * 标注ID
     */
    private Integer markId;
    /**
     * 备注内容
     */
    private String remark;
    /**
     * 经度
     */
    private Double lng;
    /**
     * 纬度
     */
    private Double lat;

    private List<CustomerDto> customerDtoList;

    public Integer getMarkId() {
        return markId;
    }

    public void setMarkId(Integer markId) {
        this.markId = markId;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
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

    public List<CustomerDto> getCustomerDtoList() {
        return customerDtoList;
    }

    public void setCustomerDtoList(List<CustomerDto> customerDtoList) {
        this.customerDtoList = customerDtoList;
    }
}
