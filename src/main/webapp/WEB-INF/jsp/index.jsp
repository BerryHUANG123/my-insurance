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
<div id="addressSearchDiv">
    地址搜索添加备注
    <input type="text" id="addressSearch"/>
</div>
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
                                    <input type="text" data-type="name" placeholder="请输入客户姓名"/>
                                </td>
                            </tr>
                            <tr>
                                <td>电话:</td>
                                <td><input type="text" data-type="phone" placeholder="请输入客户电话"/></td>
                            </tr>
                            <tr>
                                <td>地址:</td>
                                <td><textarea data-type="address" placeholder="请输入联络地址"></textarea></td>
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
                                <td><textarea data-type="content" placeholder="请输入标记点备注信息"></textarea></td>
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
<div class="modal fade" id="editMarkModal" tabindex="-1" role="dialog" aria-hidden="true" style="display: none;">
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
                                    <input type="text" data-type="name" placeholder="请输入客户姓名"/>
                                </td>
                            </tr>
                            <tr>
                                <td>电话:</td>
                                <td><input type="text" data-type="phone" placeholder="请输入客户电话"/></td>
                            </tr>
                            <tr>
                                <td>地址:</td>
                                <td><textarea data-type="address" placeholder="请输入联络地址"></textarea></td>
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
                                <td><textarea data-type="content" placeholder="请输入标记点备注信息"></textarea></td>
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
</div>
</body>
<script type="text/javascript"
        src="https://webapi.amap.com/maps?v=1.4.10&key=ec486436619b748e0a94f011e2249552"></script>
<script type="text/javascript" src="<%=basePath%>/resources/js/index.js?ver=<%=indexJsVer%>"></script>
</html>
