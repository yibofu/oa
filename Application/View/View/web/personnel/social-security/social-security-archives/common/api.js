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

        getHouseholdTypeList: new Api('/BasicInformation/householdType', {type: 'POST'}),//获取户口性质列表
        getPayAccountList: new Api('/BasicInformation/payAccount', {type: 'POST'}),//社保缴纳账户列表

        getStatusSocialFilesList: new Api('/BasicInformation/clickStatusSocialFiles', {type: 'POST'}),//获取员工社保档案列表
        checkSocialFilesApi: new Api('/BasicInformation/checkSocialFiles', {type: 'POST'}),//查看员工社保档案
        updateSocialFilesApi: new Api('/BasicInformation/updateSocialFiles', {type: 'POST'}),//修改员工社保档案

        getDepartmentList: new Api('/OrganizationalStructure/all', {type: 'POST'}),//获取部门列表
        getAllDepartmentList: new Api('/OrganizationalStructure/index', {type: 'POST'}),//获取部门树
        getHouseholdApi: new Api('/BasicInformation/cityLink', {type: 'POST'}),//户口类别列表
        //社保档案搜索条件：
        // 社保起始月：socialStarTime        socialEndTime
        //公积金起始月：fundStarTime        fundEndTime
        //工号：unumber  姓名：name  部门：department_id
        //社保缴纳地：payLand  户口性质：householdType
        //公积金基数：foudBase    社保基数：payBase
        //证件号：cardNumber
        searchSocialFilesApi: new Api('/BasicInformation/socialFiles', {type: 'POST'}),//按条件搜索社保档案
    };
});
