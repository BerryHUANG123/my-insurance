<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="common/headJstl.jsp"%>
<html>
<head>
    <base href="<%=basePath%>/">
    <title><%=title%></title>
    <%@ include file="common/headCssJs.jsp"%>
    <link rel="stylesheet" type="text/css" href="<%=basePath%>/resources/css/index.css"/>
</head>
<body>
<div id="map_canvas"></div>
<div>
    <input type="text" id="addressSearch"/>
</div>
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
                <p>当前坐标： 经度:<span id="lng"></span>,纬度:<span id="lat"></span></p>
                <div>
                    <span>姓名：</span>
                    <input type="text" id="name"/>
                </div>
                <div>
                    <span>电话：</span>
                    <input type="text" id="phone"/>
                </div>
                <div>
                    <span>地址：</span>
                    <textarea id="address"></textarea>
                </div>
                <div>
                    <span>内容：</span>
                    <textarea id="content"></textarea>
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
                <div>
                    <span>姓名：</span>
                    <input type="text" data-type="name"/>
                </div>
                <div>
                    <span>电话：</span>
                    <input type="text" data-type="phone"/>
                </div>
                <div>
                    <span>地址：</span>
                    <textarea data-type="address"></textarea>
                </div>
                <div>
                    <span>内容：</span>
                    <textarea data-type="content"></textarea>
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
<script type="text/javascript" src="https://webapi.amap.com/maps?v=1.4.10&key=ec486436619b748e0a94f011e2249552"></script>
<script type="text/javascript" src="<%=basePath%>/resources/js/index.js"></script>
</html>
