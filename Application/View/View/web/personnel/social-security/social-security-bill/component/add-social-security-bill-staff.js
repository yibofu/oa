define([
    'text!social-security/social-security-bill/component/add-social-security-bill-staff.html',
    'social-security/social-security-bill/common/api',
    'jquery',

    'css!social-security/social-security-bill/component/add-social-security-bill-staff.css'
], function(
    tpl,
    Api,
    $
){
    return {
        template: tpl,
        data: function(){
            return {
                isShow: false,//是否显示添加框
                isCheck: false,//是否显示保存按钮
                staffInfo: {//户口性质信息
                    id: '',//员工ID
                    name: '',//员工姓名
                    department_name: '',//员工所属部门
                    payLand: '',//社保缴纳地
                    householdType: '',//户口性质
                    payBase: '',//社保基数
                    foudBase: '',//公积金基数
                    socialStarting: '',//社保起始月
                    fundStarting: '',//公积金起始月
                },
                tableData: [],//户口性质列表
            }
        },
        methods: {
            checkBtn: function (index) {
                var that = this;
                if(index==1){
                    Api.updateHouseholdTypeApi.ajax(that.householdTypeInfo)
                        .done(function(data){
                            that.tableData = data;
                            that.householdTypeList();
                            that.province = '';
                            that.city = '';
                            that.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                            that.isShow = false;
                            that.whichBtn = '';
                            that.whichOne = '';
                        });
                }else {
                    that.isShow = false;
                }
            },
        },
        watch: {
            'staffInfo.name': function () {
                var that = this;
                if(that.staffInfo.name){

                }
            }
        },
        mounted: function(){
        }
    };
});