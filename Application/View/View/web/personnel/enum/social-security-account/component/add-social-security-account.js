define([
    'text!enum/social-security-account/component/add-social-security-account.html',
    'enum/social-security-account/common/api',
    'jquery',

    'css!enum/social-security-account/component/add-social-security-account.css'
], function(
    tpl,
    Api,
    $
){
    return {
        template: tpl,
        data: function(){
            return {
                whichBtn: '',
                isShow: false,
                editWhich: '',
                payAccountInfo: {//社保缴纳账户信息
                    id: '',
                    name: '',
                },
                tableData: [],//社保缴纳账户列表
            }
        },
        methods: {
            payAccountList: function () {
                var that = this;
                Api.getPayAccountList.ajax()
                    .done(function(data){
                        that.tableData = data;
                        that.$parent.tableData = data;
                        if(data[0]){
                            var lens = data.length;
                            that.$parent.payAccountName = data;
                            for(var i=0;i<lens;i++){
                                that.$parent.payAccountName[i].text = that.$parent.payAccountName[i].name;
                                that.$parent.payAccountName[i].value = that.$parent.payAccountName[i].name;
                            }
                        }
                    });
            },
            checkBtn: function (index) {
                var that = this;
                if(index==1){
                    if(that.editWhich!=''){
                        Api.updatePayAccountApi.ajax(that.payAccountInfo)
                            .done(function(data){
                                that.tableData = data;
                                that.payAccountList();
                                that.payAccountInfo = {
                                    id: '',
                                    name: '',
                                };
                                that.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                            });
                    }else {
                        Api.addPayAccountApi.ajax(that.payAccountInfo)
                            .done(function(data){
                                that.tableData = data;
                                that.payAccountList();
                                that.payAccountInfo = {
                                    id: '',
                                    name: '',
                                };
                                that.$message({
                                    message: '添加成功',
                                    type: 'success'
                                });
                            });
                    }
                }else {
                    that.payAccountInfo = {
                        id: '',
                        name: '',
                    };
                }
                that.isShow = false;
                that.whichBtn = '';
                that.editWhich = '';
            },
        },
        watch: {
            editWhich: function () {
                var that = this;
                if(!that.isShow&&that.editWhich!=''){
                    that.isShow = true;
                    var len = that.tableData.length;
                    for(var i=0;i<len;i++){
                        if(that.tableData[i].id==that.editWhich){
                            that.payAccountInfo = that.tableData[i];
                        }
                    }
                }
            }
        },
        mounted: function(){
            this.payAccountList();
        }
    };
});