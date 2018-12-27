define([
    'jquery',
    'lodash',
    'WebCommon/toast/toast'
], function(
    $,
    _,
    Toast
){
    // var BaseUrl = 'http://fnji.test.com';
    var BaseUrl = 'http://oa.fnji.com/Manage';
    var ErrorEnum = {
        DataError: {
            code: 'DATA_ERROR',
            data: '数据异常'
        },
        NetworkError: {
            code: 'NETWORK_ERROR',
            data: '网络异常'
        },
        ParamError: {
            code: 'PARAM_ERROR',
            data: '参数错误'
        }
    };
    function Api(path, defaultOptions){
        this.url = BaseUrl + path;
        this.defaultOptions = defaultOptions || {};
    }
    Api.prototype.ajaxPromise = function(params, options){
        var dfd = $.Deferred();
        var opts = {
            url: this.url,
            dataType: 'json'
        };
        if (params) opts.data = params;
        opts = _.assign(opts, this.defaultOptions, options);

        $.ajax(opts)
            .done(function(result){
                if (!result){
                    dfd.reject(ErrorEnum.DataError);
                } else if (result.error === 0) {
                    dfd.resolve(result.result);
                } else {
                    dfd.reject(result);
                }
            })
            .fail(function(){
                dfd.reject(ErrorEnum.NetworkError);
            });

        return dfd.promise();
    };
    Api.prototype.ajax = function(params, options){
        Toast.showLoadingToast();
        return this.ajaxPromise(params, options)
            .fail(function(error){
                console.log(error);
                alert(error.data);
            })
            .always(function(){
                Toast.hideLoadingToast();
            });
    };

    return {
        Api: Api,
        // getMemberInfoApi: new Api('/s/member/getMemberInfo'),
        // loginApi: new Api('/s/member/login', {type: 'POST'}),
        // getWxLoginInfoApi: new Api('/s/member/getWxLoginInfo'),
        // logoutApi: new Api('/s/member/logOut'),
        // sendVerifyCodeApi: new Api('/s/member/sendVerifyCode'),
        // registerApi: new Api('/s/member/reg', {type: 'POST'}),
        // resetPassApi: new Api('/s/member/forgot',{type: 'POST'}),
        //
        // addAddressApi: new Api('/s/member-address/add', {type: 'POST'}),
        // modAddressApi: new Api('/s/member-address/mod', {type: 'POST'}),
        // getProvinceApi: new Api('/s/common/getProvince'),
        // getCityApi: new Api('/s/common/getCity')

        getTeamworkList: new Api('/Teamwork/teamwork', {type: 'POST'}),//获取团队协作列表
        addTeamworkList: new Api('/Teamwork/add', {type: 'POST'}),//添加团队协作
        getOperatorList: new Api('/Teamwork/operatorName', {type: 'POST'}),//获取操作人员列表
        getTeamworkInfo: new Api('/Teamwork/check', {type: 'GET'}),//获取一条数据
        updateTeamworkInfo: new Api('/Teamwork/update', {type: 'GET'}),//修改一条数据
        deleteTeamworkInfo: new Api('/Teamwork/delete', {type: 'GET'}),//删除数据
        getTeamworkStatus: new Api('/Teamwork/status'),//获取状态列表
    };
});
