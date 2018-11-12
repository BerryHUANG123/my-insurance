<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<link rel="stylesheet" type="text/css" href="<%=basePath%>/resources/css/index.css?ver=<%=indexCssVer%>"/>
<div class="mui-content">
    <div id="addressSearchDiv">
    <div class="mui-input-row mui-input-search">
       <input type="text" id="addressSearch" class="mui-input-clear" placeholder="请输入地址搜索添加备注">
    </div>
    </div>
    <div class="clear-float"></div>
    <div id="map_canvas"></div>
    <div id="controlSwitchDiv">
        <span><input type="checkbox" id="geolocationSwitch"/>当前位置</span>
        &nbsp;
        <span><input type="checkbox" id="mapTypeSwitch"/>地图切换</span>
    </div>
    <div id="addMarkModal" class="mui-modal">
        <header class="mui-bar mui-bar-nav">
            <button type="button" class="mui-btn mui-btn-primary mui-pull-right" id="saveMarkBtn">保存</button>
            <a type="button" class="mui-btn mui-btn-danger mui-pull-right" href="#addMarkModal">取消</a>
            <h1 class="mui-title">新建备注</h1>
        </header>
        <div class="mui-content padding-top-44px">
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
    </div>
    <div id="editMarkModal" class="mui-modal">
        <header class="mui-bar mui-bar-nav">
            <button type="button" class="mui-btn mui-btn-primary mui-pull-right" id="editMarkBtn">保存</button>
            <a type="button" class="mui-btn mui-btn-danger mui-pull-right" href="#editMarkModal">取消</a>
            <h1 class="mui-title">编辑备注</h1>
        </header>
        <div class="mui-content padding-top-44px">
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
    </div>
</div>

<script type="text/javascript"
        src="https://webapi.amap.com/maps?v=1.4.10&key=ec486436619b748e0a94f011e2249552"></script>
<script type="text/javascript" src="<%=basePath%>/resources/js/index.js?ver=<%=indexJsVer%>"></script>