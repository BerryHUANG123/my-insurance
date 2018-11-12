<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ include file="/WEB-INF/jsp/common/headJstl.jsp" %>
<html>
<head>
    <base href="<%=basePath%>/">
    <title><%=title%>
    </title>
    <%@ include file="/WEB-INF/jsp/common/headCssJs.jsp" %>
    <style>
        html {
            height: 100%;
        }
        body {
            height: 100%;
            margin: 0px;
            padding: 0px;
        }
    </style>
</head>
<body>

<div id="offCanvasWrapper" class="mui-off-canvas-wrap mui-draggable">
    <!--侧滑菜单部分-->
    <aside id="offCanvasSide" class="mui-off-canvas-left">
        <div id="offCanvasSideScroll" class="mui-scroll-wrapper">
            <div class="mui-scroll">
                <div class="ft-color-white" style="margin-bottom: 25px;">侧滑列表示例</div>
                <ul class="mui-table-view mui-table-view-chevron mui-table-view-inverted">
                    <li class="mui-table-view-cell">
                        <a class="mui-navigate-right">
                            Item 1
                        </a>
                    </li>
                    <li class="mui-table-view-cell">
                        <a class="mui-navigate-right">
                            Item 2
                        </a>
                    </li>
                    <li class="mui-table-view-cell">
                        <a class="mui-navigate-right">
                            Item 3
                        </a>
                    </li>
                    <li class="mui-table-view-cell">
                        <a class="mui-navigate-right">
                            Item 4
                        </a>
                    </li>
                    <li class="mui-table-view-cell">
                        <a class="mui-navigate-right">
                            Item 5
                        </a>
                    </li>
                    <li class="mui-table-view-cell">
                        <a class="mui-navigate-right">
                            Item 6
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </aside>
    <!--主界面部分-->
    <div class="mui-inner-wrap">
        <header class="mui-bar mui-bar-nav">
            <a href="#offCanvasSide" class="mui-icon mui-action-menu mui-icon-bars mui-pull-left"></a>
            <%--<a class="mui-action-back mui-btn mui-btn-link mui-pull-right">关闭</a>--%>
            <h1 class="mui-title">
                <c:choose>
                    <c:when test="${viewName=='map'}">标记管理</c:when>
                    <c:when test="${viewName=='customer'}">客户管理</c:when>
                </c:choose>
            </h1>
        </header>
        <div class="padding-top-44px" id="page-content">
            <!-- 主界面具体展示内容 -->
            <c:choose>
                <c:when test="${viewName=='map'}">
                    <%@ include file="/WEB-INF/jsp/index.jsp" %>
                </c:when>
                <c:when test="${viewName=='customer'}">2</c:when>
            </c:choose>
        </div>
        <!-- off-canvas backdrop -->
        <div class="mui-off-canvas-backdrop"></div>
    </div>
</div>
<script type="text/javascript">
    (function ($, D, W) {
        //禁止手势侧滑
        D.getElementsByClassName('mui-inner-wrap')[0].addEventListener('drag', function (event) {
            event.stopPropagation();
        });
    })(jQuery, document, window);
</script>
</body>
</html>


