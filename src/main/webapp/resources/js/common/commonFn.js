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
        ajaxPost: function (url, jsonObject, callback) {
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
        ajaxGet: function (url, jsonObject, callback) {
            $.ajax({
                type: "get",
                url: url,
                data: jsonObject,
                dataType: "json",
                /* contentType: "application/json;charset=UTF-8",*/
                success: function (result) {
                    callback(result);
                }
            });
        },

        PageTable: function ($pageTable, url, pageDto, viewCallBack, async) {
            this.config = {
                pageTable: $pageTable,
                url: url,
                pageDto: pageDto,
                viewCallBack: viewCallBack,
                async: async
            };

            //重新加载
            this.reload = function () {
                show(this.config.pageTable, this.config.url, this.config.pageDto, this.config.viewCallBack, this.config.async);
            };

            //刷新(保持当前页码)
            this.refresh = function () {
                var pageNum = this.config.pageTable.find('.page-index li.active').attr('data-pageNum');
                var pageDto = this.config.pageDto;
                var newPageDto = {};
                for (let key in pageDto) {
                    newPageDto[key] = pageDto[key];
                }
                newPageDto.pageNum = pageNum;
                show(this.config.pageTable, this.config.url, newPageDto, this.config.viewCallBack, this.config.async);
            };

            var show = function ($pageTable, url, pageDto, viewCallBack, async) {
                $.ajax({
                    type: "get",
                    url: url,
                    data: pageDto,
                    dataType: "json",
                    async: !!async,
                    success: function (result) {
                        if (result.success) {
                            console.log(result.data);
                            var pageVo = result.data;
                            var rows = pageVo.rows;
                            if (rows && rows.length > 0) {
                                //渲染数据
                                //先处理index
                                var $paginationUl = $pageTable.find('ul.pagination');
                                $paginationUl.empty();
                                var pageNum = pageVo.pageNum;
                                var totalSize = pageVo.totalSize;
                                var pageSize = pageVo.pageSize;
                                var totalPage = Math.ceil(totalSize / pageSize);
                                var $previousPageNumLi = $('<li ' + (pageNum == 1 ? " class=\"disabled\" " : " data-pageNum=\"" + (pageNum - 1) + "\" ") + '>' +
                                    '<a href="javascript:;" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>');
                                if (pageNum != 1) {
                                    (function () {
                                        $previousPageNumLi.off('click').on('click', function () {
                                            //拷贝一份pageDto
                                            var newPageDto = {};
                                            for (let key in pageDto) {
                                                newPageDto[key] = pageDto[key];
                                            }
                                            newPageDto.pageNum = pageNum - 1;
                                            show($pageTable, url, newPageDto, viewCallBack, false);
                                        });
                                    })();
                                }
                                $paginationUl.append($previousPageNumLi);
                                //   var pageStart = pageNum < 9 ? 1 : totalPage - pageNum > 4 ? pageNum - 4 : pageNum - 7;
                                var pageStart = pageNum % 10 == 0 ? pageNum - 9 : Math.floor(pageNum / 10) * 10 + 1;
                                // var pageEnd = (pageStart + 8) > totalPage ? totalPage : (pageStart + 8);
                                var pageEnd = (pageStart + 9) > totalPage ? totalPage : (pageStart + 9);
                                for (var i = pageStart; i <= pageEnd; i++) {
                                    var $pageNumLi = $('<li ' + (pageNum == i ? "class=\"active\"" : "") + ' data-pageNum="' + (i) + '"><a href="javascript:;">' + (i < 10 ? '0' + i : i) + '</a></li>');
                                    if (pageNum != i) {
                                        (function (index) {
                                            $pageNumLi.off('click').on('click', function () {
                                                var newPageDto = {};
                                                for (let key in pageDto) {
                                                    newPageDto[key] = pageDto[key];
                                                }
                                                newPageDto.pageNum = index;
                                                show($pageTable, url, newPageDto, viewCallBack, false);
                                            });
                                        })(i);
                                    }
                                    $paginationUl.append($pageNumLi);
                                }
                                var $nextPageNumLi = $('<li ' + (pageNum == totalPage ? " class=\"disabled\" " : " data-pageNum=\"" + (pageNum + 1) + "\" ") + '>' +
                                    '<a href="javascript:;" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>');
                                if (pageNum != totalPage) {
                                    (function () {
                                        $nextPageNumLi.off('click').on('click', function () {
                                            var newPageDto = {};
                                            for (let key in pageDto) {
                                                newPageDto[key] = pageDto[key];
                                            }
                                            newPageDto.pageNum = pageNum + 1;
                                            show($pageTable, url, newPageDto, viewCallBack, false);
                                        });
                                    })();
                                }
                                $paginationUl.append($nextPageNumLi);

                                //再处理当前页数据回显到table中
                                viewCallBack(rows);

                                $pageTable.find('div.noData').addClass('hidden');
                                $pageTable.find('div.hasData').removeClass('hidden');
                            } else {
                                $pageTable.find('div.noData').removeClass('hidden');
                                $pageTable.find('div.hasData').addClass('hidden');
                            }
                        } else {
                            alert('出错了!' + result.msg);
                        }
                    }
                });
            }


            //筛选区域按钮绑定change事件
            var $this = this;
            $pageTable.find('select[data-type="orderField"]').off('change').on('change', function () {
                var orderField = $(this).val();
                $this.config.pageDto.orderField = orderField;
                $this.reload();
            });

            $pageTable.find('select[data-type="desc"]').off('change').on('change', function () {
                var desc = $(this).val();
                $this.config.pageDto.desc = desc;
                $this.reload();
            });

            $pageTable.find('button[data-type="searchBtn"]').off('click').on('click', function () {
                var searchContent = $pageTable.find('input[data-type="searchContent"]').val();
                if(searchContent){
                    $this.config.pageDto.searchContent = searchContent;
                    $this.reload();
                }
            });

            $pageTable.find('button[data-type="searchEmptyBtn"]').off('click').on('click', function () {
                $pageTable.find('input[data-type="searchContent"]').val('');
                $this.config.pageDto.searchContent = null;
                $this.reload();
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
                case 'yyyy-MM-dd HH:mm:ss':
                    str = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + (parseInt(seconds) < 10 ? '0' + seconds : seconds);
                    break;
                default:
                    str = year + '-' + month + '-' + day;
            }
            return str;
        }
    };

})(jQuery, document, window);
