package com.myinsurance.model.dto;

import java.io.Serializable;

public class CustomerHobbyDto implements Serializable {

    /**
     * 主键ID
     */
    private Integer id;

    /**
     * 用户ID
     */
    private Integer uid;

    /**
     * 客户ID
     */
    private Integer customerId;

    /**
     * 爱好主类型
     */
    private String hobby;

    /**
     * 爱好子类型
     */
    private String specificHobby;

    /**
     * 自定义爱好内容
     */
    private String customHobby;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUid() {
        return uid;
    }

    public void setUid(Integer uid) {
        this.uid = uid;
    }

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public String getHobby() {
        return hobby;
    }

    public void setHobby(String hobby) {
        this.hobby = hobby == null ? null : hobby.trim();
    }

    public String getSpecificHobby() {
        return specificHobby;
    }

    public void setSpecificHobby(String specificHobby) {
        this.specificHobby = specificHobby == null ? null : specificHobby.trim();
    }

    public String getCustomHobby() {
        return customHobby;
    }

    public void setCustomHobby(String customHobby) {
        this.customHobby = customHobby == null ? null : customHobby.trim();
    }

}
