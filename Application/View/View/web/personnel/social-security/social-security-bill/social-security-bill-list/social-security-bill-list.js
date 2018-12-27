define([
    'text!social-security/social-security-bill/social-security-bill-list/social-security-bill-list.html',
    'social-security/social-security-bill/common/api',
    'jquery',
    'social-security/social-security-bill/component/add-social-security-bill-staff',

    'css!social-security/social-security-bill/social-security-bill-list/social-security-bill-list.css'
], function(
    tpl,
    Api,
    $,
    AddSocialSecurityBillStaff
){
    return {
        template: tpl,
        components: {
            AddSocialSecurityBillStaff: AddSocialSecurityBillStaff
        },
        data: function(){
            return {
                tableData: [],
                multipleSelection: [],
                selections: [],
                did: {id: ''}, //所选台账ID
                month1: '',
                month2: '',
            }
        },
        methods: {
            sourceList: function () {
                var that = this;
                Api.getSourceList.ajax()
                    .done(function(data){
                        that.tableData = data;
                        if(data[0]){
                            var lens = data.length;
                            that.sourceName = data;
                            for(var i=0;i<lens;i++){
                                that.sourceName[i].text = that.sourceName[i].name;
                                that.sourceName[i].value = that.sourceName[i].name;
                            }
                        }
                    });
            },
            checkInfor: function (index) {
                var that = this;
                if(index==0){
                    that.$refs.staffInfo.isShow = true;
                }else if(index==1){
                    console.log('123');
                }
            },
            operationData: function (info,index) {
                var that = this;
                console.log(info.id);
                if(index==0){
                    that.$refs.infor.editWhich = info.id;
                }else if(index==1){
                    that.did.id = info.id;
                    this.$confirm('是否确认删除?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(function(){
                        console.log(that.did);
                        Api.deleteSourceApi.ajax(that.did)
                            .done(function(data){
                                console.log(data);
                                that.did = {};
                                that.selections = [];
                                that.sourceList();
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
                }else if(index==2){
                    console.log(index);
                }
            },
            checkTheMonth: function () {//筛选月份

            },
            isCheckChange: function () {//返回
                this.$router.push({path: 'social-security-bill'});
            },
            tableHeaderColor: function() {
                return 'background-color: #F7F6Fd;font-size: 14px;font-weight: bold;'
            },
        },
        watch: {

        },
        mounted: function(){
            this.sourceList();
        }
    };
});