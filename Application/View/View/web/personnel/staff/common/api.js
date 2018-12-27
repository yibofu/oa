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

        getDepartmentList: new Api('/OrganizationalStructure/all', {type: 'POST'}),//获取部门列表
        getAllDepartmentList: new Api('/OrganizationalStructure/index', {type: 'POST'}),//获取部门树
        checkDepartmentApi: new Api('/OrganizationalStructure/check', {type: 'POST'}),//查看部门信息

        uploadPhotoApi: new Api('/BasicInformation/uploadPhoto', {type: 'POST', processData: false,
            contentType: false}),//上传照片
        getCategoryApi: new Api('/BasicInformation/category', {type: 'POST'}),//人员类别
        getEducationApi: new Api('/BasicInformation/education', {type: 'POST'}),//学历列表
        getCardApi: new Api('/BasicInformation/card', {type: 'POST'}),//证件列表
        getRankApi: new Api('/BasicInformation/rank', {type: 'POST'}),//职级列表
        getPositionApi: new Api('/BasicInformation/position', {type: 'POST'}),//职位列表
        getSourceApi: new Api('/BasicInformation/source', {type: 'POST'}),//招聘平台列表
        getCompanyApi: new Api('/BasicInformation/company', {type: 'POST'}),//合同公司列表
        getLeaveApi: new Api('/BasicInformation/leave', {type: 'POST'}),//离职类别列表
        getHouseholdApi: new Api('/BasicInformation/cityLink', {type: 'POST'}),//户口类别列表
        getPayAccountList: new Api('/BasicInformation/payAccount', {type: 'POST'}),//社保缴纳账户列表

        checkInfoApi: new Api('/BasicInformation/check', {type: 'POST'}),//查看员工信息

        uploadResumeApi: new Api('/BasicInformation/uploadResume', {type: 'POST'}),//上传简历

        personneStatusInformationApi: new Api('/BasicInformation/personneStatusInformation', {type: 'POST'}),//员工列表 0-试用，1-正式，2-离职

        addBasicApi: new Api('/BasicInformation/addBasic', {type: 'POST'}),//添加基础信息
        addPersonnelApi: new Api('/BasicInformation/addPersonnel', {type: 'POST'}),//添加人事信息
        addSocialSecurityInformationApi: new Api('/BasicInformation/addSocialSecurityInformation', {type: 'POST'}),//添加社保信息(可填写)
        addSocialSecurityInformationTwoApi: new Api('/BasicInformation/addSocialSecurityInformationTwo', {type: 'POST'}),//添加社保信息(不可填写)
        addBankInformationApi: new Api('/BasicInformation/addBankInformation', {type: 'POST'}),//添加银行信息
        addAttendanceInformationApi: new Api('/BasicInformation/addAttendanceInformation', {type: 'POST'}),//添加考勤信息

        updateBasicApi: new Api('/BasicInformation/updateBasic', {type: 'POST'}),//修改基础信息
        updatePersonnelApi: new Api('/BasicInformation/updatePersonnel', {type: 'POST'}),//修改人事信息
        updateSocialSecurityInformationApi: new Api('/BasicInformation/updateSocialSecurityInformationTwo', {type: 'POST'}),//修改社保信息
        updateBankInformationApi: new Api('/BasicInformation/updateBankInformation', {type: 'POST'}),//修改银行信息
        updateAttendanceInformationApi: new Api('/BasicInformation/updateAttendanceInformation', {type: 'POST'}),//修改考勤信息

        socialSecurityInformationApi: new Api('/BasicInformation/socialSecurityInformation', {type: 'POST'}),//显示社保信息
        addSocialSecurityInformationApi: new Api('/BasicInformation/addSocialSecurityInformation', {type: 'POST'}),//增加社保信息

        personnelStatusApi: new Api('/BasicInformation/personnelStatus', {type: 'POST'}),//员工相应状态数量

        deleteInformationApi: new Api('/BasicInformation/deleteInformation', {type: 'POST'}),//删除员工信息

        getUnumberDigitApi: new Api('/BasicInformation/addBasic', {type: 'POST'}),//获取工号规则
    };
});
