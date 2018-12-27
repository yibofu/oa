define([
    'text!enum/company/component/add-company.html',
    'enum/company/common/api',
    'jquery',

    'css!enum/company/component/add-company.css'
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
                companyInfo: {//公司信息
                    id: '',
                    name: '',
                },
                tableData: [],//公司列表
            }
        },
        methods: {
            companyList: function () {
                var that = this;
                Api.getCompanyList.ajax()
                    .done(function(data){
                        that.tableData = data;
                        that.$parent.tableData = data;
                        if(data[0]){
                            var lens = data.length;
                            that.$parent.companyName = data;
                            for(var i=0;i<lens;i++){
                                that.$parent.companyName[i].text = that.$parent.companyName[i].name;
                                that.$parent.companyName[i].value = that.$parent.companyName[i].name;
                            }
                        }
                    });
            },
            checkBtn: function (index) {
                var that = this;
                if(index==1){
                    if(that.editWhich!=''){
                        Api.updateCompanyApi.ajax(that.companyInfo)
                            .done(function(data){
                                that.tableData = data;
                                that.companyList();
                                that.companyInfo = {
                                    id: '',
                                    name: '',
                                };
                                that.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                            });
                    }else {
                        Api.addCompanyApi.ajax(that.companyInfo)
                            .done(function(data){
                                that.tableData = data;
                                that.companyList();
                                that.companyInfo = {
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
                    that.companyInfo = {
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
                            that.companyInfo = that.tableData[i];
                        }
                    }
                }
            }
        },
        mounted: function(){
            this.companyList();
        }
    };
});