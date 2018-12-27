define([
    'text!enum/education/component/add-education.html',
    'enum/education/common/api',
    'jquery',

    'css!enum/education/component/add-education.css'
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
                educationInfo: {//学历信息
                    id: '',
                    name: '',
                },
                tableData: [],//学历列表
            }
        },
        methods: {
            educationList: function () {
                var that = this;
                Api.getEducationList.ajax()
                    .done(function(data){
                        that.tableData = data;
                        that.$parent.tableData = data;
                        if(data[0]){
                            var lens = data.length;
                            that.$parent.educationName = data;
                            for(var i=0;i<lens;i++){
                                that.$parent.educationName[i].text = that.$parent.educationName[i].name;
                                that.$parent.educationName[i].value = that.$parent.educationName[i].name;
                            }
                        }
                    });
            },
            checkBtn: function (index) {
                var that = this;
                if(index==1){
                    if(that.editWhich!=''){
                        Api.updateEducationApi.ajax(that.educationInfo)
                            .done(function(data){
                                that.tableData = data;
                                that.educationList();
                                that.educationInfo = {
                                    id: '',
                                    name: '',
                                };
                                that.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                            });
                    }else {
                        Api.addEducationApi.ajax(that.educationInfo)
                            .done(function(data){
                                that.tableData = data;
                                that.educationList();
                                that.educationInfo = {
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
                    that.educationInfo = {
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
                            that.educationInfo = that.tableData[i];
                        }
                    }
                }
            }
        },
        mounted: function(){
            this.educationList();
        }
    };
});