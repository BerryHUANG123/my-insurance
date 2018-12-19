<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="common/headJstl.jsp" %>
<html>
<head>
    <base href="<%=basePath%>/">
    <title><%=title%>
    </title>
    <%@ include file="/WEB-INF/jsp/common/headCssJs.jsp" %>
    <link rel="stylesheet" type="text/css" href="<%=basePath%>/resources/css/index.css?ver=<%=indexCssVer%>"/>
</head>
<body>
<%--每个页面都必须有的,该模块名称 和父级模块名称--%>
<input type="hidden" id="moduleInfo" data-name="map" data-parentName="map"/>
<%--公共上部导航栏--%>
<%@ include file="/WEB-INF/jsp/common/topNav.jsp" %>
<%--<div id="addressSearchDiv">
    地址搜索添加备注
    <input type="text" id="addressSearch"/>
</div>--%>
<div class="clear-float"></div>
<div id="map_canvas"></div>
<div id="controlSwitchDiv">
    <span><input type="checkbox" id="geolocationSwitch"/>当前位置</span>
    &nbsp;
    <span><input type="checkbox" id="mapTypeSwitch"/>地图切换</span>

</div>
<div class="modal fade" id="addMarkModal" tabindex="-1" role="dialog" aria-hidden="true" style="display: none;">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span>
                </button>
                <h4 class="modal-title">添加标注</h4>
            </div>
            <div class="modal-body">
                <p>当前坐标： 经度:<span data-type="lng"></span>,纬度:<span data-type="lat"></span></p>
                <div class="border-width-1px border-style-solid border-color-darkgray border-radius-5px">
                    <div class="bg-color-darkgray ft-color-white text-center padding-left-5px padding-top-5px padding-bottom-5px">
                        客户信息
                    </div>
                    <div class="padding-bottom-5px padding-top-5px padding-left-5px padding-right-5px">
                        <table>
                            <tr>
                                <td>姓名:</td>
                                <td>
                                    <input class="form-control" type="text" data-type="name" placeholder="请输入客户姓名"/>
                                </td>
                            </tr>
                            <tr>
                                <td>性别:</td>
                                <td>
                                    <div class="margin-bottom-5px">
                                        <label class="radio-inline">
                                            <input type="radio" name="add-sex" data-type="sex" value="male"
                                                   checked="checked"/>男
                                        </label>
                                        &nbsp;
                                        <label class="radio-inline">
                                            <input type="radio" name="add-sex" data-type="sex" value="female"/>女
                                        </label>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>年龄:</td>
                                <td><input class="form-control" type="text" data-type="age" placeholder="请输入年龄"/></td>
                            </tr>
                            <tr>
                                <td>生日:</td>
                                <td>
                                    <div class="input-group date form_date" data-type="birthdayInput">
                                        <input class="form-control" data-type="birthday" size="16" type="text" value="">
                                        <span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span>
                                        <span class="input-group-addon"><span
                                                class="glyphicon glyphicon-calendar"></span></span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>爱好:</td>
                                <td class="bg-color-darkgray border-radius-5px padding-left-5px padding-top-5px padding-bottom-5px">
                                    <div class="pull-left" data-type="hobbyDiv"></div>
                                    <div class="padding-top-5px padding-left-5px padding-right-5px pull-right">
                                        <a class="cursor-pointer" href="javascript:;" data-type="addHobbyBtn">[+]</a>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>电话:</td>
                                <td><input class="form-control" type="text" data-type="phone" placeholder="请输入客户电话"/>
                                </td>
                            </tr>
                            <tr>
                                <td>地址:</td>
                                <td><textarea class="form-control" data-type="basicAddress"
                                              placeholder="请输入联络地址"></textarea>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    备注:
                                </td>
                                <td><textarea class="form-control" data-type="customer-remark"
                                              placeholder="请输入客户备注信息"></textarea></td>
                            </tr>
                        </table>
                    </div>
                </div>
                <br/>
                <div class="border-width-1px border-style-solid border-color-darkgray border-radius-5px">
                    <div class="bg-color-darkgray ft-color-white text-center padding-left-5px padding-top-5px padding-bottom-5px">
                        标注信息
                    </div>
                    <div class="padding-bottom-5px padding-top-5px padding-left-5px padding-right-5px">
                        <table>
                            <tr>
                                <td>备注:</td>
                                <td><textarea class="form-control" data-type="marker-remark"
                                              placeholder="请输入标记点备注信息"></textarea></td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                <button type="button" class="btn btn-primary" id="saveMarkBtn">保存</button>
            </div>
        </div>
    </div>
</div>
<%--<div class="modal fade" id="editMarkModal" tabindex="-1" role="dialog" aria-hidden="true" style="display: none;">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span>
                </button>
                <h4 class="modal-title">编辑标注</h4>
            </div>
            <div class="modal-body">
                <p>当前坐标： 经度:<span data-type="lng"></span>,纬度:<span data-type="lat"></span></p>
                <div>
                    <input type="hidden" data-type="customerId"/>
                    <input type="hidden" data-type="markId"/>
                </div>

                <div class="border-width-1px border-style-solid border-color-darkgray border-radius-5px">
                    <div class="bg-color-darkgray ft-color-white text-center padding-left-5px padding-top-5px padding-bottom-5px">
                        客户信息
                    </div>
                    <div class="padding-bottom-5px padding-top-5px padding-left-5px padding-right-5px">
                        <table>
                            <tr>
                                <td>姓名:</td>
                                <td>
                                    <input class="form-control" type="text" data-type="name" placeholder="请输入客户姓名"/>
                                </td>
                            </tr>
                            <tr>
                                <td>性别:</td>
                                <td>
                                    <div class="margin-bottom-5px">
                                        <label class="radio-inline">
                                            <input type="radio" name="edit-sex" data-type="sex" value="male"
                                                   checked="checked"/>男
                                        </label>
                                        &nbsp;
                                        <label class="radio-inline">
                                            <input type="radio" name="edit-sex" data-type="sex" value="female"/>女
                                        </label>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>年龄:</td>
                                <td><input class="form-control" type="text" data-type="age" placeholder="请输入年龄"/></td>
                            </tr>
                            <tr>
                                <td>生日:</td>
                                <td>
                                    <div class="input-group date form_date" data-type="birthdayInput">
                                        <input class="form-control" data-type="birthday" size="16" type="text" value="">
                                        <span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span>
                                        <span class="input-group-addon"><span
                                                class="glyphicon glyphicon-calendar"></span></span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>爱好:</td>
                                <td class="bg-color-darkgray border-radius-5px padding-left-5px padding-top-5px padding-bottom-5px">
                                    <div class="pull-left" data-type="hobbyDiv"></div>
                                    <div class="padding-top-5px padding-left-5px padding-right-5px pull-right">
                                        <a class="cursor-pointer" href="javascript:;" data-type="addHobbyBtn">[+]</a>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>电话:</td>
                                <td><input class="form-control" type="text" data-type="phone" placeholder="请输入客户电话"/>
                                </td>
                            </tr>
                            <tr>
                                <td>地址:</td>
                                <td><textarea class="form-control" data-type="basicAddress" placeholder="请输入联络地址"></textarea>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    备注:
                                </td>
                                <td><textarea class="form-control" data-type="customer-remark"
                                              placeholder="请输入客户备注信息"></textarea></td>
                            </tr>
                        </table>
                    </div>
                </div>
                <br/>
                <div class="border-width-1px border-style-solid border-color-darkgray border-radius-5px">
                    <div class="bg-color-darkgray ft-color-white text-center padding-left-5px padding-top-5px padding-bottom-5px">
                        标注信息
                    </div>
                    <div class="padding-bottom-5px padding-top-5px padding-left-5px padding-right-5px">
                        <table>
                            <tr>
                                <td>备注:</td>
                                <td><textarea class="form-control" data-type="marker-remark"
                                              placeholder="请输入标记点备注信息"></textarea></td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                <button type="button" class="btn btn-primary" id="editMarkBtn">保存</button>
            </div>
        </div>
    </div>
</div>--%>
<div class="modal fade" id="editMarkModal" tabindex="-1" role="dialog" aria-hidden="true" style="display: none;">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span>
                </button>
                <h4 class="modal-title">编辑标注</h4>
            </div>
            <div class="modal-body">
                <div>
                    <input type="hidden" data-type="markId"/>
                </div>
                <%--<p>当前坐标： 经度:<span data-type="lng"></span>,纬度:<span data-type="lat"></span></p>--%>
                <div class="padding-all-2px">
                    <div class="pull-left margin-right-2px ft-weight-bolder padding-top-7px">
                        添加尚无标注点的客户 :
                    </div>
                   <div class="pull-left">
                       <select class="form-control" style="min-width:100px;max-width:200px;" data-type="noMapMarkerIdCustomerList">
                       </select>
                   </div>
                    <div class="pull-left padding-top-7px padding-left-5px">
                        <span class="glyphicon glyphicon-ok cursor-pointer" data-type="addToCustomerListBtn" title="添加到客户列表"></span>
                    </div>
                    <div class="clear-float"></div>
                </div>
                <div class="border-width-1px border-style-solid border-color-darkgray border-radius-5px">
                    <div class="bg-color-darkgray ft-color-white text-center padding-left-5px padding-top-5px padding-bottom-5px">
                        客户列表
                    </div>
                    <div class="padding-bottom-5px padding-top-5px padding-left-5px padding-right-5px">
                        <ul class="list-group" data-type="customerList" style="max-height:300px;overflow:auto;">

                        </ul>
                    </div>
                </div>
                <br/>
                <div class="border-width-1px border-style-solid border-color-darkgray border-radius-5px">
                    <div class="bg-color-darkgray ft-color-white text-center padding-left-5px padding-top-5px padding-bottom-5px">
                        标注信息
                    </div>
                    <div class="padding-bottom-5px padding-top-5px padding-left-5px padding-right-5px">
                        <table>
                            <tr>
                                <td>备注:</td>
                                <td><textarea class="form-control" data-type="marker-remark"
                                              placeholder="请输入标记点备注信息"></textarea></td>
                            </tr>
                        </table>
                        <div>
                            <button class="btn btn-primary btn-sm pull-right" id="editMarkBtn">保存</button>
                            <div class="clear-float"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="editNoteModal" tabindex="-1" role="dialog" aria-hidden="true" style="display: none;">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span>
                </button>
                <h4 class="modal-title">编辑Note</h4>
            </div>
            <div class="modal-body">

                <div class="hidden" id="createCustomerNoteDiv">
                    <table class="margin-auto">
                        <tr>
                            <td><label>内容:</label></td>
                            <td>
                                <textarea class="form-control" data-type="content" placeholder="请输入Note内容" rows="20"
                                          cols="60"></textarea>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2" class="text-center">
                                <button class="btn btn-primary btn-sm" data-type="saveBtn">保存</button>
                                <button class="btn btn-info btn-sm" data-type="returnBtn">返回</button>
                            </td>
                        </tr>
                    </table>
                </div>

                <div id="showCustomerNoteDiv">
                    <div>
                        <button class="btn btn-primary btn-sm border-radius-5px padding-all-5px cursor-pointer margin-right-5px pull-right"
                                data-type="createBtn" title="新增Note">新增Note
                        </button>
                    </div>
                    <div class="clear-float"></div>
                    <div class="margin-left-5px margin-right-5px" class="pageTableDiv" id="customerNotePageTable">
                        <div class="page-table-filter margin-left-5px margin-right-5px margin-top-5px margin-bottom-5px border-width-1px border-style-solid border-color-darkgray border-radius-5px">
                            <div class="pull-left padding-all-2px">
                                <div class="pull-left">
                                    <input class="form-control" type="text" data-type="searchContent"
                                           placeholder="请输入搜索内容"/>
                                </div>
                                <div class="pull-left padding-top-5px padding-left-5px">
                                    <button class="glyphicon glyphicon-search btn btn-sm" data-type="searchBtn"
                                            title="搜索"></button>
                                    <button class=" glyphicon glyphicon-remove btn btn-sm"
                                            data-type="searchEmptyBtn" title="重置"></button>
                                </div>
                            </div>
                            <div class="pull-left padding-all-2px">
                                <div class="pull-left padding-top-7px padding-right-5px">
                                    按
                                </div>
                                <div class="pull-left">
                                    <select class="form-control" data-type="orderField">
                                        <option value="createTime">创建时间</option>
                                        <option value="updateTime">更新时间</option>
                                    </select>
                                </div>
                                <div class="pull-left">
                                    <select class="form-control" data-type="desc">
                                        <option value="true">降序</option>
                                        <option value="false">升序</option>
                                    </select>
                                </div>
                                <div class="pull-left padding-top-7px  padding-left-5px">
                                    排列
                                </div>
                            </div>
                            <div class="clear-float"></div>
                        </div>
                        <div class="noData text-center border-width-1px border-style-solid border-color-darkgray border-radius-5px margin-top-5px"
                             style="width:100%;height: 100px;line-height: 100px">
                            <span class="ft-weight-bolder">暂无数据</span>
                        </div>
                        <div class="hidden hasData">
                            <div class="page-table">
                                <div class="page-table-main text-center border-width-1px border-style-solid border-color-darkgray border-radius-5px margin-top-5px
                                padding-left-5px padding-right-5px padding-top-5px padding-bottom-5px"
                                     style="height: 300px;overflow:auto">
                                    <table class="table" id="customerNoteTable">
                                        <thead>
                                        <tr>
                                        </tr>
                                        </thead>
                                        <tbody>

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="page-index text-center">
                                <nav aria-label="Page navigation">
                                    <ul class="pagination">
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
            </div>
        </div>
    </div>
</div>
</body>
<script type="text/javascript"
        src="https://webapi.amap.com/maps?v=1.4.10&key=ec486436619b748e0a94f011e2249552"></script>
<script type="text/javascript" src="<%=basePath%>/resources/js/index.js?ver=<%=indexJsVer%>"></script>
</html>
