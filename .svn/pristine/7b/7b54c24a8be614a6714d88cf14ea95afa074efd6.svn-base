define([
    'text!social-security/social-security-bill/component/add-social-security-bill.html',
    'social-security/social-security-bill/common/api',
    'jquery',

    'css!social-security/social-security-bill/component/add-social-security-bill.css'
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
                billInfo: {//招聘渠道信息
                    id: '',
                    name: '',
                    month1: '',
                    bill: '',
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
                    Api.addEducationApi.ajax(that.sourceInfo)
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
                }else {
                    that.sourceInfo = {
                        id: '',
                        name: '',
                    };
                }
                that.isShow = false;
                that.whichBtn = '';
            },
            uploadResume: function () {//上传文件
                var that = this;
                var files = document.getElementsByClassName('file')[0].files[0];
                console.log(files);
                if(files){
                    var formData = new FormData();
                    formData.append("file[]", files);
                    console.log(formData);
                    Api.uploadResumeApi.ajaxPromise(formData,{type: 'POST', processData: false,
                        contentType: false})
                        .done(function (data) {
                            console.log(data);
                            that.formInline.file = data.file;
                            that.formInline.oldName = data.oldName;
                        });
                }
            },
        },
        watch: {
        },
        mounted: function(){
            this.sourceList();
        }
    };
});