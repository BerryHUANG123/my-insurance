<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<link rel="stylesheet" type="text/css" href="<%=basePath%>/resources/css/common/oldTopNav.css"/>
<div id="topNav">
    <div id="topNavMenuDiv">
        <div class="pull-left" id="topNavTitleDiv">MY-INSURANCE</div>
        <div class="pull-left" id="navSeparateDiv">||</div>
        <ul class="pull-left" id="topNavUl">
            <li data-name="map"><a href="<%=basePath%>/index/page.htm">标注管理</a></li>
            <li data-name="customer"><a href="<%=basePath%>/customer/page.htm">客户管理</a></li>
        </ul>
        <div class="clear-float"></div>
    </div>
    <div id="navSwitchBtnDiv">
        <span id="navSwitchBtn">▲</span>
    </div>
</div>
<script>
    (function ($, D, W) {
        //根据当前页面模块名,修改导航li样式.
        var parentModuleName = $("#moduleInfo").attr("data-parentName");
        switch (parentModuleName) {
            case "map":
                $('#topNavUl li[data-name="map"]').addClass("top-nav-li-selected");
                break;
            case "customer":
                $('#topNavUl li[data-name="customer"]').addClass("top-nav-li-selected");
                break;
            default:
        }

        //导航栏li单击事件
        $(D).off('click', '#topNavUl li').on('click', '#topNavUl li', function () {
            //样式切换
            $(this).closest("ul").find("li").removeClass("top-nav-li-selected");
            $(this).addClass("top-nav-li-selected");
        });

        //导航栏伸缩按钮单击事件
        $(D).off('click', '#navSwitchBtn').on('click', '#navSwitchBtn', function () {
            var flag = $("#topNavMenuDiv").hasClass("hidden");
            if (!flag) {
                $("#topNavMenuDiv").addClass("hidden");
                $(this).html("▼");
            } else {
                $("#topNavMenuDiv").removeClass("hidden");
                $(this).html("▲");
            }
        });
    })(jQuery, document, window);
</script>
