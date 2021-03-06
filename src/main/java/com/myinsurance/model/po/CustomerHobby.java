package com.myinsurance.model.po;

import java.util.Date;

/**
 * This class was generated by MyBatis Generator.
 * This class corresponds to the database table t_customer_hobby
 */
public class CustomerHobby {
    /**
     * Database Column Remarks:
     * 主键ID
     * <p>
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column t_customer_hobby.id
     *
     * @mbg.generated 2018-12-09 17:47:02
     */
    private Integer id;

    /**
     * Database Column Remarks:
     * 用户ID
     * <p>
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column t_customer_hobby.uid
     *
     * @mbg.generated 2018-12-09 17:47:02
     */
    private Integer uid;

    /**
     * Database Column Remarks:
     * 客户ID
     * <p>
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column t_customer_hobby.customer_id
     *
     * @mbg.generated 2018-12-09 17:47:02
     */
    private Integer customerId;

    /**
     * Database Column Remarks:
     * 爱好主类型
     * <p>
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column t_customer_hobby.hobby
     *
     * @mbg.generated 2018-12-09 17:47:02
     */
    private String hobby;

    /**
     * Database Column Remarks:
     * 爱好子类型
     * <p>
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column t_customer_hobby.specific_hobby
     *
     * @mbg.generated 2018-12-09 17:47:02
     */
    private String specificHobby;

    /**
     * Database Column Remarks:
     * 自定义爱好内容
     * <p>
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column t_customer_hobby.custom_hobby
     *
     * @mbg.generated 2018-12-09 17:47:02
     */
    private String customHobby;

    /**
     * Database Column Remarks:
     * 创建时间
     * <p>
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column t_customer_hobby.create_time
     *
     * @mbg.generated 2018-12-09 17:47:02
     */
    private Date createTime;

    /**
     * Database Column Remarks:
     * 更新时间
     * <p>
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column t_customer_hobby.update_time
     *
     * @mbg.generated 2018-12-09 17:47:02
     */
    private Date updateTime;

    public CustomerHobby() {

    }

    public CustomerHobby(Integer id, Integer uid, Integer customerId, String hobby, String specificHobby, String customHobby, Date createTime, Date updateTime) {
        this.id = id;
        this.uid = uid;
        this.customerId = customerId;
        this.hobby = hobby;
        this.specificHobby = specificHobby;
        this.customHobby = customHobby;
        this.createTime = createTime;
        this.updateTime = updateTime;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column t_customer_hobby.id
     *
     * @return the value of t_customer_hobby.id
     * @mbg.generated 2018-12-09 17:47:02
     */
    public Integer getId() {
        return id;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column t_customer_hobby.id
     *
     * @param id the value for t_customer_hobby.id
     * @mbg.generated 2018-12-09 17:47:02
     */
    public void setId(Integer id) {
        this.id = id;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column t_customer_hobby.uid
     *
     * @return the value of t_customer_hobby.uid
     * @mbg.generated 2018-12-09 17:47:02
     */
    public Integer getUid() {
        return uid;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column t_customer_hobby.uid
     *
     * @param uid the value for t_customer_hobby.uid
     * @mbg.generated 2018-12-09 17:47:02
     */
    public void setUid(Integer uid) {
        this.uid = uid;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column t_customer_hobby.customer_id
     *
     * @return the value of t_customer_hobby.customer_id
     * @mbg.generated 2018-12-09 17:47:02
     */
    public Integer getCustomerId() {
        return customerId;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column t_customer_hobby.customer_id
     *
     * @param customerId the value for t_customer_hobby.customer_id
     * @mbg.generated 2018-12-09 17:47:02
     */
    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column t_customer_hobby.hobby
     *
     * @return the value of t_customer_hobby.hobby
     * @mbg.generated 2018-12-09 17:47:02
     */
    public String getHobby() {
        return hobby;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column t_customer_hobby.hobby
     *
     * @param hobby the value for t_customer_hobby.hobby
     * @mbg.generated 2018-12-09 17:47:02
     */
    public void setHobby(String hobby) {
        this.hobby = hobby == null ? null : hobby.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column t_customer_hobby.specific_hobby
     *
     * @return the value of t_customer_hobby.specific_hobby
     * @mbg.generated 2018-12-09 17:47:02
     */
    public String getSpecificHobby() {
        return specificHobby;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column t_customer_hobby.specific_hobby
     *
     * @param specificHobby the value for t_customer_hobby.specific_hobby
     * @mbg.generated 2018-12-09 17:47:02
     */
    public void setSpecificHobby(String specificHobby) {
        this.specificHobby = specificHobby == null ? null : specificHobby.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column t_customer_hobby.custom_hobby
     *
     * @return the value of t_customer_hobby.custom_hobby
     * @mbg.generated 2018-12-09 17:47:02
     */
    public String getCustomHobby() {
        return customHobby;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column t_customer_hobby.custom_hobby
     *
     * @param customHobby the value for t_customer_hobby.custom_hobby
     * @mbg.generated 2018-12-09 17:47:02
     */
    public void setCustomHobby(String customHobby) {
        this.customHobby = customHobby == null ? null : customHobby.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column t_customer_hobby.create_time
     *
     * @return the value of t_customer_hobby.create_time
     * @mbg.generated 2018-12-09 17:47:02
     */
    public Date getCreateTime() {
        return createTime;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column t_customer_hobby.create_time
     *
     * @param createTime the value for t_customer_hobby.create_time
     * @mbg.generated 2018-12-09 17:47:02
     */
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column t_customer_hobby.update_time
     *
     * @return the value of t_customer_hobby.update_time
     * @mbg.generated 2018-12-09 17:47:02
     */
    public Date getUpdateTime() {
        return updateTime;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column t_customer_hobby.update_time
     *
     * @param updateTime the value for t_customer_hobby.update_time
     * @mbg.generated 2018-12-09 17:47:02
     */
    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }
}