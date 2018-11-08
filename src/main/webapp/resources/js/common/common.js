var commonFn = (function ($, D, W) {

    return {
        baseUrl: (function () {
            var host = W.location.href;
            return host;
        })(),
        mLoading: (function(){
            return {
               show:function(){
                   $("body").mLoading("show");//显示loading组件
               },
                hide:function(){
                    $("body").mLoading("hide");//显示loading组件
                }
            };
        })()
    };

})(jQuery, document, window);
