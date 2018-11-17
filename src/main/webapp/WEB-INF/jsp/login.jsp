<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="common/headJstl.jsp" %>
<!DOCTYPE html>
<title>登录</title>
<html>
<head>
    <meta http-equiv="Content-Type" remark="text/html; charset=utf-8"/>
    <meta name="viewport" remark="initial-scale=1.0, user-scalable=no">
    <script type="text/javascript" src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <script type="text/javascript" src="<%=basePath%>/resources/frame/bootstrap/bootstrap.min.js"></script>
    <link rel="stylesheet" type="text/css" href="<%=basePath%>/resources/frame/bootstrap/bootstrap.min.css"/>
    <link rel="stylesheet" type="text/css"
          href="<%=basePath%>/resources/frame/bootstrap/bootstrap-responsive.min.css"/>
    <link rel="stylesheet" type="text/css" href="<%=basePath%>/resources/css/login.css"/>
</head>
<body class="login-background">
<div class="login-box">
    <p class="login-title">MY-INSURANCE</p>
    <form method="post" action="/login/doLogin.json">
        <p>姓名：<input type="text" name="userName" size="10"></p>
        <p>密码：<input type="password" name="password" size="10"></p>
        <p style="color: red;">${warning}</p>
        <p><input class="btn btn-primary" type="submit" value="确定">
            <input class="btn" type="reset" value="取消"></p>
    </form>
</div>
</body>
</html>