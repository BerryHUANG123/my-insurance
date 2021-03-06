package com.myinsurance.model.vo;

import java.util.List;

public class PageVo<T> extends BaseVo{

    private Long totalSize;

    private Integer pageSize;

    private Integer pageNum;

    private List<T> rows;

    public PageVo() {

    }

    public PageVo(Long totalSize, Integer pageSize, Integer pageNum, List<T> rows) {
        this.totalSize = totalSize;
        this.pageSize = pageSize;
        this.pageNum = pageNum;
        this.rows = rows;
    }

    public Long getTotalSize() {
        return totalSize;
    }

    public void setTotalSize(Long totalSize) {
        this.totalSize = totalSize;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

    public Integer getPageNum() {
        return pageNum;
    }

    public void setPageNum(Integer pageNum) {
        this.pageNum = pageNum;
    }

    public List<T> getRows() {
        return rows;
    }

    public void setRows(List<T> rows) {
        this.rows = rows;
    }
}
