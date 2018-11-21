(function ($, W, D) {
    //Dto对象
    var CustomerDto = function (id, name, sex, birthday, age, phone, address, remark) {
        this.id = id;
        this.name = name;
        this.sex = sex;
        this.birthday = birthday;
        this.age = age;
        this.phone = phone;
        this.address = address;
        this.remark = remark;
    };

    var MarkDto = function (markId, remark, lng, lat, customerDtoList) {
        this.markId = markId;
        this.remark = remark;
        this.lng = lng;
        this.lat = lat;
        this.customerDtoList = customerDtoList;
    };

    //Vo对象
    /*var CustomerVo = function (id, name, sex, birthday, age, phone, address, remark) {
        this.id = id;
        this.name = name;
        this.sex = sex;
        this.birthday = birthday;
        this.age = age;
        this.phone = phone;
        this.address = address;
        this.remark = remark;
    };
    var MarkVo = function (markId, remark, lng, lat, customerVoList) {
        this.markId = markId;
        this.remark = remark;
        this.lng = lng;
        this.lat = lat;
        this.customerVoList = customerVoList;
    };*/

    //注册日期插件
    $("#birthdayInput").datetimepicker({
        format:'yyyy-mm-dd',
        language: 'zh-CN',
        weekStart: 1,
        todayBtn: 1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 4,
        minView: 2,
        forceParse: 1,
        endDate:new Date(),
        pickerPosition: "bottom-left"
    });

    //首先初始化地图区域DIV需要的高度
    $("#map_canvas").css("height", (D.documentElement.clientHeight - 100) + 'px');

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
            /*viewMode: '3D',*///使用3D视图
            /*  pitch: 0, */// 地图俯仰角度，有效范围 0 度- 83 度
        }
    );

    //引入输入提示插件
    AMap.plugin('AMap.Autocomplete', function () {
        // 实例化Autocomplete
        var autoOptions = {
            // input 为绑定输入提示功能的input的DOM ID
            input: 'addressSearch'
        };
        var autoComplete = new AMap.Autocomplete(autoOptions);

        autoComplete.on("select", function (e) {
            var poi = e.poi;
            //获取完整地址
            var address = poi.district + poi.address + poi.name;
            //获取经纬度
            var location = poi.location;
            if (!location) {
                alert("请更换地点,该点没有经纬度数据!");
                return;
            }
            var lng = poi.location.lng;
            var lat = poi.location.lat;
            //检查当前经纬度是否已有标注,若有警告用户重新选择
            for (var i = 0; i < markers.length; i++) {
                var lngLat = markers[i].getPosition();
                if (lngLat.getLng() == lng && lngLat.getLat() == lat) {
                    alert("该经纬度已存在标注,请选择其他相近地点进行标注!");
                    return;
                }
            }
            //打开新建标注模态框
            var $addMarkModal = $("#addMarkModal");
            $addMarkModal.find("[data-type='lng']").html(lng);
            $addMarkModal.find("[data-type='lat']").html(lat);
            $addMarkModal.find("[data-type='name']").val('');
            $addMarkModal.find("[data-type='phone']").val('');
            $addMarkModal.find("[data-type='address']").val(address);
            $addMarkModal.find("[data-type='marker-remark']").val('');
            $addMarkModal.modal("show");
        });
    });

    // 同时引入工具条插件，比例尺插件和鹰眼插件
    var mapTypeControl;
    var geolocationControl;
    AMap.plugin([
        'AMap.ToolBar',
        'AMap.Scale',
        /* 'AMap.OverView',*/
        'AMap.MapType',
        'AMap.Geolocation',
    ], function () {
        // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
        map.addControl(new AMap.ToolBar({noIpLocate: true}));

        // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
        map.addControl(new AMap.Scale());

        // 在图面添加鹰眼控件，在地图右下角显示地图的缩略图
        /* map.addControl(new AMap.OverView({isOpen: true}));*/

        // 在图面添加类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制

        mapTypeControl = new AMap.MapType();
        map.addControl(mapTypeControl);
        mapTypeControl.hide();

        // 在图面添加定位控件，用来获取和展示用户主机所在的经纬度位置
        geolocationControl = new AMap.Geolocation();
    });

//当前位置控件开关按钮单击事件
    $(D).off("click", "#geolocationSwitch").on("click", "#geolocationSwitch", function () {
        var checked = $(this).prop("checked");
        if (checked) {
            map.addControl(geolocationControl);
        } else {
            map.removeControl(geolocationControl);
        }
    });

    //地图类型切换控件开关按钮单击事件
    $(D).off("click", "#mapTypeSwitch").on("click", "#mapTypeSwitch", function () {
        var checked = $(this).prop("checked");
        if (checked) {
            mapTypeControl.show();
        } else {
            mapTypeControl.hide();
        }
    });


    //从服务器读取已保存的所有标注并回显
    map.on('complete', function () {
        //地图任意点单击事件
        map.on('click', function (e) {
            var lnglat = e.lnglat;
            var $addMarkModal = $("#addMarkModal");
            $addMarkModal.find("[data-type='lng']").html(lnglat.getLng());
            $addMarkModal.find("[data-type='lat']").html(lnglat.getLat());
            $addMarkModal.find("[data-type='name']").val('');
            $addMarkModal.find("[data-type='phone']").val('');
            $addMarkModal.find("[data-type='address']").val('');
            $addMarkModal.find("[data-type='marker-remark']").val('');
            $addMarkModal.modal("show");
        });

        //从服务器接受原始数据，并处理成markers和回显
        commonFn.mLoading.show();
        $.get(commonFn.baseUrl + "marker/list.json", function (result) {
            commonFn.mLoading.hide();
            if (result.success) {
                var data = result.data;
                for (var i = 0; i < data.length; i++) {
                    showMark(data[i]);
                }
            } else {
                alert(result.msg);
            }
        });
    });

    //创建标注保存按钮单击事件
    $(D).off("click", "#saveMarkBtn").on("click", "#saveMarkBtn", function () {
        var $addMarkModal = $("#addMarkModal");
        var lng = $addMarkModal.find("[data-type='lng']").html();
        var lat = $addMarkModal.find("[data-type='lat']").html();
        var name = $addMarkModal.find("[data-type='name']").val();
        var phone = $addMarkModal.find("[data-type='phone']").val();
        var address = $addMarkModal.find("[data-type='address']").val();
        var remark = $addMarkModal.find("[data-type='marker-remark']").val();

        if (!name) {
            commonFn.messaage('error', '请输入客户姓名!');
            return;
        }
        commonFn.mLoading.show();
        $.post(
            commonFn.baseUrl + "marker/save.json",
            new MarkDto(null, remark, lng, lat, [new CustomerDto(null, name, null, null, phone, address, remark)]),
            function (result) {
                commonFn.mLoading.hide();
                if (result.success) {
                    showMark(result.data);
                    //更改地图中心点
                    map.setCenter([data.lng, data.lat]);
                    $addMarkModal.modal("hide");
                } else {
                    alert("出现错误!");
                }
            }
        );
    });

    //编辑标注保存按钮单击事件
    $(D).off("click", "#editMarkBtn").on("click", "#editMarkBtn", function () {
        var $editMarkModal = $("#editMarkModal");
        var markId = $editMarkModal.find("[data-type='markId']").val();
        var customerId = $editMarkModal.find("[data-type='customerId']").val();
        var name = $editMarkModal.find("[data-type='name']").val();
        var phone = $editMarkModal.find("[data-type='phone']").val();
        var address = $editMarkModal.find("[data-type='address']").val();
        var remark = $editMarkModal.find("[data-type='marker-remark']").val();

        if (!name) {
            commonFn.messaage('error', '请输入客户姓名!');
            return;
        }

        commonFn.mLoading.show();
        commonFn.ajax(commonFn.baseUrl + "marker/edit.json",
            new MarkDto(markId, remark, null, null, [new CustomerDto(customerId, name, null, null, phone, address, remark)]),
            function (result) {
                commonFn.mLoading.hide();
                if (result.success) {
                    //保存成功后从markers中删除这个点并重新展示这个点（页面上）
                    var data = result.data;
                    removeMark(data.markId);
                    showMark(data);
                    $("#editMarkModal").modal("hide");
                } else {
                    alert(result.msg);
                }
            });
        /*$.ajax({
            type: "post",
            url: commonFn.baseUrl + "marker/edit.json",
            data: JSON.stringify(new MarkDto(markId, remark, null, null, [new CustomerDto(customerId, name, null, null, phone, address, remark)])),
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            success: function (result) {
                commonFn.mLoading.hide();
                if (result.success) {
                    //保存成功后从markers中删除这个点并重新展示这个点（页面上）
                    var data = result.data;
                    removeMark(data.markId);
                    showMark(data);
                    $("#editMarkModal").modal("hide");
                } else {
                    alert(result.msg);
                }

            }
        });*/
        /*$.post(
            commonFn.baseUrl + "marker/edit.json",
            new MarkDto(markId, remark, null,null, [new CustomerDto(customerId, name, null, null, phone, address, remark)]),
            function (result) {
                commonFn.mLoading.hide();
                if (result.success) {
                    //保存成功后从markers中删除这个点并重新展示这个点（页面上）
                    var data = result.data;
                    removeMark(data.markId);
                    showMark(data);
                    $("#editMarkModal").modal("hide");
                } else {
                    alert(result.msg);
                }
            }
        );*/
    });

    /**
     * 创建标注（包括标注和信息窗口,产生数据库交互）
     * @param lng 经度
     * @param lat 纬度
     * @param name 姓名
     * @param title 标题
     * @param phone 电话
     * @param address 地址
     * @param remark 内容
     */
    /*var createMark = function (lng, lat, name, phone, address, remark) {
        commonFn.mLoading.show();
        $.post(
            commonFn.baseUrl + "marker/save.json",
            {
                name: name,
                phone: phone,
                address: address,
                remark: remark,
                lng: lng,
                lat: lat
            },
            function (result) {
                commonFn.mLoading.hide();
                if (result.success) {
                    var data = result.data;
                    showMark(data.lng, data.lat, data.name, data.phone, data.address, data.remark, data.markId, data.customerId);
                    //更改地图中心点
                    map.setCenter([data.lng, data.lat]);
                } else {
                    alert("出现错误!");
                }
            }
        );
    };*/

    /**
     * 用于页面回显标记(不产生数据库交互)
     * @param markVo
     */
    var showMark = function (markVo) {
        var customerVo = (markVo.customerVoList)[0];
        var lngLat = new AMap.LngLat(markVo.lng, markVo.lat);
        // 创建一个 Marker 实例：
        var marker = new AMap.Marker({
            position: lngLat,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
            title: customerVo.name,
            label: {content: customerVo.name, offset: new AMap.Pixel(20, 5)}
        });
        // 将创建的点标记添加到已有的地图实例
        marker.setExtData(markVo.markId);
        map.add(marker);
        markers.push(marker);

        //创建信息窗口
        // 创建 infoWindow 实例
        var showContent = '<div>' +
            '<p>姓名：' + customerVo.name + '</p>' +
            '<p>电话：' + customerVo.phone + '</p>' +
            '<p>地址：' + customerVo.address + '</p>' +
            '<p>备注：' + markVo.remark + '</p>' +
            '<div><button class="editMarkBtn" ' +
            'data-markId = "' + markVo.markId + '" ' +
            'data-customerId="' + customerVo.customerId + '">编辑</button>' +
            ' <button class="deleteMarkBtn" data-markId="' + markVo.markId + '">删除</button></div>' +
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
                var markVo = result.data;
                var customerVo = (markVo.customerVoList)[0];
                var $editMarkModal = $("#editMarkModal");
                $editMarkModal.find("[data-type='lng']").html(markVo.lng);
                $editMarkModal.find("[data-type='lat']").html(markVo.lat);
                $editMarkModal.find("[data-type='markId']").val(markVo.markId);
                $editMarkModal.find("[data-type='customerId']").val(customerVo.customerId);
                $editMarkModal.find("[data-type='name']").val(customerVo.name);
                $editMarkModal.find("[data-type='phone']").val(customerVo.phone);
                $editMarkModal.find("[data-type='address']").val(customerVo.address);
                $editMarkModal.find("[data-type='marker-remark']").val(markVo.remark);
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


})(jQuery, window, document);
