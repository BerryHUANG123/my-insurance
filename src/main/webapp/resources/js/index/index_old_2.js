(function ($, W, D) {

    //初始化地图
    var map = (function () {
        // 创建地图实例
        var map = new BMap.Map("map_canvas");
        // 创建点坐标
        var point = new BMap.Point(120.382029, 30.312903);
        // 初始化地图， 设置中心点坐标和地图级别
        map.centerAndZoom(point, 11);

        //初始化控件（）
        var zoomCtrl = new BMap.ZoomControl();
        var scaleCtrl = new BMap.ScaleControl();
        map.addControl(zoomCtrl);
        map.addControl(scaleCtrl);
        //添加自定义控件
        // 删除标注控件
        var DeleteMarkControl = function () {
            // 设置默认停靠位置和偏移量
            this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
            this.defaultOffset = new BMap.Size(10, 10);
        }
        // 通过JavaScript的prototype属性继承于BMap.Control
        DeleteMarkControl.prototype = new BMap.Control();
        // 自定义控件必须实现自己的initialize方法,并且将控件的DOM元素返回
        // 在本方法中创建个button元素作为控件的容器,并将其添加到地图容器中
        DeleteMarkControl.prototype.initialize = function (map) {
            // 创建一个DOM元素
            var $button = $('<button class="hidden" id="removeMarkBtn">删除</button>');
            $(D).off("click", "#removeMarkBtn").on("click", "#removeMarkBtn", function () {
               removeMark(marker);
            });
            // 添加DOM元素到地图中
            var button = $button[0];
            map.getContainer().appendChild(button);
            // 将DOM元素返回
            return button;
        };

        map.addControl(new DeleteMarkControl());


        //添加鼠标单击事件，获取该点坐标
        map.addEventListener("click", function (e) {
            var point = e.point;
            $("#lng").html(point.lng);
            $("#lat").html(point.lat);
            $("#addMarkModal").modal("show");
        });
        return map;
    })();

    //创建标点的方法
    var createMark = function (point, label, infoWindow) {
        var marker = new BMap.Marker(point);
        map.addOverlay(marker);
       // marker.setLabel(label);
        marker.addEventListener("click", function (e) {
            e.domEvent.stopPropagation();
            //map.openInfoWindow(infoWindow, point); //参数：窗口、点  根据点击的点出现对应的窗口
            $("#removeMarkBtn").removeClass("hidden");
        });

        marker.addEventListener("dblclick", function (e) {
            var flag = confirm("是否删除该标注?");
            if (flag) {
                removeMark(marker);
            }
        });
    };

    //移除标点的方法
    var removeMark = function (marker) {
        marker.remove();
       // map.closeInfoWindow();
    };

    //保存单击事件
    $(D).off("click", "#saveMarkBtn");
    $(D).on("click", "#saveMarkBtn", function () {
        var lng = $("#lng").html();
        var lat = $("#lat").html();
        var name = $("#name").val();
        var phone = $("#phone").val();
        var address = $("#address").val();
        var content = $("#content").val();

        var mapPoint = {};
        mapPoint.lat = lat;
        mapPoint.lng = lng;
        mapPoint.title = name;
        mapPoint.branch = name;
        mapPoint.con = "电话：" + phone + ",地址：" + address + ",内容：" + content;

        var point = new BMap.Point(mapPoint.lng, mapPoint.lat); //创建坐标点
        var opts = {
            width: 250,
            height: 100,
            title: mapPoint.title
        };
        /*var label = new BMap.Label(mapPoint.branch, {
            offset: new BMap.Size(25, 5)
        });*/
      /*  var infoWindow = new BMap.InfoWindow(mapPoint.con, opts);*/
        createMark(point, null,null);

        $("#addMarkModal").modal("hide");
    });

    //初始化所有的从该服务器端接受的已有标记点
    (function () {
        //todo:从服务器端接收所有的标注信息并标入地图中。
        //假设现有多个从服务器接收的标注点
        var mapPoints = [{
            lat: 30.312903,
            lng: 120.382029,
            title: "A",
            con: "我是A",
            branch: "老大"
        },
            {
                lat: 30.215855,
                lng: 120.024568,
                title: "B",
                con: "我是B",
                branch: "老二"
            },
            {
                lat: 30.18015,
                lng: 120.174968,
                title: "C",
                con: "我是C",
                branch: "老三"
            },
            {
                lat: 30.324994,
                lng: 120.164399,
                title: "D",
                con: "我是D",
                branch: "老四"
            },
            {
                lat: 30.24884,
                lng: 120.305074,
                title: "E",
                con: "我是E",
                branch: "老五"
            }
        ];

        for (var i = 0; i < mapPoints.length; i++) {
            var point = new BMap.Point(mapPoints[i].lng, mapPoints[i].lat); //创建坐标点
            var opts = {
                width: 250,
                height: 100,
                title: mapPoints[i].title
            };
            /*var label = new BMap.Label(mapPoints[i].branch, {
                offset: new BMap.Size(25, 5)
            });*/
           /* var infoWindow = new BMap.InfoWindow(mapPoints[i].con, opts);*/
            createMark(point, null, null);
        }

    })();

})(jQuery, window, document);
