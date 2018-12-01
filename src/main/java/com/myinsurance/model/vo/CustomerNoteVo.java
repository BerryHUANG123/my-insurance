package com.myinsurance.model.vo;

import java.util.Date;

public class CustomerNoteVo extends BaseVo {

    private Integer id;

    private Integer customerId;

    private String content;

    private Date createTime;

    private Date updateTime;

    public CustomerNoteVo() {
    }

    public CustomerNoteVo(Integer id, Integer customerId, String content, Date createTime, Date updateTime) {
        this.id = id;
        this.customerId = customerId;
        this.content = content;
        this.createTime = createTime;
        this.updateTime = updateTime;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
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
