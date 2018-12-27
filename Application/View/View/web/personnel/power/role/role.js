define([
    'text!power/role/role.html',
    'power/role/common/api',
    'jquery',
    'power/role/component/add-role',
], function(
    tpl,
    Api,
    $,
    AddRole
){
    return {
        template: tpl,
        components: {
            AddRole: AddRole,
        },
        data: function(){
            return {
                tableData: [],
                multipleSelection: [],
                selections: [],
                did: {id: ''}, //所选角色ID
            }
        },
        methods: {
            roleList: function () {
                var that = this;
                Api.getRoleList.ajax()
                    .done(function(data){
                        that.tableData = data.result;
                    });
            },
            checkInfor: function (index) {
                var that = this;
                if(index==0){
                    that.$refs.infor.isShow = true;
                }else if(index==1){
                    that.selections = that.$refs.multipleTables.selection;
                    if(!that.selections[0]){
                        this.$message({
                            message: '请选择想要删除的角色名称',
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
                            Api.deleteRoleApi.ajax(that.did)
                                .done(function(data){
                                    console.log(data);
                                    that.did = {};
                                    that.selections = [];
                                    that.roleList();
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
            operationData: function (info) {
                var that = this;
                console.log(info.id);
                that.did.id = info.id;
                this.$confirm('是否确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    console.log(that.did);
                    Api.deleteRoleApi.ajax(that.did)
                        .done(function(data){
                            console.log(data);
                            that.did = {};
                            that.selections = [];
                            that.roleList();
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

            },
            tableHeaderColor: function() {
                return 'background-color: #F7F6Fd;font-size: 14px;font-weight: bold;'
            },
        },
        watch: {

        },
        mounted: function(){
            this.roleList();
        }
    };
});