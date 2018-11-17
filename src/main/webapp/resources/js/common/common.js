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
        }
    };

})(jQuery, document, window);
