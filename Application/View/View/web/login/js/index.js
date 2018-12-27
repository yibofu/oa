$(function () {
    // getCookie();
    function setCookie(uname, password) {
        if ($(".rem").get(0).checked) {
            // do something
            $.cookie("input1",uname,{expires:999});
            $.cookie("input2",$.base64.encode(password),{expires:999});
        }else {
            $.cookie("input1","");
            $.cookie("input2","");
        }
    };
    $(document).ready(function () {
        if ($.cookie('input1')){
            $(".input1").val($.cookie('input1'));
            if($.cookie('input2')){
                $(".input2").val($.base64.decode($.cookie('input2')));
/*              $("[name='checkbox']").attr("checked",true);*/
                $(".rem").attr("checked",true);
            }else {
                $.cookie("password",null);
            }
        }
    });
    $("body").keydown(function() {
        if (event.keyCode == "13") {//keyCode=13是回车键
            $(".sub").click();
        }
    });
/*    function getCookie() {
        var uaname =$.cookie("uname");
        var password = $.cookie("password");
        if (password){
            $(".rem").attr("checked",true);
        }
        if (uaname){
            $(".input1").val(uaname);
        }
        if (password){
            $(".input2").val(password);
        }
    };*/
    $(".sub").click(function () {
        if ($(".input1").val().length===0){
            $(".form").find('div').removeClass("error");
            $(".cur1").addClass("error");
        }
        else {
            $(".form").find('div').removeClass("error");
            if ($(".input2").val().length===0){
                $(".form").find('div').removeClass("error");
                $(".cur2").addClass("error");
            }
            else {
                $(".form").find('div').removeClass("error");

                var uname = $(".input1").val();
                var password = $(".input2").val();
                $.ajax({
                    url:"http://oa.fnji.com/Manage/Login/login",
                    type:'post',
                    data: {account: uname,password:password},
                    success:function(rets){
                        if(rets.error==0){
                            setCookie(uname,password);
                            location.href = 'http://oa.fnji.com/View/Teamwork/index';
                        }else if (rets.error==1) {
                            $(".form").find('div').removeClass("error");
                            $(".cur3").addClass("error");
                        }else if (rets.error==2){
                            $(".form").find('div').removeClass("error");
                            $(".cur4").addClass("error");
                        }else if (rets.error==3){
                            $(".form").find('div').removeClass("error");
                            $(".cur5").addClass("error");
                        }else if (rets.error==4){
                            $(".form").find('div').removeClass("error");
                            $(".cur6").addClass("error");
                        }else  if (rets.error==5){
                            $(".form").find('div').removeClass("error");
                            $(".cur7").addClass("error");
                        }else{
                            $(".form div").removeClass("error");
                        }
                    },
                    fail: function () {
                    }
                });
            };
        };
    });
});




