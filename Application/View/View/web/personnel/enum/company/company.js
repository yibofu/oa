define([
    'text!enum/company/company.html',
    'enum/company/common/api',
    'jquery',
    'enum/company/component/add-company',

    'css!enum/company/company.css'
], function(
    tpl,
    Api,
    $,
    AddCompany
){
    return {
        template: tpl,
        components: {
            AddCompany: AddCompany,
        },
        data: function(){
            return {
                tableData: [],
                multipleSelection: [],
                selections: [],
                did: {id: ''}, //所选公司ID
                companyName: [],
            }
        },
        methods: {
            companyList: function () {
                var that = this;
                Api.getCompanyList.ajax()
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
                            message: '请选择想要删除的学历',
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
                            Api.deleteCompanyApi.ajax(that.did)
                                .done(function(data){
                                    console.log(data);
                                    that.did = {};
                                    that.selections = [];
                                    that.companyList();
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
                console.log(info.id);
                if(index==0){
                    that.$refs.infor.editWhich = info.id;
                }else {
                    that.did.id = info.id;
                    this.$confirm('是否确认删除?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(function(){
                        console.log(that.did);
                        Api.deleteCompanyApi.ajax(that.did)
                            .done(function(data){
                                console.log(data);
                                that.did = {};
                                that.selections = [];
                                that.companyList();
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
            this.companyList();
        }
    };
});