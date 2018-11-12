package com.myinsurance.model.view;

import java.util.List;

public class Page<T> {

    private Long totalSize;

    private Integer pageSize;

    private Integer pageNum;

    private List<T> rows;

    public Page() {

    }

    public Page(Long totalSize, Integer pageSize, Integer pageNum, List<T> rows) {
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
