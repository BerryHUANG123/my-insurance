(function ($, W, D) {

    //Dto对象
    var CustomerDto = function (id, name, sex, birthday, age, customerHobbyDtoList, phone, address, remark) {
        this.id = id;
        this.name = name;
        this.sex = sex;
        this.birthday = birthday;
        this.age = age;
        this.customerHobbyDtoList = customerHobbyDtoList;
        this.phone = phone;
        this.address = address;
        this.remark = remark;
    };

    var MarkDto = function (markId, remark) {
        this.markId = markId;
        this.remark = remark;
    };

    var CustomerHobbyDto = function (id, customerId, hobby, specificHobby, customHobby) {
        this.id = id;
        this.customerId = customerId;
        this.hobby = hobby;
        this.specificHobby = specificHobby;
        this.customHobby = customHobby;
    };

    var CustomerNoteDto = function (id, customerId, content) {
        this.id = id;
        this.customerId = customerId;
        this.content = content;
    };

    var CustomerNotePageDto = function (customerId, pageSize, pageNum, orderField, desc, searchContent) {
        this.customerId = customerId;
        this.pageSize = pageSize;
        this.pageNum = pageNum;
        this.orderField = orderField;
        this.desc = desc;
        this.searchContent = searchContent;
    };

    //注册日期插件
    $("[data-type='birthdayInput']").datetimepicker({
        format: 'yyyy-mm-dd',
        language: 'zh-CN',
        weekStart: 1,
        todayBtn: 1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 4,
        minView: 2,
        forceParse: 1,
        endDate: new Date(),
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
            clearAddMarkModalInfo();
            $addMarkModal.find("[data-type='lng']").html(lng);
            $addMarkModal.find("[data-type='lat']").html(lat);
            $addMarkModal.find("[data-type='address']").val(address);
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
        /*map.on('click', function (e) {
            var lnglat = e.lnglat;
            var $addMarkModal = $("#addMarkModal");
            $addMarkModal.find("[data-type='lng']").html(lnglat.getLng());
            $addMarkModal.find("[data-type='lat']").html(lnglat.getLat());
            clearAddMarkModalInfo();
            $addMarkModal.modal("show");
        });*/
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


    //清空新增Mark模态框表单信息
    var clearAddMarkModalInfo = function () {
        var $addMarkModal = $("#addMarkModal");
        //客户信息清空
        $addMarkModal.find("[data-type='name']").val('');
        $addMarkModal.find("[data-type='sex'][value='male']").prop('checked', true);
        $addMarkModal.find("[data-type='sex'][value='female']").prop('checked', false);
        $addMarkModal.find("[data-type='age']").val('');
        $addMarkModal.find("[data-type='birthday']").val('');
        $addMarkModal.find("[data-type='hobbyDiv']").empty();
        $addMarkModal.find("[data-type='phone']").val('');
        $addMarkModal.find("[data-type='address']").val('');
        $addMarkModal.find("[data-type='customer-remark']").val('');
        //标注信息清空
        $addMarkModal.find("[data-type='marker-remark']").val('');
    };

    //清空编辑Mark模态框表单信息
    var clearEditMarkModalInfo = function () {
        var $editMarkModal = $("#editMarkModal");
        //关键信息清空
        $editMarkModal.find("[data-type='markId']").val('');
        $editMarkModal.find("[data-type='customerId']").val('');
        $editMarkModal.find("[data-type='lng']").html('');
        $editMarkModal.find("[data-type='lat']").html('');
        //客户信息清空
        $editMarkModal.find("[data-type='name']").val('');
        $editMarkModal.find("[data-type='sex'][value='male']").prop('checked', true);
        $editMarkModal.find("[data-type='sex'][value='female']").prop('checked', false);
        $editMarkModal.find("[data-type='age']").val('');
        $editMarkModal.find("[data-type='birthday']").val('');
        $editMarkModal.find("[data-type='hobbyDiv']").empty();
        $editMarkModal.find("[data-type='phone']").val('');
        $editMarkModal.find("[data-type='address']").val('');
        $editMarkModal.find("[data-type='customer-remark']").val('');
        //标注信息清空
        $editMarkModal.find("[data-type='marker-remark']").val('');

    };

    //创建标注保存按钮单击事件
    $(D).off("click", "#saveMarkBtn").on("click", "#saveMarkBtn", function () {
        var $addMarkModal = $("#addMarkModal");
        var lng = $addMarkModal.find("[data-type='lng']").html();
        var lat = $addMarkModal.find("[data-type='lat']").html();
        var name = $addMarkModal.find("[data-type='name']").val();
        var sex = $addMarkModal.find("[data-type='sex']:checked").val();
        var age = $addMarkModal.find("[data-type='age']").val();
        var birthday = $addMarkModal.find("[data-type='birthday']").val();
        var phone = $addMarkModal.find("[data-type='phone']").val();
        var address = $addMarkModal.find("[data-type='address']").val();
        var customerRemark = $addMarkModal.find("[data-type='customer-remark']").val();
        var markerRemark = $addMarkModal.find("[data-type='marker-remark']").val();

        //组成爱好list
        var customerHobbyDtoList;
        var $oneHobbyDivList = $addMarkModal.find('[data-type="oneHobbyDiv"]');
        if ($oneHobbyDivList.length > 0) {
            customerHobbyDtoList = [];
            for (var i = 0; i < $oneHobbyDivList.length; i++) {
                var $oneHobbyDiv = $oneHobbyDivList.eq(i);
                var hobby = $oneHobbyDiv.find("[data-type='parentHobby']").val();
                var specificHobby = null;
                if (hobby.indexOf("other") < 0) {
                    specificHobby = $oneHobbyDiv.find("[data-type='childHobby']").val();
                }
                var customHobby = null;
                if (hobby.indexOf("other") >= 0 || (specificHobby && specificHobby.indexOf("other") >= 0)) {
                    customHobby = $oneHobbyDiv.find("[data-type='customHobby']").val();
                }
                customerHobbyDtoList.push(new CustomerHobbyDto(null, null, hobby, specificHobby, customHobby));
            }
        }

        if (!name) {
            commonFn.messaage('error', '请输入客户姓名!');
            return;
        }
        commonFn.mLoading.show();
        commonFn.ajaxPost(commonFn.baseUrl + "marker/save.json",
            new MarkDto(null, markerRemark, lng, lat, [new CustomerDto(null, name, sex, birthday, age, customerHobbyDtoList, phone, address, customerRemark)]),
            function (result) {
                commonFn.mLoading.hide();
                if (result.success) {
                    //回显mark并打开对应信息窗体
                    AMap.event.trigger(showMark(result.data), 'click');
                    //更改地图中心点
                    map.setCenter([result.data.lng, result.data.lat]);
                    $addMarkModal.modal("hide");
                } else {
                    alert("出现错误!");
                }
            });
    });

    //编辑标注保存按钮单击事件
    $(D).off("click", "#editMarkBtn").on("click", "#editMarkBtn", function () {
        var $editMarkModal = $("#editMarkModal");
        //关键信息
        var markId = $editMarkModal.find("[data-type='markId']").val();
        //标注信息
        var markerRemark = $editMarkModal.find("[data-type='marker-remark']").val();

        commonFn.mLoading.show();
        commonFn.ajaxPost(commonFn.baseUrl + "marker/edit.json",
            new MarkDto(markId, markerRemark),
            function (result) {
                commonFn.mLoading.hide();
                if (result.success) {
                    //保存成功后从markers中删除这个点并重新展示这个点（页面上）
                    commonFn.ajaxGet(commonFn.baseUrl+"marker/get.json",{markId:markId},function(result){
                        if(result.success){
                            var data = result.data;
                            removeMark(data.markId);
                            //回显mark并打开对应信息窗体
                            AMap.event.trigger(showMark(data), 'click');
                            $("#editMarkModal").modal("hide");
                            commonFn.messaage('success','编辑保存标注信息成功!');
                        }else{
                            commonFn.messaage('error',result.msg);
                        }
                    });

                } else {
                    commonFn.messaage('error',result.msg);
                }
            });
    });
    /*$(D).off("click", "#editMarkBtn").on("click", "#editMarkBtn", function () {
        var $editMarkModal = $("#editMarkModal");
        //关键信息
        var markId = $editMarkModal.find("[data-type='markId']").val();
        var customerId = $editMarkModal.find("[data-type='customerId']").val();

        //客户信息
        var name = $editMarkModal.find("[data-type='name']").val();
        var sex = $editMarkModal.find("[data-type='sex']:checked").val();
        var age = $editMarkModal.find("[data-type='age']").val();
        var birthday = $editMarkModal.find("[data-type='birthday']").val();
        var phone = $editMarkModal.find("[data-type='phone']").val();
        var address = $editMarkModal.find("[data-type='address']").val();
        var customerRemark = $editMarkModal.find("[data-type='customer-remark']").val();
        //标注信息
        var markerRemark = $editMarkModal.find("[data-type='marker-remark']").val();

        //组成爱好list
        var customerHobbyDtoList;
        var $oneHobbyDivList = $editMarkModal.find('[data-type="oneHobbyDiv"]');
        if ($oneHobbyDivList.length > 0) {
            customerHobbyDtoList = [];
            for (var i = 0; i < $oneHobbyDivList.length; i++) {
                var $oneHobbyDiv = $oneHobbyDivList.eq(i);
                var hobbyId = $oneHobbyDiv.attr('data-hobbyId') ? $oneHobbyDiv.attr('data-hobbyId') : null;
                var hobby = $oneHobbyDiv.find("[data-type='parentHobby']").val();
                var specificHobby = null;
                if (hobby.indexOf("other") < 0) {
                    specificHobby = $oneHobbyDiv.find("[data-type='childHobby']").val();
                }
                var customHobby = null;
                if (hobby.indexOf("other") >= 0 || (specificHobby && specificHobby.indexOf("other") >= 0)) {
                    customHobby = $oneHobbyDiv.find("[data-type='customHobby']").val();
                }
                customerHobbyDtoList.push(new CustomerHobbyDto(hobbyId, customerId, hobby, specificHobby, customHobby));
            }
        }

        if (!name) {
            commonFn.messaage('error', '请输入客户姓名!');
            return;
        }

        commonFn.mLoading.show();
        commonFn.ajaxPost(commonFn.baseUrl + "marker/edit.json",
            new MarkDto(markId, markerRemark, null, null, [new CustomerDto(customerId, name, sex, birthday, age, customerHobbyDtoList, phone, address, customerRemark)]),
            function (result) {
                commonFn.mLoading.hide();
                if (result.success) {
                    //保存成功后从markers中删除这个点并重新展示这个点（页面上）
                    var data = result.data;
                    removeMark(data.markId);
                    //回显mark并打开对应信息窗体
                    AMap.event.trigger(showMark(data), 'click');
                    $("#editMarkModal").modal("hide");
                } else {
                    alert(result.msg);
                }
            });
    });*/


    /**
     * 用于页面回显标记(不产生数据库交互)
     * @param markVo
     */
    var showMark = function (markVo) {
        var customerVoList = markVo.customerVoList;
        var customerVo = customerVoList[0];
        var lngLat = new AMap.LngLat(markVo.lng, markVo.lat);
        // 创建一个 Marker 实例：
        var marker = new AMap.Marker({
            position: lngLat,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
            title: (!customerVoList || customerVoList.length == 0) ? '' : (customerVoList.length > 1 ? (customerVoList[0].name + ' 等' + customerVoList.length + '人') : (customerVoList[0].name)),
            label: {
                content: (!customerVoList || customerVoList.length == 0) ? '' : (customerVoList.length > 1 ? (customerVoList[0].name + ' 等' + customerVoList.length + '人') : (customerVoList[0].name)),
                offset: new AMap.Pixel(20, 5)
            }
        });
        // 将创建的点标记添加到已有的地图实例
        marker.setExtData(markVo.markId);
        map.add(marker);
        markers.push(marker);

        //创建信息窗口
        // 创建 infoWindow 实例
        //模板构造

        var $showContent = $('<div></div>');
        if (customerVoList && customerVoList.length > 0) {
            var $customerInfoDiv = $('<div style="min-width:230px;max-height: 400px; overflow:auto"></div>');
            $.each(customerVoList, function (index, customerVo) {
                var $customerInfoTable = $('<div><span class="ft-weight-bolder margin-right-5px">姓名:</span><span data-type="name"></span></div>' +
                    '<div><span class="ft-weight-bolder margin-right-5px">性别:</span><span data-type="sex"></span></div>' +
                    '<div><span class="ft-weight-bolder margin-right-5px">年龄:</span><span data-type="age"></span></div>' +
                    '<div><span class="ft-weight-bolder margin-right-5px">生日:</span><span data-type="birthday"></span></div>' +
                    '<div><span class="ft-weight-bolder margin-right-5px">爱好:</span><span data-type="hobby"></span></div>' +
                    '<div><span class="ft-weight-bolder margin-right-5px">电话:</span><span data-type="phone"></span></div>' +
                    '<div><span class="ft-weight-bolder margin-right-5px">基础地址:</span><textarea class="border-radius-5px padding-all-2px" rows="3" data-type="basicAddress" disabled></textarea></div>' +
                    '<div><span class="ft-weight-bolder margin-right-5px">详细地址:</span><textarea class="border-radius-5px padding-all-2px" rows="3" data-type="detailedAddress" disabled></textarea></div>' +
                    '<div><span class="ft-weight-bolder margin-right-5px">备注:</span><span data-type="customer-remark"></span></div>' +
                    '<hr/>');

                //信息注入
                $customerInfoTable.find('[data-type="name"]').text(customerVo.name);
                $customerInfoTable.find('[data-type="sex"]').text(commonFn.sexFormat(customerVo.sex));
                customerVo.age == 0 || customerVo.age ? $customerInfoTable.find('[data-type="age"]').text(customerVo.age) : $customerInfoTable.find('[data-type="age"]').html('<span class="ft-color-lightgray">未设置</span>');
                customerVo.birthday ? $customerInfoTable.find('[data-type="birthday"]').text(commonFn.dateFormat(customerVo.birthday)) : $customerInfoTable.find('[data-type="birthday"]').html('<span class="ft-color-lightgray">未设置</span>');
                var $customerHobbyOl = '<span class="ft-color-lightgray">暂无</span>';
                var customerHobbyVoList = customerVo.customerHobbyVoList;
                if (customerHobbyVoList && customerHobbyVoList.length > 0) {
                    $customerHobbyOl = $('<ol></ol>');
                    for (var i = 0; i < customerHobbyVoList.length; i++) {
                        $customerHobbyOl.append('<li class="margin-bottom-5px">' +
                            '<span class="border-width-1px border-radius-5px bg-color-deepskyblue ft-color-white padding-all-2px">' + commonObject.hobby.getParentHobbyName(customerHobbyVoList[i].hobby) + '</span>&nbsp;' +
                            (customerHobbyVoList[i].specificHobby ? '<span class="border-width-1px border-radius-5px bg-color-deepskyblue ft-color-white padding-all-2px">' + commonObject.hobby.getChildHobbyName(customerHobbyVoList[i].specificHobby) + '</span>&nbsp;' : '&nbsp;') +
                            (customerHobbyVoList[i].customHobby ? '<span class="border-width-1px border-radius-5px bg-color-deepskyblue ft-color-white padding-all-2px">' + customerHobbyVoList[i].customHobby + '</span>' : '&nbsp;') + '</li>');
                    }
                }
                $customerInfoTable.find('[data-type="hobby"]').html($customerHobbyOl);
                customerVo.phone ? $customerInfoTable.find('[data-type="phone"]').text(customerVo.phone) : $customerInfoTable.find('[data-type="phone"]').html('<span class="ft-color-lightgray">未填写</span>');
                customerVo.basicAddress ? $customerInfoTable.find('[data-type="basicAddress"]').val(customerVo.basicAddress) : $customerInfoTable.find('[data-type="basicAddress"]').val('未填写');
                customerVo.detailedAddress ? $customerInfoTable.find('[data-type="detailedAddress"]').val(customerVo.detailedAddress) : $customerInfoTable.find('[data-type="detailedAddress"]').val('未填写');
                customerVo.remark ? $customerInfoTable.find('[data-type="customer-remark"]').text(customerVo.remark) : $customerInfoTable.find('[data-type="customer-remark"]').html('<span class="ft-color-lightgray">未填写</span>');
                var $singleContent = $('<div class="border-width-1px border-style-solid border-color-darkgray border-radius-5px padding-all-2px margin-top-5px margin-bottom-5px" style="min-width: 200px;" data-type="singleDiv">' +
                    '<div><span class="ft-weight-bolder">' + customerVo.name + '</span><span class="pull-right cursor-pointer glyphicon ' + (index == 0 ? 'glyphicon-minus' : 'glyphicon-plus') + '" data-type="openDetailedCustomerInfoBtn"></span></div>' +
                    '<div class="' + (index == 0 ? '' : 'hidden') + '" data-type="infoDiv">' +
                    '<div class="border-radius-5px border-color-darkgray border-width-1px" data-type="customerInfoDiv">' +
                    '<div class="bg-color-darkgray ft-color-white text-center padding-left-5px padding-top-5px padding-bottom-5px ft-weight-bolder margin-bottom-5px">客户信息</div>' +
                    '</div>' +
                    '<div class="margin-top-5px text-center ' + (index == 0 ? '' : 'hidden') + '" data-type="operateDiv">' +
                    /*'<span class="glyphicon glyphicon-pencil bg-color-darkgray border-radius-5px padding-all-5px cursor-pointer" data-type="editCustomerBtn" data-customerId="' + customerVo.id + '"></span>' +*/
                    '&nbsp;' +
                    '<span class="glyphicon glyphicon-comment bg-color-darkgray border-radius-5px padding-all-5px cursor-pointer" data-type="editNoteBtn" data-customerId="' + customerVo.id + '"></span>' +
                    '&nbsp;' +
                    /*'<span class="glyphicon glyphicon-trash bg-color-darkgray border-radius-5px padding-all-5px cursor-pointer" data-type="deleteMarkBtn" data-markId="' + markVo.markId + '"></span>' +*/
                    '</div></div>');
                $singleContent.find('[data-type="customerInfoDiv"]').append($customerInfoTable);
                $singleContent.find('[data-type="markerInfoDiv"]').append($markerInfoTable);

                $customerInfoDiv.append($singleContent);
            });
            $showContent.append($customerInfoDiv);
        }
        //注入标注信息
        var $markerInfoTable = $('<div class="border-radius-5px border-color-darkgray border-width-1px" data-type="markerInfoDiv">' +
            '<div class="bg-color-darkgray ft-color-white text-center padding-left-5px padding-top-5px padding-bottom-5px ft-weight-bolder margin-bottom-5px">标注信息</div>' +
            '<span class="ft-weight-bolder margin-right-5px">备注:</span><textarea disabled data-type="marker-remark"></textarea>' +
            '<div class="text-center" data-type="operateDiv">' +
            '<span class=" margin-all-2px glyphicon glyphicon-pencil bg-color-darkgray border-radius-5px padding-all-5px cursor-pointer" data-type="editMarkBtn" data-markId = "' + markVo.markId + '"></span>' +
            '<span class="glyphicon glyphicon-trash bg-color-darkgray border-radius-5px padding-all-5px cursor-pointer" data-type="deleteMarkBtn" data-markId="' + markVo.markId + '"></span>' +
            '</div>' +
            '</div>');
        markVo.remark ? $markerInfoTable.find('[data-type="marker-remark"]').val(markVo.remark) : $markerInfoTable.find('[data-type="marker-remark"]').val('未填写');
        $showContent.append($markerInfoTable);

        var infoWindow = new AMap.InfoWindow({
            position: lngLat,
            content: $showContent[0],
            offset: new AMap.Pixel(1, -15),
            autoMove: true
        });

        //绑定标点单击事件
        marker.on('click', function () {
            currentInfoWindow = infoWindow;
            infoWindow.open(map);
        });

        //返回mark对象,用于保存时或编辑时模拟打开信息窗体
        return marker;
    };

    $(D).off('click', '[data-type="openDetailedCustomerInfoBtn"]').on('click', '[data-type="openDetailedCustomerInfoBtn"]', function () {
        $(this).closest('div[data-type="singleDiv"]').find('[data-type="infoDiv"]').toggleClass('hidden');
        $(this).closest('div[data-type="singleDiv"]').find('[data-type="operateDiv"]').toggleClass('hidden');
        if ($(this).hasClass('glyphicon-minus')) {
            $(this).removeClass('glyphicon-minus').addClass('glyphicon-plus');
        } else {
            $(this).removeClass('glyphicon-plus').addClass('glyphicon-minus');
        }
    });

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
    $(D).off("click", "[data-type='editMarkBtn']").on("click", "[data-type='editMarkBtn']", function () {
        //从数据库查询客户信息和标注信息
        var markId = $(this).attr("data-markId");
        commonFn.mLoading.show();
        $.get(commonFn.baseUrl + "marker/get.json?markId=" + markId, function (result) {
            commonFn.mLoading.hide();
            if (result.success) {
                var markVo = result.data;
                var customerVoList = markVo.customerVoList;
                var $editMarkModal = $("#editMarkModal");
                $editMarkModal.find("[data-type='markId']").val(markVo.markId);
                //先清空编辑mark模态框的客户列表
                var $customerUl = $editMarkModal.find('[data-type="customerList"]');
                $customerUl.empty();
                //循环渲染客户
                if (customerVoList) {
                    $.each(customerVoList, function (index, customerVo) {
                        var $li = $('<li class="list-group-item"></li>');
                        var $table = $('<table></table>');
                        var $tr = $('<tr></tr>');
                        var $td = $('<td></td>');
                        var $mainDiv = $('<div class="border-width-1px border-style-solid border-color-darkgray border-radius-5px padding-all-5px margin-top-5px margin-bottom-5px bg-color-lightgray"></div>');

                        //简短信息
                        var $briefInfoDiv = $('<div class="border-width-1px border-style-solid border-color-darkgray" data-type="briefInfoDiv"> <span class="pull-right glyphicon glyphicon-remove cursor-pointer" data-type="removeCustomerBtn" data-customerId="' + customerVo.id + '" data-markId="' + markVo.markId + '" title="从该标记点中移除此该客户"></span></div>');
                        var $nameDiv = $('<div class="pull-left padding-all-2px ft-weight-bolder ft-size-16px" data-type="name"></div>');
                        $nameDiv.text(customerVo.name);
                        $briefInfoDiv.append($nameDiv);
                        $briefInfoDiv.append('<div class="pull-left  border-radius-50per ft-color-white margin-top-2px margin-left-5px ' + (customerVo.sex == 'male' ? 'bg-color-dodgerblue' : 'bg-color-red') + '" data-type="sex">' + '&nbsp;' + commonFn.sexFormat(customerVo.sex) + '&nbsp;' + '</div>');
                        $briefInfoDiv.append('<div class="pull-left padding-all-2px margin-left-5px " data-type="age">' + (customerVo.age ? customerVo.age + '岁' : '未设置年龄') + '</div>');
                        $briefInfoDiv.append('<div class="pull-left padding-all-2px margin-left-5px " data-type="birthday">' + (customerVo.birthday ? commonFn.dateFormat(customerVo.birthday) : '未设置生日') + '</div>');
                        $briefInfoDiv.append('<div class="clear-float"></div>');
                        $mainDiv.append($briefInfoDiv);

                        //详细信息
                        var $detailedInfoDiv = $('<div class="border-width-1px border-style-solid border-color-darkgray" data-type="detailedInfoDiv"></div>');
                        $detailedInfoDiv.append('<div class="padding-all-2px margin-left-5px " data-type="hobbyDiv"><div class="pull-left">爱好:</div><div class="pull-left" data-type="hobby"></div><div class="clear-float"></div></div>');
                        //处理爱好回显
                        var $customerHobbyOl = '<span>暂无</span>';
                        var customerHobbyVoList = customerVo.customerHobbyVoList;
                        if (customerHobbyVoList && customerHobbyVoList.length > 0) {
                            $customerHobbyOl = $('<ol></ol>');
                            for (var i = 0; i < customerHobbyVoList.length; i++) {
                                $customerHobbyOl.append('<li class="margin-bottom-5px">' +
                                    '<span class="border-width-1px border-radius-5px bg-color-deepskyblue ft-color-white padding-all-2px">' + commonObject.hobby.getParentHobbyName(customerHobbyVoList[i].hobby) + '</span>&nbsp;' +
                                    (customerHobbyVoList[i].specificHobby ? '<span class="border-width-1px border-radius-5px bg-color-deepskyblue ft-color-white padding-all-2px">' + commonObject.hobby.getChildHobbyName(customerHobbyVoList[i].specificHobby) + '</span>&nbsp;' : '&nbsp;') +
                                    (customerHobbyVoList[i].customHobby ? '<span class="border-width-1px border-radius-5px bg-color-deepskyblue ft-color-white padding-all-2px">' + customerHobbyVoList[i].customHobby + '</span>' : '&nbsp;') + '</li>');
                            }
                        }
                        $detailedInfoDiv.find('[data-type="hobby"]').html($customerHobbyOl);

                        $detailedInfoDiv.append('<div class="padding-all-2px margin-left-5px " data-type="phoneDiv"> 电话: <span data-type="phone">' + (customerVo.phone ? customerVo.phone : '未设置') + '</span></div>');
                        $detailedInfoDiv.append('<div class="padding-all-2px margin-left-5px " data-type="addressDiv"> 基础地址: <textarea disabled rows="4" cols="20" data-type="basicAddress">' + (customerVo.basicAddress ? customerVo.basicAddress : '未设置') + '</textarea></div>');
                        $detailedInfoDiv.append('<div class="padding-all-2px margin-left-5px " data-type="addressDiv"> 详细地址: <textarea disabled rows="4" cols="20" data-type="detailedAddress">' + (customerVo.basicAddress ? customerVo.detailedAddress : '未设置') + '</textarea></div>');
                        $detailedInfoDiv.append('<div class="padding-all-2px margin-left-5px " data-type="remarkDiv"> 备注: <span data-type="remark">' + (customerVo.remark ? '<textarea disabled rows="4" cols="24">' + customerVo.remark + '</textarea>' : '未设置') + '</span></div>');
                        $detailedInfoDiv.append('<div class="padding-all-2px margin-left-5px " data-type="createTimeDiv"> 创建时间: <span data-type="createTime">' + commonFn.dateFormat(customerVo.createTime, 'yyyy-MM-dd HH:mm:ss') + '</span></div>');
                        $detailedInfoDiv.append('<div class="padding-all-2px margin-left-5px " data-type="updateTimeDiv"> 更新时间: <span data-type="updateTime">' + (customerVo.updateTime ? commonFn.dateFormat(customerVo.updateTime, 'yyyy-MM-dd HH:mm:ss') : '尚未更新') + '</span></div>');
                        $mainDiv.append($detailedInfoDiv);
                        $td.append($mainDiv);
                        $tr.append($td);
                        $table.append($tr);
                        $li.append($table);
                        $customerUl.append($li);
                    });
                }

                //获取noMapMarkerIdCustomerList
                commonFn.mLoading.show();
                commonFn.ajaxGet(commonFn.baseUrl+'customer/getNoMapMarkerIdCustomerList.json',null,function(result){
                    if(result.success){
                        commonFn.mLoading.hide();
                        var noMapMarkerIdCustomerList = result.data;
                        var $noMapMarkerIdCustomerList = $('#editMarkModal [data-type="noMapMarkerIdCustomerList"]');
                        $noMapMarkerIdCustomerList.empty();
                        $noMapMarkerIdCustomerList.append('<option value="null">请选择</option>');
                        if(noMapMarkerIdCustomerList && noMapMarkerIdCustomerList.length>0){
                            $.each(noMapMarkerIdCustomerList,function(index,customerVo){
                                var $option = $('<option></option>');
                                $option.val(customerVo.id);
                                $option.text(customerVo.name);
                                $noMapMarkerIdCustomerList.append($option);
                            });
                        }
                        $editMarkModal.modal("show");
                    }else{
                        commonFn.messaage('error',result.msg);
                    }
                });

            } else {
                alert(result.msg);
            }
        });
    });

    /*$(D).off("click", "[data-type='editMarkBtn']").on("click", "[data-type='editMarkBtn']", function () {
        //从数据库查询客户信息和标注信息
        var markId = $(this).attr("data-markId");
        commonFn.mLoading.show();
        $.get(commonFn.baseUrl + "marker/get.json?markId=" + markId, function (result) {
            commonFn.mLoading.hide();
            if (result.success) {
                var markVo = result.data;
                var customerVo = (markVo.customerVoList)[0];
                var $editMarkModal = $("#editMarkModal");
                //先清空编辑mark模态框的所有信息
                clearEditMarkModalInfo();
                $editMarkModal.find("[data-type='markId']").val(markVo.markId);
                $editMarkModal.find("[data-type='customerId']").val(customerVo.customerId);
                $editMarkModal.find("[data-type='lng']").html(markVo.lng);
                $editMarkModal.find("[data-type='lat']").html(markVo.lat);
                $editMarkModal.find("[data-type='name']").val(customerVo.name);
                $editMarkModal.find("[data-type='sex']:checked").prop('checked', false);
                $editMarkModal.find("[data-type='sex'][value='" + customerVo.sex + "']").prop('checked', true);
                $editMarkModal.find("[data-type='age']").val(customerVo.age);
                $editMarkModal.find("[data-type='birthday']").val(customerVo.birthday ? commonFn.dateFormat(customerVo.birthday, 'yyyy-MM-dd') : '');

                //处理爱好回显
                var customerHobbyVoList = customerVo.customerHobbyVoList;
                if (customerHobbyVoList && customerHobbyVoList.length > 0) {
                    for (var i = 0; i < customerHobbyVoList.length; i++) {
                        //生成列表
                        generateHobbyDiv($editMarkModal);
                    }
                    var $oneHobbyDivList = $editMarkModal.find('[data-type="oneHobbyDiv"]');
                    for (var j = 0; j < customerHobbyVoList.length; j++) {
                        //回显数据
                        var customerHobbyVo = customerHobbyVoList[j];
                        var $oneHobbyDiv = $oneHobbyDivList.eq(j);
                        $oneHobbyDiv.attr("data-hobbyId", customerHobbyVo.id);
                        var $parentHobbySelect = $oneHobbyDiv.find('[data-type="parentHobby"]');
                        $parentHobbySelect.val(customerHobbyVo.hobby);
                        $parentHobbySelect.trigger("change");
                        if (customerHobbyVo.hobby.indexOf('other') >= 0) {
                            $oneHobbyDiv.find('[data-type="customHobby"]').val(customerHobbyVo.customHobby);
                        } else {
                            var $childHobbySelect = $oneHobbyDiv.find('[data-type="childHobby"]');
                            $childHobbySelect.val(customerHobbyVo.specificHobby);
                            $childHobbySelect.trigger('change');
                            if (customerHobbyVo.specificHobby.indexOf('other') >= 0) {
                                $oneHobbyDiv.find('[data-type="customHobby"]').val(customerHobbyVo.customHobby);
                            }
                        }
                    }
                }

                $editMarkModal.find("[data-type='phone']").val(customerVo.phone);
                $editMarkModal.find("[data-type='address']").val(customerVo.address);
                $editMarkModal.find("[data-type='customer-remark']").val(customerVo.remark);
                $editMarkModal.find("[data-type='marker-remark']").val(markVo.remark);
                $editMarkModal.modal("show");
            } else {
                alert(result.msg);
            }
        });
    });*/

    //编辑标记模态框 添加到客户列表按钮单击事件
    $(D).off('click','#editMarkModal [data-type="addToCustomerListBtn"]').on('click','#editMarkModal [data-type="addToCustomerListBtn"]',function(){
        var $editMarkModal = $('#editMarkModal');
        var customerId = $editMarkModal.find('[data-type="noMapMarkerIdCustomerList"]').val();
        if(customerId=='null'){
            commonFn.messaage('error',"请选择希望加入客户列表的客户!");
            return;
        }
        var markId = $editMarkModal.find('[data-type="markId"]').val();
        commonFn.mLoading.show();
        $.post(
            commonFn.baseUrl+'customer/editMapMarkId.json',
            {
                customerId:customerId,
                markId:markId
            },
            function(result){
                if(result.success){
                    //将该客户信息添加到模态框中
                    var customerVo = result.data;
                    var $li = $('<li class="list-group-item"></li>');
                    var $table = $('<table></table>');
                    var $tr = $('<tr></tr>');
                    var $td = $('<td></td>');
                    var $mainDiv = $('<div class="border-width-1px border-style-solid border-color-darkgray border-radius-5px padding-all-5px margin-top-5px margin-bottom-5px bg-color-lightgray"></div>');

                    //简短信息
                    var $briefInfoDiv = $('<div class="border-width-1px border-style-solid border-color-darkgray" data-type="briefInfoDiv"> <span class="pull-right glyphicon glyphicon-remove cursor-pointer" data-type="removeCustomerBtn" data-customerId="' + customerVo.id + '" data-markId="' + markId + '" title="从该标记点中移除此该客户"></span></div>');
                    var $nameDiv = $('<div class="pull-left padding-all-2px ft-weight-bolder ft-size-16px" data-type="name"></div>');
                    $nameDiv.text(customerVo.name);
                    $briefInfoDiv.append($nameDiv);
                    $briefInfoDiv.append('<div class="pull-left  border-radius-50per ft-color-white margin-top-2px margin-left-5px ' + (customerVo.sex == 'male' ? 'bg-color-dodgerblue' : 'bg-color-red') + '" data-type="sex">' + '&nbsp;' + commonFn.sexFormat(customerVo.sex) + '&nbsp;' + '</div>');
                    $briefInfoDiv.append('<div class="pull-left padding-all-2px margin-left-5px " data-type="age">' + (customerVo.age ? customerVo.age + '岁' : '未设置年龄') + '</div>');
                    $briefInfoDiv.append('<div class="pull-left padding-all-2px margin-left-5px " data-type="birthday">' + (customerVo.birthday ? commonFn.dateFormat(customerVo.birthday) : '未设置生日') + '</div>');
                    $briefInfoDiv.append('<div class="clear-float"></div>');
                    $mainDiv.append($briefInfoDiv);

                    //详细信息
                    var $detailedInfoDiv = $('<div class="border-width-1px border-style-solid border-color-darkgray" data-type="detailedInfoDiv"></div>');
                    $detailedInfoDiv.append('<div class="padding-all-2px margin-left-5px " data-type="hobbyDiv"><div class="pull-left">爱好:</div><div class="pull-left" data-type="hobby"></div><div class="clear-float"></div></div>');
                    //处理爱好回显
                    var $customerHobbyOl = '<span>暂无</span>';
                    var customerHobbyVoList = customerVo.customerHobbyVoList;
                    if (customerHobbyVoList && customerHobbyVoList.length > 0) {
                        $customerHobbyOl = $('<ol></ol>');
                        for (var i = 0; i < customerHobbyVoList.length; i++) {
                            $customerHobbyOl.append('<li class="margin-bottom-5px">' +
                                '<span class="border-width-1px border-radius-5px bg-color-deepskyblue ft-color-white padding-all-2px">' + commonObject.hobby.getParentHobbyName(customerHobbyVoList[i].hobby) + '</span>&nbsp;' +
                                (customerHobbyVoList[i].specificHobby ? '<span class="border-width-1px border-radius-5px bg-color-deepskyblue ft-color-white padding-all-2px">' + commonObject.hobby.getChildHobbyName(customerHobbyVoList[i].specificHobby) + '</span>&nbsp;' : '&nbsp;') +
                                (customerHobbyVoList[i].customHobby ? '<span class="border-width-1px border-radius-5px bg-color-deepskyblue ft-color-white padding-all-2px">' + customerHobbyVoList[i].customHobby + '</span>' : '&nbsp;') + '</li>');
                        }
                    }
                    $detailedInfoDiv.find('[data-type="hobby"]').html($customerHobbyOl);

                    $detailedInfoDiv.append('<div class="padding-all-2px margin-left-5px " data-type="phoneDiv"> 电话: <span data-type="phone">' + (customerVo.phone ? customerVo.phone : '未设置') + '</span></div>');
                    $detailedInfoDiv.append('<div class="padding-all-2px margin-left-5px " data-type="addressDiv"> 基础地址: <textarea disabled rows="4" cols="20" data-type="basicAddress">' + (customerVo.basicAddress ? customerVo.basicAddress : '未设置') + '</textarea></div>');
                    $detailedInfoDiv.append('<div class="padding-all-2px margin-left-5px " data-type="addressDiv"> 详细地址: <textarea disabled rows="4" cols="20" data-type="detailedAddress">' + (customerVo.basicAddress ? customerVo.detailedAddress : '未设置') + '</textarea></div>');
                    $detailedInfoDiv.append('<div class="padding-all-2px margin-left-5px " data-type="remarkDiv"> 备注: <span data-type="remark">' + (customerVo.remark ? '<textarea disabled rows="4" cols="24">' + customerVo.remark + '</textarea>' : '未设置') + '</span></div>');
                    $detailedInfoDiv.append('<div class="padding-all-2px margin-left-5px " data-type="createTimeDiv"> 创建时间: <span data-type="createTime">' + commonFn.dateFormat(customerVo.createTime, 'yyyy-MM-dd HH:mm:ss') + '</span></div>');
                    $detailedInfoDiv.append('<div class="padding-all-2px margin-left-5px " data-type="updateTimeDiv"> 更新时间: <span data-type="updateTime">' + (customerVo.updateTime ? commonFn.dateFormat(customerVo.updateTime, 'yyyy-MM-dd HH:mm:ss') : '尚未更新') + '</span></div>');
                    $mainDiv.append($detailedInfoDiv);
                    $td.append($mainDiv);
                    $tr.append($td);
                    $table.append($tr);
                    $li.append($table);
                    $editMarkModal.find('[data-type="customerList"]').prepend($li);

                    //保存成功后从markers中删除这个点并重新展示这个点（页面上）
                    commonFn.ajaxGet(commonFn.baseUrl+"marker/get.json",{markId:markId},function(result){
                        if(result.success){
                            var data = result.data;
                            removeMark(data.markId);
                            //回显mark并打开对应信息窗体
                            AMap.event.trigger(showMark(data), 'click');
                        }else{
                            commonFn.messaage('error',result.msg);
                        }
                    });

                    //重新渲染未添加标注的客户列表
                    commonFn.ajaxGet(commonFn.baseUrl+'customer/getNoMapMarkerIdCustomerList.json',null,function(result){
                        if(result.success){
                            var noMapMarkerIdCustomerList = result.data;
                            var $noMapMarkerIdCustomerList = $editMarkModal.find('[data-type="noMapMarkerIdCustomerList"]');
                            $noMapMarkerIdCustomerList.empty();
                            $noMapMarkerIdCustomerList.append('<option value="null">请选择</option>');
                            if(noMapMarkerIdCustomerList && noMapMarkerIdCustomerList.length>0){
                                $.each(noMapMarkerIdCustomerList,function(index,customerVo){
                                    var $option = $('<option></option>');
                                    $option.val(customerVo.id);
                                    $option.text(customerVo.name);
                                    $noMapMarkerIdCustomerList.append($option);
                                });
                            }
                            commonFn.mLoading.hide();
                            commonFn.messaage('添加成功!');
                        }else{
                            commonFn.messaage('error',result.msg);
                        }
                    });
                }else{
                    commonFn.messaage('error',result.msg);
                }
            }
        );
    });

    //编辑标记模态框 从标记中移除某个客户按钮单击事件
    $(D).off('click', '#editMarkModal [data-type="customerList"] [data-type="removeCustomerBtn"]')
        .on('click', '#editMarkModal [data-type="customerList"] [data-type="removeCustomerBtn"]', function () {
            var flag = confirm('是否立即将该客户从该标注点中移除?(不删除客户实体)');
            if (!flag) {
                return;
            }
            var customerId = $(this).attr('data-customerId');
            var markId = $(this).attr('data-markId');
            var $li = $(this).closest('li');
            commonFn.mLoading.show();
            $.post(
                commonFn.baseUrl + "marker/removeCustomer.json",
                {
                    customerId: customerId,
                    markId: markId
                },
                function (result) {
                    commonFn.mLoading.hide();
                    if (result.success) {
                        //保存成功后从markers中删除这个点并重新展示这个点（页面上）
                        commonFn.ajaxGet(commonFn.baseUrl+"marker/get.json",{markId:markId},function(result){
                            if(result.success){
                                var data = result.data;
                                removeMark(data.markId);
                                //回显mark并打开对应信息窗体
                                AMap.event.trigger(showMark(data), 'click');
                            }else{
                                commonFn.messaage('error',result.msg);
                            }
                        });
                        $li.remove();
                        commonFn.messaage("success", "该客户已从该标记点移除!");
                    } else {
                        commonFn.messaage("error", result.msg);
                    }
                }
            );

        });

    var customerNoteTable;
    //编辑note按钮单击事件
    $(D).off("click", "[data-type='editNoteBtn']").on("click", "[data-type='editNoteBtn']", function () {
        var customerId = $(this).attr('data-customerId');
        var $createCustomerNoteDiv = $("#createCustomerNoteDiv");
        $createCustomerNoteDiv.find('[data-type="saveBtn"]').attr('data-customerId', customerId);
        customerNoteTable = new commonFn.PageTable($("#customerNotePageTable"), commonFn.baseUrl + "customerNote/pageData.json", new CustomerNotePageDto(customerId, 5, 1, "createTime", true), function (rows) {
            //此处写如何渲染列表到table中的逻辑
            commonFn.mLoading.show();
            var $customerNotePageTable = $("#customerNotePageTable");
            var $tbody = $customerNotePageTable.find('tbody');
            $tbody.empty();
            for (var i = 0; i < rows.length; i++) {
                var customerNoteVo = rows[i];
                var $tr = $('<tr></tr>');
                var $td = $('<td></td>');
                var $contentDiv = $('<div class="margin-bottom-5px" data-type="contentDiv"><textarea class="width-100per" rows="4" disabled="disabled" data-type="content"></textarea></div>');
                $contentDiv.find('[data-type="content"]').val(customerNoteVo.content);
                $td.append($contentDiv);

                var $timeDiv = $('<div class="pull-left" data-type="timeDiv"></div>');
                var $createTimeDiv = $('<div class="pull-left margin-right-5px" data-type="createTimeDiv"><label>创建时间:</label><span data-type="createTime"></span></div>');
                $createTimeDiv.find('[data-type="createTime"]').text(commonFn.dateFormat(customerNoteVo.createTime, 'yyyy-MM-dd HH:mm:ss'));
                var $updateTimeDiv = $('<div class="pull-left" data-type="updateTimeDiv"><label>更新时间:</label><span data-type="updateTime"></span></div>');
                $updateTimeDiv.find('[data-type="updateTime"]').text(customerNoteVo.updateTime ? commonFn.dateFormat(customerNoteVo.updateTime, 'yyyy-MM-dd HH:mm:ss') : '尚未更新');
                $timeDiv.append($createTimeDiv);
                $timeDiv.append($updateTimeDiv);
                $td.append($timeDiv);

                var $operateDiv = $('<div class="pull-right">' +
                    '<span class="glyphicon glyphicon-pencil bg-color-darkgray border-radius-5px padding-all-5px cursor-pointer margin-right-5px" data-type="editBtn"></span>' +
                    '<span class="glyphicon glyphicon-floppy-disk bg-color-darkgray border-radius-5px padding-all-5px cursor-pointer hidden  margin-right-5px" data-type="saveBtn"' +
                    ' data-customerNoteId="' + customerNoteVo.id + '"></span>' +
                    '<span class="glyphicon glyphicon-trash bg-color-darkgray border-radius-5px padding-all-5px cursor-pointer margin-right-5px" data-type="deleteBtn" ' +
                    'data-customerNoteId="' + customerNoteVo.id + '"></span>' +
                    '</div>');
                $td.append($operateDiv);
                $tr.append($td);
                $tbody.append($tr);
            }
            commonFn.mLoading.hide();
        });
        customerNoteTable.reload();
        $createCustomerNoteDiv.addClass('hidden');
        $("#showCustomerNoteDiv").removeClass('hidden');
        $("#editNoteModal").modal("show");
    });

    //编辑Note按钮单击事件
    $(D).off('click', '#customerNoteTable [data-type="editBtn"]').on('click', '#customerNoteTable [data-type="editBtn"]', function () {
        var $this = $(this);
        var $tr = $this.closest('tr');
        $tr.find('textarea[data-type="content"]').removeAttr('disabled');
        $this.addClass('hidden');
        $tr.find('[data-type="saveBtn"]').removeClass('hidden');
    });

    //保存Note按钮单击事件
    $(D).off('click', '#customerNoteTable [data-type="saveBtn"]').on('click', '#customerNoteTable [data-type="saveBtn"]', function () {
        var $this = $(this);
        var id = $this.attr('data-customerNoteId');
        var $tr = $this.closest('tr');

        var content = $tr.find('[data-type="content"]').val();
        if (!content) {
            commonFn.messaage('error', '请输入Note内容!');
            return;
        }
        var customerNoteDto = new CustomerNoteDto(id, null, content);

        commonFn.mLoading.show();
        commonFn.ajaxPost('customerNote/edit.json', customerNoteDto, function (result) {
            commonFn.mLoading.hide();
            if (result.success) {
                commonFn.messaage('success', '更新成功!');
                $tr.find('textarea[data-type="content"]').prop('disabled', true);
                $this.addClass('hidden');
                $tr.find('[data-type="editBtn"]').removeClass('hidden');
                var customerNoteVo = result.data;
                $tr.find('[data-type="content"]').val(customerNoteVo.content);
                $tr.find('[data-type="createTime"]').text(commonFn.dateFormat(customerNoteVo.createTime, 'yyyy-MM-dd HH:mm:ss'));
                $tr.find('[data-type="updateTime"]').text(commonFn.dateFormat(customerNoteVo.updateTime, 'yyyy-MM-dd HH:mm:ss'));
            } else {
                commonFn.messaage('error', result.msg);
            }
        });
    });

    //删除Note按钮单击事件
    $(D).off('click', '#customerNoteTable [data-type="deleteBtn"]').on('click', '#customerNoteTable [data-type="deleteBtn"]', function () {
        var flag = confirm('确定删除该Note吗?删除后无法恢复!');
        if (!flag) {
            return;
        }
        var id = $(this).attr('data-customerNoteId');
        commonFn.mLoading.show();
        $.post(
            commonFn.baseUrl + 'customerNote/delete.json',
            {id: id},
            function (result) {
                commonFn.mLoading.hide();
                if (result.success) {
                    commonFn.messaage('success', '删除成功!');
                    customerNoteTable.refresh();
                } else {
                    commonFn.messaage('error', result.msg);
                }
            }
        );


    });

    //新建Note按钮单击事件
    $(D).off('click', '#showCustomerNoteDiv [data-type="createBtn"]').on('click', '#showCustomerNoteDiv [data-type="createBtn"]', function () {
        var $showCustomerNoteDiv = $('#showCustomerNoteDiv');
        var $createCustomerNoteDiv = $('#createCustomerNoteDiv');

        //清空信息
        $createCustomerNoteDiv.find('[data-type="content"]').val('');

        $showCustomerNoteDiv.addClass('hidden');
        $createCustomerNoteDiv.removeClass('hidden');
    });

    //新建Note的保存按钮单击事件
    $(D).off('click', '#createCustomerNoteDiv [data-type="saveBtn"]').on('click', '#createCustomerNoteDiv [data-type="saveBtn"]', function () {
        //获取数据
        var $createCustomerNoteDiv = $('#createCustomerNoteDiv');
        var customerId = $createCustomerNoteDiv.find('[data-type="saveBtn"]').attr('data-customerId');
        var content = $createCustomerNoteDiv.find('[data-type="content"]').val();
        if (!content) {
            commonFn.messaage('error', '请输入Note内容!');
            return;
        }

        commonFn.mLoading.show();
        commonFn.ajaxPost(
            commonFn.baseUrl + 'customerNote/create.json',
            new CustomerNoteDto(null, customerId, content),
            function (result) {
                commonFn.mLoading.hide();
                if (result.success) {
                    commonFn.messaage('success', '保存成功!');
                } else {
                    commonFn.messaage('success', result.msg);
                }
            }
        );

    });

    //新建Note的返回按钮单击事件
    $(D).off('click', '#createCustomerNoteDiv [data-type="returnBtn"]').on('click', '#createCustomerNoteDiv [data-type="returnBtn"]', function () {
        var $showCustomerNoteDiv = $('#showCustomerNoteDiv');
        var $createCustomerNoteDiv = $('#createCustomerNoteDiv');
        customerNoteTable.reload();
        $showCustomerNoteDiv.removeClass('hidden');
        $createCustomerNoteDiv.addClass('hidden');
    });

    //删除标记按钮单击事件
    $(D).off("click", "[data-type='deleteMarkBtn']").on("click", "[data-type='deleteMarkBtn']", function () {
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

    //生日输入框值改变事件(计算年龄回显)
    $(D).off("input propertychange", "#addMarkModal [data-type='birthday'],#editMarkModal [data-type='birthday']")
        .on("input propertychange", "#addMarkModal [data-type='birthday'],#editMarkModal [data-type='birthday']", function () {
            var inputStr = $(this).val();
            var age = commonFn.age(inputStr);
            if (age != 0 && !age) {
                //返回年龄不正确,清空年龄
                $(this).closest('div.modal').find("[data-type='age']").val('');
            } else {
                //回显年龄
                $(this).closest('div.modal').find("[data-type='age']").val(age);
            }
        });

    //日期控件改变日期后自动回显年龄
    $(D).off("changeDate", "[data-type='birthdayInput']").on("changeDate", "[data-type='birthdayInput']", function (ev) {
        var date = ev.date;
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var birthdayStr = year + "-" + month + "-" + day;
        var age = commonFn.age(birthdayStr);
        $(this).closest('div.modal').find("[data-type='age']").val(age);
    });

    //添加爱好按钮单击事件
    $(D).off("click", "#addMarkModal [data-type='addHobbyBtn'],#editMarkModal [data-type='addHobbyBtn']")
        .on("click", "#addMarkModal [data-type='addHobbyBtn'],#editMarkModal [data-type='addHobbyBtn']", function () {
            generateHobbyDiv($(this));
        });

    //子爱好改变事件
    $(D).off('change', '#addMarkModal [data-type="childHobby"],#editMarkModal [data-type="childHobby"]')
        .on('change', '#addMarkModal [data-type="childHobby"],#editMarkModal [data-type="childHobby"]', function () {

            if ($(this).val().indexOf('other') >= 0) {
                $(this).closest('[data-type="oneHobbyDiv"]').find('[data-type="customHobby"]').val('').removeClass('hidden');
            } else {
                $(this).closest('[data-type="oneHobbyDiv"]').find('[data-type="customHobby"]').addClass('hidden');
            }
        });

    //父爱好改变事件
    $(D).off('change', '#addMarkModal [data-type="parentHobby"],#editMarkModal [data-type="parentHobby"]')
        .on('change', '#addMarkModal [data-type="parentHobby"],#editMarkModal [data-type="parentHobby"]', function () {
            //生成子hobby节点并回显
            var $this = $(this);
            var $oneHobbyDiv = $this.closest("[data-type='oneHobbyDiv']");
            var parentHobby = $this.val();
            if (parentHobby != 'other') {
                var $childHobby = $oneHobbyDiv.find("[data-type='childHobby']");
                $childHobby.empty().append("<option>请选择</option>");
                if (parentHobby) {
                    var childHobbyList = commonObject.hobby.getChildHobbyList(parentHobby);
                    $.each(childHobbyList, function (index, element) {
                        $childHobby.append('<option value="' + element.key + '">' + element.cn_name + '</option>');
                    });
                }
                $oneHobbyDiv.find("[data-type='customHobby']").addClass("hidden");
                $childHobby.removeClass("hidden");
            } else {
                $oneHobbyDiv.find("[data-type='childHobby']").addClass("hidden");
                $oneHobbyDiv.find("[data-type='customHobby']").val('').removeClass("hidden");
            }
        });

    //移除爱好单击事件
    $(D).off('click', '#addMarkModal [data-type="removeHobbyBtn"],#editMarkModal [data-type="removeHobbyBtn"]')
        .on('click', '#addMarkModal [data-type="removeHobbyBtn"],#editMarkModal [data-type="removeHobbyBtn"]', function () {
            $(this).closest("[data-type='oneHobbyDiv']").remove();
        });

    //生成hobbyDiv方法
    var generateHobbyDiv = function ($object) {
        var $hobbyDiv = $object.closest("div.modal").find("[data-type='hobbyDiv']");
        var $oneHobbyDiv = $('<div data-type="oneHobbyDiv"></div>');
        var $parentHobbyDiv = $('<div class="pull-left" data-type="parentHobbyDiv"></div>');

        //读取公共hobby并设置父hobby
        var $parentHobbySelect = $('<select data-type="parentHobby"><option>请选择</option></select>');
        var parentHobbyList = commonObject.hobby.getParentHobbyList();
        $.each(parentHobbyList, function (index, element) {
            $parentHobbySelect.append('<option value="' + element.key + '">' + element.cn_name + '</option>');
        });
        $parentHobbyDiv.append($parentHobbySelect);

        var $childHobbyDiv = $('<div class="pull-left" data-type="childHobbyDiv"><select data-type="childHobby"><option>请选择</option></select></div>');
        var $customHobbyDiv = $('<div class="pull-left" data-type="customHobbyDiv"><input type="text" class="hidden" data-type="customHobby" size="5" style="height: 20px;"/></div>');
        var $operateHobbyDiv = $('<div class="pull-left" date-type="operateHobbyDiv">' +
            '<span class="glyphicon glyphicon-remove cursor-pointer" data-type="removeHobbyBtn" style="margin-left: 2px;margin-top: 2px;"></span></div>');
        var $clearFloatDiv = $('<div class="clear-float"></div>');
        $oneHobbyDiv.append($parentHobbyDiv);
        $oneHobbyDiv.append($childHobbyDiv);
        $oneHobbyDiv.append($customHobbyDiv);
        $oneHobbyDiv.append($operateHobbyDiv);
        $oneHobbyDiv.append($clearFloatDiv);
        $hobbyDiv.append($oneHobbyDiv);
    };


})(jQuery, window, document);
