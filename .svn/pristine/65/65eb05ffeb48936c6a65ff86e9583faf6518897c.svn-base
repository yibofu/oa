define([
    'text!enum/operation/add-position.html',
    'enum/common/api',
    'jquery',

    'css!enum/operation/add-position.css'
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
                positionInfo: {
                    id: '',//职位ID
                    name: '', //职位名称
                    oid: '', //部门ID
                    department_name: '', //部门名称
                },
                options: [],
                tableData: [],
            }
        },
        methods: {
            checkBtn: function (index) {
                var that = this;
                if(index==1){
                    if(that.editWhich!=''){
                        Api.updatePositionApi.ajax(that.positionInfo)
                            .done(function(data){
                                that.tableData = data;
                                that.positionList();
                                that.positionInfo = {
                                    id: '',//职位ID
                                    name: '', //职位名称
                                    oid: '', //部门ID
                                    department_name: '', //部门名称
                                };
                                that.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                            });
                    }else {
                        Api.addPositionApi.ajax(that.positionInfo)
                            .done(function(data){
                                that.tableData = data;
                                that.positionList();
                                that.positionInfo = {
                                    id: '',//职位ID
                                    name: '', //职位名称
                                    oid: '', //部门ID
                                    department_name: '', //部门名称
                                };
                                that.$message({
                                    message: '添加成功',
                                    type: 'success'
                                });
                            });
                    }
                }else {
                    that.positionInfo = {
                        id: '',//职位ID
                        name: '', //职位名称
                        oid: '', //部门ID
                        department_name: '', //部门名称
                    };
                }
                that.isShow = false;
                that.whichBtn = '';
                that.editWhich = '';
            },
            positionList: function () {
                var that = this;
                Api.getPositionList.ajax()
                    .done(function(data){
                        that.tableData = data;
                        that.$parent.tableData = data;
                        if(data[0]){
                            var lens = data.length;
                            that.$parent.positionName = data;
                            for(var i=0;i<lens;i++){
                                that.$parent.positionName[i].text = that.$parent.positionName[i].name;
                                that.$parent.positionName[i].value = that.$parent.positionName[i].name;
                            }
                        }
                    });
            },
            departmentsList: function () {
                var that = this;
                Api.getDepartmentList.ajax()
                    .done(function(data){
                        that.options = data;
                        if(data[0]){
                            var lens = data.length;
                            that.$parent.departmentName = data;
                            for(var i=0;i<lens;i++){
                                that.$parent.departmentName[i].text = that.$parent.departmentName[i].department_name;
                                that.$parent.departmentName[i].value = that.$parent.departmentName[i].department_name;
                            }
                        }
                    });
            }
        },
        watch: {
            editWhich: function () {
                var that = this;
                if(!that.isShow&&that.editWhich!=''){
                    that.isShow = true;
                    var len = that.tableData.length;
                    for(var i=0;i<len;i++){
                        if(that.tableData[i].id==that.editWhich){
                            that.positionInfo = that.tableData[i];
                        }
                    }
                }
            }
        },
        mounted: function(){
            this.departmentsList();
            this.positionList();
        }
    };
});