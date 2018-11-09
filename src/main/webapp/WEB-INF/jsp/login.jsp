<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <title>注册页</title>
</head>
<body>
<form method="post" action="/login/doLogin.htm">
    <span>${warning}</span>
    <p>姓名：<input type="text" name="userName" size="10"></p>
    <p>密码：<input type="password" name="password" size="10"></p>
    <p><input type="submit" value="确定">
        <input type="reset" value="取消"></p>
</form>
</body>
</html>