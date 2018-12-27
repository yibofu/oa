define([
    'text!social-security/social-security-program/social-security-program.html',
    'social-security/social-security-program/common/api',
    'jquery',
    'social-security/social-security-program/component/add-social-security-program',
], function(
    tpl,
    Api,
    $,
    AddSocialSecurityProgram
){
    return {
        template: tpl,
        components: {
            AddSocialSecurityProgram: AddSocialSecurityProgram,
        },
        data: function(){
            return {
                tableData: [],
                multipleSelection: [],
                selections: [],
                did: {id: ''}, //所选户口性质ID
                cityName: [],
            }
        },
        methods: {
            householdTypeList: function () {
                var that = this;
                Api.getHouseholdTypeList.ajax()
                    .done(function(data){
                        if(data[0]){
                            that.cityName = data;
                            var lens = data.length;
                            for(var i=0;i<lens;i++){
                                that.cityName[i].text = that.cityName[i].city;
                                that.cityName[i].value = that.cityName[i].city;
                            }
                        }
                    });
            },
            filterHandler: function(value, row, column) {
                const property = column['property'];
                return row[property] === value;
            },
            socialSecurityPlansList: function () {
                var that = this;
                Api.getSocialSecurityPlanList.ajax()
                    .done(function(data){
                        that.tableData = data;
                    });
            },
            checkInfor: function (index) {
                var that = this;
                if(index==0){
                    that.$refs.infor.whichBtn = index;
                    that.$refs.infor.isShow = true;
                }else if(index==1){
                    that.selections = that.$refs.multipleTables.selection;
                    if(!that.selections[0]){
                        this.$message({
                            message: '请选择想要删除的社保方案',
                            type: 'warning'
                        });
                    }else {
                        var len = that.selections.length;
                        for(var i=0;i<len;i++){
                            var pid;
                            if(i==0){
                                that.did = {id: that.selections[i].id};
                            }else {
                                pid = that.did.id + ',' + that.selections[i].id;
                                that.did = {id: pid};
                            }
                        }
                        this.$confirm('是否确认删除?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(function(){
                            console.log(that.did);
                            Api.deleteSocialSecurityPlanApi.ajax(that.did)
                                .done(function(data){
                                    console.log(data);
                                    that.did = {};
                                    that.selections = [];
                                    that.socialSecurityPlansList();
                                    that.$message({
                                        type: 'success',
                                        message: '删除成功!'
                                    });
                                });
                        }).catch(function(){
                            that.$message({
                                type: 'info',
                                message: '已取消删除'
                            });
                        });
                    }
                }
            },
            operationData: function (info,index) {
                var that = this;
                console.log(info);
                if(index==0){
                    if(info.expiryDate){
                        this.$message({
                            type: 'info',
                            message: '此社保方案已失效!'
                        });
                    }else {
                        that.$refs.infor.editWhich = info.id;
                    }
                }else {
                    that.did.id = info.id;
                    this.$confirm('是否确认删除?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(function(){
                        console.log(that.did);
                        Api.deleteSocialSecurityPlanApi.ajax(that.did)
                            .done(function(data){
                                console.log(data);
                                that.did = {};
                                that.selections = [];
                                that.socialSecurityPlansList();
                                that.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                            });
                    }).catch(function(){
                        that.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }
            },
            tableHeaderColor: function() {
                return 'background-color: #F7F6Fd;font-size: 14px;font-weight: bold;'
            },
        },
        watch: {

        },
        mounted: function(){
            this.socialSecurityPlansList();
            this.householdTypeList();
        }
    };
});