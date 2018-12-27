define([
    'text!enum/rank/component/add-rank.html',
    'enum/rank/common/api',
    'jquery',

    'css!enum/rank/component/add-rank.css'
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
                rankInfo: {//职级信息
                    id: '',
                    name: '',
                },
                tableData: [],//职级列表
            }
        },
        methods: {
            rankList: function () {
                var that = this;
                Api.getRankList.ajax()
                    .done(function(data){
                        that.tableData = data;
                        that.$parent.tableData = data;
                        if(data[0]){
                            var lens = data.length;
                            that.$parent.rankName = data;
                            for(var i=0;i<lens;i++){
                                that.$parent.rankName[i].text = that.$parent.rankName[i].name;
                                that.$parent.rankName[i].value = that.$parent.rankName[i].name;
                            }
                        }
                    });
            },
            checkBtn: function (index) {
                var that = this;
                if(index==1){
                    if(that.editWhich!=''){
                        Api.updateRankApi.ajax(that.rankInfo)
                            .done(function(data){
                                that.tableData = data;
                                that.rankList();
                                that.rankInfo = {
                                    id: '',
                                    name: '',
                                };
                                that.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                            });
                    }else {
                        Api.addRankApi.ajax(that.rankInfo)
                            .done(function(data){
                                that.tableData = data;
                                that.rankList();
                                that.rankInfo = {
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
                    that.rankInfo = {
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
                            that.rankInfo = that.tableData[i];
                        }
                    }
                }
            }
        },
        mounted: function(){
            this.rankList();
        }
    };
});