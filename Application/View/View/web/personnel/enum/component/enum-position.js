define([
    'text!enum/component/enum-position.html',
    'enum/common/api',
    'jquery',
    'enum/operation/add-position',

    'css!enum/component/enum-position.css'
], function(
    tpl,
    Api,
    $,
    AddPosition
){
    return {
        template: tpl,
        components: {
            AddPosition: AddPosition,
        },
        data: function(){
            return {
                tableData: [],//职位列表
                multipleSelection: [],
                selections: [],
                did: {id: ''}, //所选职位ID
                positionName: [],
                departmentName: [],
            }
        },
        methods: {
            positionList: function () {
                var that = this;
                Api.getPositionList.ajax()
                    .done(function(data){
                        that.tableData = data;
                        if(data[0]){
                            var lens = data.length;
                            that.positionName = data;
                            for(var i=0;i<lens;i++){
                                that.positionName[i].text = that.positionName[i].name;
                                that.positionName[i].value = that.positionName[i].name;
                            }
                        }
                    });
            },
            filterHandler: function(value, row, column) {
                const property = column['property'];
                return row[property] === value;
            },
            checkInfo: function (index) {//点击新增或删除按钮
                var that = this;
                if(index==0){
                    that.$refs.info.whichBtn = index;
                    that.$refs.info.isShow = true;
                }else if(index==1){
                    that.selections = that.$refs.multipleTable.selection;
                    if(!that.selections[0]){
                        this.$message({
                            message: '请选择想要删除的职位',
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
                            Api.deletePositionApi.ajax(that.did)
                                .done(function(data){
                                    console.log(data);
                                    that.did = {};
                                    that.selections = [];
                                    that.positionList();
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
            operationData: function (info,index) {//点击修改或删除某一职位
                var that = this;
                console.log(info.id);
                if(index==0){
                    that.$refs.info.editWhich = info.id;
                }else {
                    that.did.id = info.id;
                    this.$confirm('是否确认删除?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(function(){
                        console.log(that.did);
                        Api.deletePositionApi.ajax(that.did)
                            .done(function(data){
                                console.log(data);
                                that.did = {};
                                that.selections = [];
                                that.positionList();
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
            this.positionList();
        }
    };
});