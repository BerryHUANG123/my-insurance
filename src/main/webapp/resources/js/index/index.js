(function ($, W, D) {
    var map = (function () {
        var map = new BMap.Map("map");
        var point = new BMap.Point(120.382029, 30.312903);
        map.centerAndZoom(point, 9);
        var marker = new BMap.Marker(point);
        var opts = {
            //                anchor: BMAP_ANCHOR_TOP_LEFT,
            //                offset: new BMap.Size(150,5)
        }
        map.centerAndZoom(point, 11); //设置中心点（确定中心点坐标）
        map.setCurrentCity("北京"); //在设置好地图中心点的前提下显示背景的整体图
        map.enableScrollWheelZoom(true); //在PC端可以通过滚轮放大缩小地图，移动端关闭该功能
        map.addControl(new BMap.NavigationControl(opts)); //addControl()向地图添加控件 平移和缩放控件 PC端默认左上角 移动端默认右下角且只有缩放功能
        map.addControl(new BMap.ScaleControl(opts)); //比例尺控件 默认左下角
        map.addControl(new BMap.OverviewMapControl(opts)); //缩略图控件 默认右下角且呈可折叠状态（点击隐藏和显示）
        map.addControl(new BMap.MapTypeControl()); //地图类型控件 默认右上角可切换地图/卫星/三维三种状态
        map.addControl(new BMap.GeolocationControl(opts)); //定位控件 默认左下角

        map.addEventListener("click", function (e) {
            var point = e.point;
            $("#lng").html(point.lng);
            $("#lat").html(point.lat);
            $("#addMarkModal").modal("show");
        });

        return map;
    })();

    var getPoint = function (e) {

    };

    var createMark = function (point, label, infoWindow) {
        var marker = new BMap.Marker(point);
        map.addOverlay(marker);
        marker.setLabel(label);
        marker.addEventListener("click", function (e) {
            e.domEvent.stopPropagation();
            map.openInfoWindow(infoWindow, point); //参数：窗口、点  根据点击的点出现对应的窗口
        });

        marker.addEventListener("dblclick", function (e) {
            var flag = confirm("是否删除该标注?");
            if (flag) {
                removeMark(marker);
            }
        });
    };

    var removeMark = function (marker) {
        marker.remove();
        map.closeInfoWindow();
    };

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
        var label = new BMap.Label(mapPoint.branch, {
            offset: new BMap.Size(25, 5)
        });
        var infoWindow = new BMap.InfoWindow(mapPoint.con, opts);
        createMark(point, label, infoWindow);

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
            var label = new BMap.Label(mapPoints[i].branch, {
                offset: new BMap.Size(25, 5)
            });
            var infoWindow = new BMap.InfoWindow(mapPoints[i].con, opts);
            createMark(point, label, infoWindow);
        }

    })();


    function G(id) {
        return document.getElementById(id);
    }

    var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
        {
            "input": "suggestId"
            , "location": map
        });

    ac.addEventListener("onhighlight", function (e) {  //鼠标放在下拉列表上的事件
        var str = "";
        var _value = e.fromitem.value;
        var value = "";
        if (e.fromitem.index > -1) {
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

        value = "";
        if (e.toitem.index > -1) {
            _value = e.toitem.value;
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
        G("searchResultPanel").innerHTML = str;
    });

    var myValue;
    ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
        var _value = e.item.value;
        myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
        G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

        setPlace();
    });

    function setPlace() {
        map.clearOverlays();    //清除地图上所有覆盖物
        function myFun() {
            var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
            map.centerAndZoom(pp, 18);
            map.addOverlay(new BMap.Marker(pp));    //添加标注
        }

        var local = new BMap.LocalSearch(map, { //智能搜索
            onSearchComplete: myFun
        });
        local.search(myValue);
    }

})(jQuery, window, document);