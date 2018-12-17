<%--<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="/smFunction" prefix="master"%>--%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getHeader("HOST") + path;
    String title = "MY-INSURANCE";

//项目js 根据模块定
    String comJsVer = "1.0";
    String indexJsVer = "1.1";
    String customerJsVer = "1.0";
//项目css (css/*.css)
    String comCssVer = "1.1";
    String indexCssVer = "1.1";
    String customerCssVer = "1.0";
//自写组件用(js/plugin/picZoom/picZoom.js)
    String componentsVer = "1.0";
//框架、插件类 (js/plugin/*  js/com/jq.js   js/com/format.js)
    String pluginVer = "1.0";
//插件edit文件(ckeditor/edit.css;  ckeditor/edit.js;  imgUploadComm.js)
    String pluginEditVer = "1.0";
%>
<!DOCTYPE html>