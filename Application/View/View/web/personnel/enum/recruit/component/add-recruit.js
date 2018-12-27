define([
    'text!enum/recruit/component/add-recruit.html',
    'enum/recruit/common/api',
    'jquery',

    'css!enum/recruit/component/add-recruit.css'
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
                sourceInfo: {//招聘渠道信息
                    id: '',
                    name: '',
                },
                tableData: [],//招聘渠道列表
            }
        },
        methods: {
            sourceList: function () {
                var that = this;
                Api.getSourceList.ajax()
                    .done(function(data){
                        that.tableData = data;
                        that.$parent.tableData = data;
                        if(data[0]){
                            var lens = data.length;
                            that.$parent.sourceName = data;
                            for(var i=0;i<lens;i++){
                                that.$parent.sourceName[i].text = that.$parent.sourceName[i].name;
                                that.$parent.sourceName[i].value = that.$parent.sourceName[i].name;
                            }
                        }
                    });
            },
            checkBtn: function (index) {
                var that = this;
                if(index==1){
                    if(that.editWhich!=''){
                        Api.updateSourceApi.ajax(that.sourceInfo)
                            .done(function(data){
                                that.tableData = data;
                                that.sourceList();
                                that.sourceInfo = {
                                    id: '',
                                    name: '',
                                };
                                that.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                            });
                    }else {
                        Api.addSourceApi.ajax(that.sourceInfo)
                            .done(function(data){
                                that.tableData = data;
                                that.sourceList();
                                that.sourceInfo = {
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
                    that.sourceInfo = {
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
                            that.sourceInfo = that.tableData[i];
                        }
                    }
                }
            }
        },
        mounted: function(){
            this.sourceList();
        }
    };
});