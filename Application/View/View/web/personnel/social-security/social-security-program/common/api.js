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
        console.log(this.defaultOptions)
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

        getHouseholdApi: new Api('/BasicInformation/cityLink', {type: 'POST'}),//户口类别列表

        getSocialSecurityPlanList: new Api('/BasicInformation/socialSecurityPlan', {type: 'POST'}),//获取社保方案列表
        addSocialSecurityPlanApi: new Api('/BasicInformation/addSocialSecurityPlan', {type: 'POST'}),//添加社保方案
        updateSocialSecurityPlanApi: new Api('/BasicInformation/updateSocialSecurityPlan', {type: 'POST'}),//修改社保方案
        deleteSocialSecurityPlanApi: new Api('/BasicInformation/deleteSocialSecurityPlan', {type: 'POST'}),//删除社保方案

        cityIsExistApi: new Api('/BasicInformation/cityIsExist', {type: 'POST'}),//城市、户口性质、时间判断
        getHouseholdTypeList: new Api('/BasicInformation/householdType', {type: 'POST'}),//获取户口性质列表
    };
});
