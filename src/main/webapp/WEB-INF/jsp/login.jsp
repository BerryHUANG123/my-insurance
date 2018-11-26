<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="common/headJstl.jsp" %>
<!DOCTYPE html>
<title>登录</title>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <script type="text/javascript" src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <script type="text/javascript" src="<%=basePath%>/resources/frame/bootstrap/js/bootstrap.min.js"></script>
    <link rel="stylesheet" type="text/css" href="<%=basePath%>/resources/frame/bootstrap/css/bootstrap.min.css"/>
    <link rel="stylesheet" type="text/css"
          href="<%=basePath%>/resources/frame/bootstrap/css/bootstrap-responsive.min.css"/>
    <link rel="stylesheet" type="text/css" href="<%=basePath%>/resources/css/login.css"/>
</head>
<body class="login-background">
<div class="login-box">
    <p class="login-title">MY-INSURANCE</p>
    <form method="post" action="/login/doLogin.json">
        <table style="margin: auto;">
            <tr>
                <td>用户名：</td>
                <td><input class="form-control" type="text" name="userName" size="10"></td>
            </tr>
            <tr>
                <td>密码：</td>
                <td><input class="form-control" type="password" name="password" size="10"></td>
            </tr>
            <tr>
                <td colspan="2"><p style="color: red;">${warning}</p></td>
            </tr>
        </table>
        <p><input class="btn btn-primary" type="submit" value="确定">
            <input class="btn" type="reset" value="取消"></p>
    </form>
</div>
</body>
</html>