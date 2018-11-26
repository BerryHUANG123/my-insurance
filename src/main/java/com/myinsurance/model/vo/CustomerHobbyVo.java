package com.myinsurance.model.vo;

import java.util.Date;

public class CustomerHobbyVo {
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

    private Date createTime;

    private Date updateTime;

    public CustomerHobbyVo() {
    }

    public CustomerHobbyVo(Integer id, Integer customerId, String hobby, String specificHobby, String customHobby, Date createTime, Date updateTime) {
        this.id = id;
        this.customerId = customerId;
        this.hobby = hobby;
        this.specificHobby = specificHobby;
        this.customHobby = customHobby;
        this.createTime = createTime;
        this.updateTime = updateTime;
    }

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
