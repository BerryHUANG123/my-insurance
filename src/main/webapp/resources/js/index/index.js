(function ($, W, D) {
    //当前被打开的信息窗口
    var currentInfoWindow = null;
    //从服务器接受的markers
    var markers = [];

    // 初始化地图
    var map = new AMap.Map('map_canvas',
        {
            resizeEnable: true, //是否监控地图容器尺寸变化
            zoom: 11,//级别
            center: [116.397428, 39.90923],//中心点坐标
            viewMode: '3D'//使用3D视图
        }
    );


    //从服务器读取已保存的所有标注并回显
    map.on('complete', function () {
        //地图任意点单击事件
        map.on('click', function (e) {
            var lnglat = e.lnglat;
            $("#lng").html(lnglat.getLng());
            $("#lat").html(lnglat.getLat());
            $("#addMarkModal").modal("show");
        });

        //从服务器接受原始数据，并处理成markers和回显
        commonFn.mLoading.show();
        $.get(commonFn.baseUrl + "marker/list.json", function (result) {
            commonFn.mLoading.hide();
            if (result.success) {
                var data = result.data;
                for (var i = 0; i < data.length; i++) {
                    showMark(data[i].lng, data[i].lat, data[i].name, data[i].name, data[i].phone, data[i].address, data[i].content, data[i].markId);
                }
            } else {
                alert("出错了!");
            }
        });
    });

    $(D).off("click", "#saveMarkBtn").on("click", "#saveMarkBtn", function () {
        var lng = $("#lng").html();
        var lat = $("#lat").html();
        var name = $("#name").val();
        var phone = $("#phone").val();
        var address = $("#address").val();
        var content = $("#content").val();
        createMark(lng, lat, name, name, phone, address, content);
        $("#addMarkModal").modal("hide");
    });

    /**
     * 创建标注（包括标注和信息窗口）
     * @param lng 经度
     * @param lat 纬度
     * @param name 姓名
     * @param title 标题
     * @param phone 电话
     * @param address 地址
     * @param content 内容
     */
    var createMark = function (lng, lat, title, name, phone, address, content) {
        commonFn.mLoading.show();
        $.post(
            commonFn.baseUrl + "marker/save.json",
            {
                name: name,
                phone: phone,
                address: address,
                content: content,
                lng: lng,
                lat: lat
            },
            function (result) {
                commonFn.mLoading.hide();
                if (result.success) {
                    var data = result.data;
                    showMark(data.lng, data.lat, data.name, data.name, data.phone, data.address, data.content, data.markId);
                } else {
                    alert("出现错误!");
                }
            }
        );
    };

    /**
     * 用于页面回显标记
     * @param lng
     * @param lat
     * @param title
     * @param name
     * @param phone
     * @param address
     * @param content
     * @param markId
     */
    var showMark = function (lng, lat, title, name, phone, address, content, markId) {
        var lngLat = new AMap.LngLat(lng, lat);
        // 创建一个 Marker 实例：
        var marker = new AMap.Marker({
            position: lngLat,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
            title: name,
            label: {content: name, offset: new AMap.Pixel(20, 5)}
        });
        // 将创建的点标记添加到已有的地图实例
        marker.setExtData(markId);
        map.add(marker);
        markers.push(marker);

        //创建信息窗口
        // 创建 infoWindow 实例
        var showContent = '<div>' +
            '<p>姓名：' + name + '</p>' +
            '<p>电话：' + phone + '</p>' +
            '<p>地址：' + address + '</p>' +
            '<p>备注：' + content + '</p>' +
            '<div><button>编辑</button> <button class="deleteMarkBtn" data-id="' + markId + '">删除</button></div>' +
            '</div>';

        var infoWindow = new AMap.InfoWindow({
            position: lngLat,
            content: showContent,
            offset: new AMap.Pixel(1, -15),
            autoMove: true
        });

        //绑定标点单击事件
        marker.on('click', function () {
            currentInfoWindow = infoWindow;
            infoWindow.open(map);
        });
    };

    //删除标记按钮单击事件
    $(D).off("click", ".deleteMarkBtn").on("click", ".deleteMarkBtn", function () {
        var flag = confirm("是否删除此标注？");
        if (flag) {
            var id = $(this).attr("data-id");
            //TODO:从服务器删除后,再删除页面上的
            var index = null;
            for (var i = 0; i < markers.length; i++) {
                var marker = markers[i];
                if (marker.getExtData() == id) {
                    map.remove(marker);
                    index = i;
                }
            }
            if (index || index == 0) {
                markers.splice(index, 1);
            }
            if (currentInfoWindow) {
                currentInfoWindow.close();
            }
        }
    });

})(jQuery, window, document);
