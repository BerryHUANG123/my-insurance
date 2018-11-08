<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <title>Lite Map</title>
    <script type="text/javascript" src="https://webapi.amap.com/maps?v=1.4.10&key=ec486436619b748e0a94f011e2249552"></script>
    <script type="text/javascript" src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <script type="text/javascript" src="resources/js/bootstrap/bootstrap.min.js"></script>
    <script type="text/javascript" src="resources/js/mloading/jquery.mloading.js"></script>
    <link rel="stylesheet" type="text/css" href="resources/css/bootstrap/bootstrap.min.css"/>
    <link rel="stylesheet" type="text/css" href="resources/css/bootstrap/bootstrap-responsive.min.css"/>
    <link rel="stylesheet" type="text/css" href="resources/css/mloading/jquery.mloading.css"/>
    <style type="text/css">
        html {
            height: 100%;
        }

        body {
            height: 100%;
            margin: 0px;
            padding: 0px;
        }

        #map_canvas {
            height: 100%;
        }

        #map_canvas img {
            max-width: none;
        }

        #removeMarkBtn {
            cursor: pointer;
            border: 1px solid gray;
            background-color: white;
            position: absolute;
            z-index: 10;
            text-size-adjust: none;
            bottom: auto;
            right: auto;
            top: 10px;
            left: 10px;
        }
    </style>
</head>
<body>
<div id="map_canvas"></div>
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
</body>
<script type="text/javascript" src="resources/js/common/common.js"></script>
<script type="text/javascript" src="resources/js/index/index.js"></script>
</html>
