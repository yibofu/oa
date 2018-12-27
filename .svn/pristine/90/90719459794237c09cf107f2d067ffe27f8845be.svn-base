define([
    'text!power/role/component/add-role.html',
    'power/role/common/api',
    'jquery',

    'css!power/role/component/add-role.css'
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
                roleInfo: {//角色信息
                    id: '',
                    role_name : '',
                },
                tableData: [],//角色列表
            }
        },
        methods: {
            roleList: function () {
                var that = this;
                Api.getRoleList.ajax()
                    .done(function(data){
                        that.tableData = data.result;
                        that.$parent.tableData = data.result;
                    });
            },
            checkBtn: function (index) {
                var that = this;
                if(index==1){
                    Api.addRoleApi.ajax(that.roleInfo)
                        .done(function(data){
                            that.tableData = data.result;
                            that.roleInfo = {
                                id: '',
                                role_name : '',
                            };
                            that.roleList();
                            that.$message({
                                message: '添加成功',
                                type: 'success'
                            });
                        });
                }else {
                    that.roleInfo = {
                        id: '',
                        role_name: '',
                    };
                }
                that.isShow = false;
                that.whichBtn = '';
            },
        },
        watch: {

        },
        mounted: function(){

        }
    };
});