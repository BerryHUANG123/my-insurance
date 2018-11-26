var commonFn = (function ($, D, W) {
    //向頁面添加提示節點
    $('body').append('<div id="message_tips" class="border-radius-5px hidden" style="position:fixed;top: 20px;right: 10px;z-index: auto;"></div>');


    return {
        baseUrl: (function () {
            var host = W.location.host;
            return "http://" + host + "/";
        })(),
        mLoading: (function () {
            return {
                show: function () {
                    $("body").mLoading("show");//显示loading组件
                },
                hide: function () {
                    $("body").mLoading("hide");//显示loading组件
                }
            };
        })(),
        /**
         *
         * @param type      info，success， warning 或 error
         * @param message   消息提示的模板。可以是一个字符串，或这是HTML代码。
         * @param onOpenCallback 消息提示打开时的回调函数。
         * @param onCloseCallback 消息提示关闭时的回调函数.
         */
        messaage: function (type, message, onOpenCallback, onCloseCallback) {
            spop({
                template: message,
                position: 'top-right',
                icon: true,
                style: type,
                autoclose: 2000,
                onOpen: onOpenCallback,
                onClose: onCloseCallback
            });
        },
        ajax: function (url, jsonObject, callback) {
            $.ajax({
                type: "post",
                url: url,
                data: JSON.stringify(jsonObject),
                dataType: "json",
                contentType: "application/json;charset=UTF-8",
                success: function (result) {
                    callback(result);
                }
            });
        },
        //JS日期系列：根据出生日期 得到周岁年龄
        //参数strBirthday已经是正确格式的2007-02-09这样的日期字符串
        //后续再增加相关的如日期判断等JS关于日期处理的相关方法
        /*根据出生日期算出年龄*/
        age: function (strBirthday) {
            console.log(strBirthday);
            var returnAge;

            var reg = /^[1-9]\d{3}-([0]?[1-9]|1[0-2])-([0]?[1-9]|[1-2][0-9]|3[0-1])$/;
            var regExp = new RegExp(reg);
            if (!regExp.test(strBirthday)) {
                return returnAge;
            }
            var strBirthdayArr = strBirthday.split("-");
            var birthYear = strBirthdayArr[0];
            var birthMonth = strBirthdayArr[1];
            var birthDay = strBirthdayArr[2];

            var d = new Date();
            var nowYear = d.getFullYear();
            var nowMonth = d.getMonth() + 1;
            var nowDay = d.getDate();

            if (nowYear == birthYear) {
                returnAge = 0;//同年 则为0岁
            }
            else {
                var ageDiff = nowYear - birthYear; //年之差
                if (ageDiff > 0) {
                    if (nowMonth == birthMonth) {
                        var dayDiff = nowDay - birthDay;//日之差
                        if (dayDiff < 0) {
                            returnAge = ageDiff - 1;
                        }
                        else {
                            returnAge = ageDiff;
                        }
                    }
                    else {
                        var monthDiff = nowMonth - birthMonth;//月之差
                        if (monthDiff < 0) {
                            returnAge = ageDiff - 1;
                        }
                        else {
                            returnAge = ageDiff;
                        }
                    }
                }
                else {
                    returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
                }
            }
            return returnAge;//返回周岁年龄
        },
        /**
         * 获取中文性别
         * @param sex
         * @returns {string}
         */
        sexFormat: function (sex) {
            switch (sex) {
                case 'male':
                    return '男';
                case 'female':
                    return '女';
                default:
                    return 'unknown';
            }
        },
        /**
         * 根据毫秒值返回指定格式的日期.
         * @param dateMsValue
         */
        dateFormat: function (dateMsValue, format) {
            if (!dateMsValue) {
                return null;
            }
            var date = new Date(dateMsValue);
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();
            var str;
            switch (format) {
                case 'yyyy-MM-dd':
                    str = year + '-' + month + '-' + day;
                    break;
                default:
                    str = year + '-' + month + '-' + day;
            }
            return str;
        }
    };

})(jQuery, document, window);
