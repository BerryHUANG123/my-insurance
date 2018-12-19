package com.myinsurance.model.dto;

public class CustomerPageDto extends PageDto{

    private String parentHobbyType;
    private String childHobbyType;

    public String getParentHobbyType() {
        return parentHobbyType;
    }

    public void setParentHobbyType(String parentHobbyType) {
        this.parentHobbyType = parentHobbyType;
    }

    public String getChildHobbyType() {
        return childHobbyType;
    }

    public void setChildHobbyType(String childHobbyType) {
        this.childHobbyType = childHobbyType;
    }
}
