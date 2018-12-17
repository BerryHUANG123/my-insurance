(function ($, W, D) {
    //Dto对象
    var CustomerDto = function (id, name, sex, birthday, age, customerHobbyDtoList, phone, basicAddress, detailedAddress, lng, lat, createMarker, remark) {
        this.id = id;
        this.name = name;
        this.sex = sex;
        this.birthday = birthday;
        this.age = age;
        this.customerHobbyDtoList = customerHobbyDtoList;
        this.phone = phone;
        this.basicAddress = basicAddress;
        this.detailedAddress = detailedAddress;
        this.lng = lng;
        this.lat = lat;
        this.createMarker = createMarker;
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
    var customerPageDto = new commonFn.PageDto(30, 1, "createTime", true, null, null);

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

    //设置表格区域高度
    $("#customerTable").parent().css("height", (D.documentElement.clientHeight - 240) + 'px').css('overflow', 'auto');

    //加载客户table
    var $customerPageTable = $('#customerPageTable');
    var customerPageTable = new commonFn.PageTable($customerPageTable, commonFn.baseUrl + 'customer/pageData.json', customerPageDto, function (rows) {
        var $tbody = $("#customerTable").find('tbody');
        $tbody.empty();
        $.each(rows, function (index, customerVo) {
            var $tr = $('<tr></tr>');
            var $td = $('<td></td>');
            var $mainDiv = $('<div class="border-width-1px border-style-solid border-color-darkgray border-radius-5px padding-all-5px margin-top-5px margin-bottom-5px bg-color-lightgray"></div>');

            //简短信息
            var $briefInfoDiv = $('<div class="border-width-1px border-style-solid border-color-darkgray" data-type="briefInfoDiv"></div>');
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
            $detailedInfoDiv.append('<div class="padding-all-2px margin-left-5px " data-type="addressDiv"> 地址: <span data-type="address">' + (customerVo.address ? customerVo.address : '未设置') + '</span></div>');
            $detailedInfoDiv.append('<div class="padding-all-2px margin-left-5px " data-type="remarkDiv"> 备注: <span data-type="remark">' + (customerVo.remark ? '<textarea disabled rows="4" cols="40">' + customerVo.remark + '</textarea>' : '未设置') + '</span></div>');
            $detailedInfoDiv.append('<div class="padding-all-2px margin-left-5px " data-type="createTimeDiv"> 创建时间: <span data-type="createTime">' + commonFn.dateFormat(customerVo.createTime, 'yyyy-MM-dd HH:mm:ss') + '</span></div>');
            $detailedInfoDiv.append('<div class="padding-all-2px margin-left-5px " data-type="updateTimeDiv"> 更新时间: <span data-type="updateTime">' + (customerVo.updateTime ? commonFn.dateFormat(customerVo.updateTime, 'yyyy-MM-dd HH:mm:ss') : '尚未更新') + '</span></div>');
            $mainDiv.append($detailedInfoDiv);


            var $operateDiv = $('<div class="text-center margin-top-5px" data-type="operateDiv">' +
                '<span class="glyphicon glyphicon-pencil bg-color-darkgray border-radius-5px padding-all-5px cursor-pointer" data-type="editBtn"  data-customerId="' + customerVo.id + '" title="编辑客户信息"></span>' +
                '&nbsp;' +
                '<span class="glyphicon glyphicon-comment bg-color-darkgray border-radius-5px padding-all-5px cursor-pointer" data-type="editNoteBtn" data-customerId="' + customerVo.id + '" title="编辑客户Note"></span>' +
                '&nbsp;' +
                '<span class="glyphicon glyphicon-trash bg-color-darkgray border-radius-5px padding-all-5px cursor-pointer" data-type="deleteBtn" data-customerId="' + customerVo.id + '" title="删除客户"></span>' +
                '</div>');
            $mainDiv.append($operateDiv);
            $td.append($mainDiv);
            $tr.append($td);
            // console.log($tr);
            $tbody.append($tr);
        });
    }, false).reload();

    //新增客户按钮单击事件
    $(D).off('click', '#addCustomerBtn').on('click', '#addCustomerBtn', function () {
        var $addCustomerModal = $("#addCustomerModal");
        //客户信息清空
        $addCustomerModal.find("[data-type='name']").val('');
        $addCustomerModal.find("[data-type='sex'][value='male']").prop('checked', true);
        $addCustomerModal.find("[data-type='sex'][value='female']").prop('checked', false);
        $addCustomerModal.find("[data-type='age']").val('');
        $addCustomerModal.find("[data-type='birthday']").val('');
        $addCustomerModal.find("[data-type='hobbyDiv']").empty();
        $addCustomerModal.find("[data-type='phone']").val('');
        $('#addCustomerAddressSearch').val('');
        $addCustomerModal.find("[data-type='basicAddress']").val('').attr('data-lng', '').attr('data-lat', '');
        $addCustomerModal.find("[data-type='detailedAddress']").val('');
        $addCustomerModal.find("[data-type='customer-remark']").val('');
        $addCustomerModal.modal('show');
    });
    //新增客户模态框保存按钮单击事件
    $(D).off('click', '#saveCustomerBtn').on('click', '#saveCustomerBtn', function () {
        var $addCustomerModal = $("#addCustomerModal");
        var name = $addCustomerModal.find("[data-type='name']").val();
        var sex = $addCustomerModal.find("[data-type='sex']:checked").val();
        var age = $addCustomerModal.find("[data-type='age']").val();
        var birthday = $addCustomerModal.find("[data-type='birthday']").val();
        var phone = $addCustomerModal.find("[data-type='phone']").val();
        var basicAddress = $addCustomerModal.find("[data-type='basicAddress']").val();
        var detailedAddress = $addCustomerModal.find("[data-type='detailedAddress']").val();
        var lng = $addCustomerModal.find("[data-type='basicAddress']").attr('data-lng');
        var lat = $addCustomerModal.find("[data-type='basicAddress']").attr('data-lat');
        var customerRemark = $addCustomerModal.find("[data-type='customer-remark']").val();

        //组成爱好list
        var customerHobbyDtoList;
        var $oneHobbyDivList = $addCustomerModal.find('[data-type="oneHobbyDiv"]');
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
        commonFn.ajaxPost(commonFn.baseUrl + "customer/save.json",
            new CustomerDto(null, name, sex, birthday, age, customerHobbyDtoList, phone, address, customerRemark),
            function (result) {
                commonFn.mLoading.hide();
                if (result.success) {
                    $addCustomerModal.modal("hide");
                    customerPageTable.reload();
                } else {
                    commonFn.messaage('error', result.msg);
                }
            });
    });
    //编辑客户模态框保存按钮单击事件
    $(D).off("click", "#editCustomerBtn").on("click", "#editCustomerBtn", function () {
        var $editCustomerModal = $("#editCustomerModal");
        var customerId = $editCustomerModal.find("[data-type='customerId']").val();
        //客户信息
        var name = $editCustomerModal.find("[data-type='name']").val();
        var sex = $editCustomerModal.find("[data-type='sex']:checked").val();
        var age = $editCustomerModal.find("[data-type='age']").val();
        var birthday = $editCustomerModal.find("[data-type='birthday']").val();
        var phone = $editCustomerModal.find("[data-type='phone']").val();
        var address = $editCustomerModal.find("[data-type='address']").val();
        var customerRemark = $editCustomerModal.find("[data-type='customer-remark']").val();

        //组成爱好list
        var customerHobbyDtoList;
        var $oneHobbyDivList = $editCustomerModal.find('[data-type="oneHobbyDiv"]');
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
        commonFn.ajaxPost(commonFn.baseUrl + "customer/edit.json",
            new CustomerDto(customerId, name, sex, birthday, age, customerHobbyDtoList, phone, address, customerRemark),
            function (result) {
                commonFn.mLoading.hide();
                if (result.success) {
                    $editCustomerModal.modal("hide");
                    customerPageTable.refresh();
                } else {
                    commonFn.messaage('error', result.msg);
                }
            });
    });

    //引入输入提示插件
    AMap.plugin('AMap.Autocomplete', function () {
        // 实例化Autocomplete
        var autoOptions = {
            // input 为绑定输入提示功能的input的DOM ID
            input: 'addCustomerAddressSearch'
        };
        var autoComplete = new AMap.Autocomplete(autoOptions);

        autoComplete.on("select", function (e) {
            var poi = e.poi;
            //获取完整地址
            var address = poi.district + poi.address + poi.name;
            //获取经纬度
            var location = poi.location;
            if (!location) {
                commonFn.messaage('error', "请更换地点,该点没有经纬度数据!");
                return;
            }
            var lng = poi.location.lng;
            var lat = poi.location.lat;
            $('#addCustomerModal [data-type="basicAddress"]').val(address).attr('data-lng', lng).attr('data-lat', lat);
            $('#addCustomerModal [data-type="detailedAddress"]').val(address);
        });
    });
    AMap.plugin('AMap.Autocomplete', function () {
        // 实例化Autocomplete
        var autoOptions = {
            // input 为绑定输入提示功能的input的DOM ID
            input: 'editCustomerAddressSearch'
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
            $('#editCustomerModal [data-type="basicAddress"]').val(address).attr('data-lng', lng).attr('data-lat', lat);
            $('#editCustomerModal [data-type="detailedAddress"]').val(address);
        });
    });

    //基础地址重置按钮单击事件
    $(D).off('click', '#addCustomerModal [data-type="basicAddressResetBtn"],#editCustomerModal [data-type="basicAddressResetBtn"]')
        .on('click', '#addCustomerModal [data-type="basicAddressResetBtn"],#editCustomerModal [data-type="basicAddressResetBtn"]',
            function () {
                $(this).closest('tr').find('[data-type="basicAddress"]').val('').attr('data-lng', '').attr('data-lat', '');
            });

    //编辑客户按钮单击事件
    $(D).off('click', '#customerTable [data-type="editBtn"]').on('click', '#customerTable [data-type="editBtn"]', function () {
        var customerId = $(this).attr('data-customerId');
        //从数据库查询客户信息
        commonFn.mLoading.show();
        $.get(commonFn.baseUrl + "customer/get.json?customerId=" + customerId, function (result) {
            commonFn.mLoading.hide();
            if (result.success) {
                var customerVo = result.data;
                var $editCustomerModal = $("#editCustomerModal");
                //先清空编辑mark模态框的所有信息
                $editCustomerModal.find("[data-type='name']").val('');
                $editCustomerModal.find("[data-type='sex'][value='male']").prop('checked', true);
                $editCustomerModal.find("[data-type='sex'][value='female']").prop('checked', false);
                $editCustomerModal.find("[data-type='age']").val('');
                $editCustomerModal.find("[data-type='birthday']").val('');
                $editCustomerModal.find("[data-type='hobbyDiv']").empty();
                $editCustomerModal.find("[data-type='phone']").val('');
                $editCustomerModal.find("[data-type='address']").val('');
                $editCustomerModal.find("[data-type='customer-remark']").val('');

                $editCustomerModal.find("[data-type='customerId']").val(customerVo.id);
                $editCustomerModal.find("[data-type='name']").val(customerVo.name);
                $editCustomerModal.find("[data-type='sex']:checked").prop('checked', false);
                $editCustomerModal.find("[data-type='sex'][value='" + customerVo.sex + "']").prop('checked', true);
                $editCustomerModal.find("[data-type='age']").val(customerVo.age);
                $editCustomerModal.find("[data-type='birthday']").val(customerVo.birthday ? commonFn.dateFormat(customerVo.birthday, 'yyyy-MM-dd') : '');

                //处理爱好回显
                var customerHobbyVoList = customerVo.customerHobbyVoList;
                if (customerHobbyVoList && customerHobbyVoList.length > 0) {
                    for (var i = 0; i < customerHobbyVoList.length; i++) {
                        //生成列表
                        generateHobbyDiv($editCustomerModal);
                    }
                    var $oneHobbyDivList = $editCustomerModal.find('[data-type="oneHobbyDiv"]');
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

                $editCustomerModal.find("[data-type='phone']").val(customerVo.phone);
                $editCustomerModal.find("[data-type='address']").val(customerVo.address);
                $editCustomerModal.find("[data-type='customer-remark']").val(customerVo.remark);
                $editCustomerModal.modal("show");
            } else {
                commonFn.messaage('error', result.msg);
            }
        });

    });
    //编辑客户Note按钮单击事件
    $(D).off('click', '#customerTable [data-type="editNoteBtn"]').on('click', '#customerTable [data-type="editNoteBtn"]', function () {
        var customerId = $(this).attr('data-customerId');

    });
    //删除客户按钮单击事件
    $(D).off('click', '#customerTable [data-type="deleteBtn"]').on('click', '#customerTable [data-type="deleteBtn"]', function () {
        var flag = confirm('是否确定删除此客户?删除后无法恢复!');
        if (!flag) {
            return;
        }
        var customerId = $(this).attr('data-customerId');
        commonFn.mLoading.show();
        commonFn.ajaxPost(commonFn.baseUrl + 'customer/delete.json', customerId, function (result) {
            commonFn.mLoading.hide();
            if (result.success) {
                customerPageTable.refresh();
            } else {
                commonFn.messaage('error', result.msg);
            }
        });
    });

    //添加爱好按钮单击事件
    $(D).off("click", "#addCustomerModal [data-type='addHobbyBtn'],#editCustomerModal [data-type='addHobbyBtn']")
        .on("click", "#addCustomerModal [data-type='addHobbyBtn'],#editCustomerModal [data-type='addHobbyBtn']", function () {
            generateHobbyDiv($(this));
        });
    //子爱好改变事件
    $(D).off('change', '#addCustomerModal [data-type="childHobby"],#editCustomerModal [data-type="childHobby"]')
        .on('change', '#addCustomerModal [data-type="childHobby"],#editCustomerModal [data-type="childHobby"]', function () {
            if ($(this).val().indexOf('other') >= 0) {
                $(this).closest('[data-type="oneHobbyDiv"]').find('[data-type="customHobby"]').val('').removeClass('hidden');
            } else {
                $(this).closest('[data-type="oneHobbyDiv"]').find('[data-type="customHobby"]').addClass('hidden');
            }
        });
    //父爱好改变事件
    $(D).off('change', '#addCustomerModal [data-type="parentHobby"],#editCustomerModal [data-type="parentHobby"]')
        .on('change', '#addCustomerModal [data-type="parentHobby"],#editCustomerModal [data-type="parentHobby"]', function () {
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
    $(D).off('click', '#addCustomerModal [data-type="removeHobbyBtn"],#editCustomerModal [data-type="removeHobbyBtn"]')
        .on('click', '#addCustomerModal [data-type="removeHobbyBtn"],#editCustomerModal [data-type="removeHobbyBtn"]', function () {
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

    //生日输入框值改变事件(计算年龄回显)
    $(D).off("input propertychange", "#addCustomerModal [data-type='birthday'],#editCustomerModal [data-type='birthday']")
        .on("input propertychange", "#addCustomerModal [data-type='birthday'],#editCustomerModal [data-type='birthday']", function () {
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

})(jQuery, window, document);