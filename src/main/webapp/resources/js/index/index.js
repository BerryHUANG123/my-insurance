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
            center: [113.264385, 23.129112],//中心点坐标
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
            $("#name").val('');
            $("#phone").val('');
            $("#address").val('');
            $("#content").val('');
            $("#addMarkModal").modal("show");
        });

        //从服务器接受原始数据，并处理成markers和回显
        commonFn.mLoading.show();
        $.get(commonFn.baseUrl + "marker/list.json", function (result) {
            commonFn.mLoading.hide();
            if (result.success) {
                var data = result.data;
                for (var i = 0; i < data.length; i++) {
                    showMark(data[i].lng, data[i].lat, data[i].name, data[i].phone, data[i].address, data[i].content, data[i].markId, data[i].customerId);
                }
            } else {
                alert("出错了!");
            }
        });
    });

    //创建标注保存按钮单击事件
    $(D).off("click", "#saveMarkBtn").on("click", "#saveMarkBtn", function () {
        var lng = $("#lng").html();
        var lat = $("#lat").html();
        var name = $("#name").val();
        var phone = $("#phone").val();
        var address = $("#address").val();
        var content = $("#content").val();
        createMark(lng, lat, name, phone, address, content);
        $("#addMarkModal").modal("hide");
    });

    //编辑标注保存按钮单击事件
    $(D).off("click", "#editMarkBtn").on("click", "#editMarkBtn", function () {
        var $editMarkModal = $("#editMarkModal");
        var markId = $editMarkModal.find("[data-type='markId']").val();
        var customerId = $editMarkModal.find("[data-type='customerId']").val();
        var name = $editMarkModal.find("[data-type='name']").val();
        var phone = $editMarkModal.find("[data-type='phone']").val();
        var address = $editMarkModal.find("[data-type='address']").val();
        var content = $editMarkModal.find("[data-type='content']").val();

        commonFn.mLoading.show();
        $.post(
            commonFn.baseUrl + "marker/edit.json",
            {
                markId: markId,
                customerId: customerId,
                name: name,
                phone: phone,
                address: address,
                content: content
            },
            function (result) {
                commonFn.mLoading.hide();
                if (result.success) {
                    //保存成功后从markers中删除这个点并重新展示这个点（页面上）
                    var data = result.data;
                    removeMark(data.markId);
                    showMark(data.lng, data.lat, data.name, data.phone, data.address, data.content, data.markId, data.customerId);
                    $("#editMarkModal").modal("hide");
                } else {
                    alert(result.msg);
                }
            }
        );
    });

    /**
     * 创建标注（包括标注和信息窗口,产生数据库交互）
     * @param lng 经度
     * @param lat 纬度
     * @param name 姓名
     * @param title 标题
     * @param phone 电话
     * @param address 地址
     * @param content 内容
     */
    var createMark = function (lng, lat, name, phone, address, content) {
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
                    showMark(data.lng, data.lat, data.name, data.phone, data.address, data.content, data.markId, data.customerId);
                    //更改地图中心点
                    map.setCenter([data.lng, data.lat]);
                } else {
                    alert("出现错误!");
                }
            }
        );
    };

    /**
     * 用于页面回显标记(不产生数据库交互)
     * @param lng
     * @param lat
     * @param title
     * @param name
     * @param phone
     * @param address
     * @param content
     * @param markId
     */
    var showMark = function (lng, lat, name, phone, address, content, markId, customerId) {
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
            '<div><button class="editMarkBtn" ' +
            'data-markId = "' + markId + '" ' +
            'data-customerId="' + customerId + '">编辑</button>' +
            ' <button class="deleteMarkBtn" data-markId="' + markId + '">删除</button></div>' +
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

    /**
     * 从页面移除某个存在的标注(不产生数据库交互)
     * @param markId
     */
    var removeMark = function (markId) {
        var index = null;
        for (var i = 0; i < markers.length; i++) {
            var marker = markers[i];
            if (marker.getExtData() == markId) {
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
    };

    //编辑标记按钮单击事件
    $(D).off("click", ".editMarkBtn").on("click", ".editMarkBtn", function () {
        //从数据库查询客户信息和标注信息
        var markId = $(this).attr("data-markId");
        commonFn.mLoading.show();
        $.get(commonFn.baseUrl + "marker/get.json?markId=" + markId, function (result) {
            commonFn.mLoading.hide();
            if (result.success) {
                var data = result.data;
                var $editMarkModal = $("#editMarkModal");
                $editMarkModal.find("[data-type='lng']").html(data.lng);
                $editMarkModal.find("[data-type='lat']").html(data.lat);
                $editMarkModal.find("[data-type='markId']").val(data.markId);
                $editMarkModal.find("[data-type='customerId']").val(data.customerId);
                $editMarkModal.find("[data-type='name']").val(data.name);
                $editMarkModal.find("[data-type='phone']").val(data.phone);
                $editMarkModal.find("[data-type='address']").val(data.address);
                $editMarkModal.find("[data-type='content']").val(data.content);
                $editMarkModal.modal("show");
            } else {
                alert(result.msg);
            }
        });
    });

    //删除标记按钮单击事件
    $(D).off("click", ".deleteMarkBtn").on("click", ".deleteMarkBtn", function () {
        var flag = confirm("是否删除此标注？");
        if (flag) {
            var markId = $(this).attr("data-markId");
            commonFn.mLoading.show();
            $.post(commonFn.baseUrl + "marker/remove.json?markId=" + markId, function (result) {
                commonFn.mLoading.hide();
                if (result.success) {
                    removeMark(markId);
                } else {
                    alert(result.msg);
                }
            });
        }
    });

    //输入提示
    AMap.plugin('AMap.Autocomplete', function () {
        // 实例化Autocomplete
        var autoOptions = {
            // input 为绑定输入提示功能的input的DOM ID
            input: 'addressSearch'
        };
        var autoComplete = new AMap.Autocomplete(autoOptions);

        autoComplete.on("select", function (e) {
            console.log(e);
            var poi = e.poi;
            //获取完整地址
            var address = poi.district + poi.address + poi.name;
            //获取经纬度
            var location = poi.location;
            if(!location){
                alert("请更换地点,该点没有经纬度数据!");
                return;
            }
            var lng = poi.location.lng;
            var lat = poi.location.lat;
            //检查当前经纬度是否已有标注,若有警告用户重新选择
            for (var i = 0; i < markers.length; i++) {
                var lngLat = markers[i].getPosition();
                if (lngLat.getLng() == lng &&lngLat.getLat() == lat) {
                    alert("该经纬度已存在标注,请选择其他相近地点进行标注!");
                    return;
                }
            }
            //打开新建标注模态框
            $("#lng").html(lng);
            $("#lat").html(lat);
            $("#name").val('');
            $("#phone").val('');
            $("#address").val('');
            $("#content").val('');
            $("#addMarkModal").modal("show");
        });
    })

})(jQuery, window, document);
