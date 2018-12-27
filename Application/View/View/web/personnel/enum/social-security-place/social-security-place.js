define([
    'text!enum/social-security-place/social-security-place.html',
    'enum/social-security-place/common/api',
    'jquery',
    'enum/social-security-place/component/add-social-security-place',

], function(
    tpl,
    Api,
    $,
    AddSocialSecurityPlace
){
    return {
        template: tpl,
        components: {
            AddSocialSecurityPlace: AddSocialSecurityPlace,
        },
        data: function(){
            return {
                tableData: [{
                    id: 1,
                    name: '王小虎',
                },{
                    id: 2,
                    name: '王大虎',

                },],
                multipleSelection: [],
                selections: [],
                did: {id: ''}, //所选职位ID
            }
        },
        methods: {
            filterHandler: function(value, row, column) {
                const property = column['property'];
                return row[property] === value;
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
                            message: '请选择想要删除的部门',
                            type: 'warning'
                        });
                    }else {
                        this.$confirm('是否确认删除?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(function(){
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
                            console.log(that.did);
                            // Api.deleteDepartmentApi.ajax(that.did)
                            //     .done(function(data){
                            //         console.log(data);
                            //         that.did = {};
                            //         that.$refs.tree.setCheckedKeys([]);
                            //         that.getDepartmentsList();
                            //         that.$message({
                            //             type: 'success',
                            //             message: '删除成功!'
                            //         });
                            //     });
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
                console.log(info.id);
                if(index==0){
                    this.$refs.infor.editWhich = info.id;
                }else {

                }
            }
        },
        watch: {

        },
        mounted: function(){
            // this.departmentsList();
        }
    };
});