<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html>
<head>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=NiPNmBDuAvPfSbMelZLl1TYrs4XBbbRu"></script>
    <script type="text/javascript" src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <script type="text/javascript" src="resources/js/bootstrap/bootstrap.min.js"></script>
    <link rel="stylesheet" type="text/css" href="resources/css/bootstrap/bootstrap.min.css" />
    <link rel="stylesheet" type="text/css" href="resources/css/bootstrap/bootstrap-responsive.min.css" />
    <!--<script type="text/javascript" src="js/layer/layer.js"></script>-->
    <!--<link rel="stylesheet" type="text/css" media="all" href="css/layer/layer.css" />-->
    <title>标注事项地点</title>

    <style type="text/css">
        html{height:100%}
        body{height:100%;margin:0px;padding:0px}
        #map{height:100%}
    </style>

</head>
<body>
<div class="container">
    <div style="height: 50px;line-height: 50px;text-align: center;">
        <div style="margin-left:50px;float: left">
            <input type="text" id="suggestId" size="20" value="百度" style="width:200px;margin-bottom: 10px;"
                   placeholder="请输入地址检索"/>
            <a href="javascript:void(0);" onclick="document.getElementById('suggestId').value=''">清除</a>
        </div>
        点击地图任意一点获取坐标
    </div>
    <!--<div id="r-result">请输入地址检索：</div>-->
    <div id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"></div>
    <!--用于即时搜索提示-->

    <div id="map">

    </div>

    <div class="modal fade" id="addMarkModal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
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
</div>
</body>
<script type="text/javascript" src="resources/js/index/index.js"></script>
</html>

