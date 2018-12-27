define([
    'text!department/component/department-list.html',
    'jquery',
    'department/common/api',
    'department/component/department-info',
    'department/component/department-orgchart',

    'css!department/component/department-list.css'
], function(
    tpl,
    $,
    Api,
    DepartmentInfo,
    DepartmentOrgchart
){
    return {
        template: tpl,
        components: {
            DepartmentInfo: DepartmentInfo,
            DepartmentOrgchart: DepartmentOrgchart
        },
        data: function(){
            return {
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                tabPosition: 'right',
                departmentList: [],
                departmentInfo: {
                    pid: '',//上级部门ID
                    pidTwo: '',//选择部门
                    id: '', //部门ID
                    department_number: '',//部门编码
                    department_name: '', //部门名称
                    department_heads: '', //部门领导
                    setup_time: '' //成立日期
                },
                whichBtn: 0, //点击的按钮：0-无，1-查看，2-修改，3-删除
                children: [], //department-info的数据
                checkedDepart: [], //被选中部门
                did: {id: ''}, //被选中部门id
                pidReverTwo: [],
                isChange: 0,
                topBtnShow: true,
                departments: [],
                checkId: '',

            }
        },
        methods: {
            getDepartmentsList: function () {
                var that = this;
                Api.getAllDepartmentList.ajax()
                    .done(function(data){
                        that.departments = data;
                        // that.$refs.info.departments = data;
                        // console.log(data);
                        // that.changeTree(data);
                    });
            },
            getAllDepartmentsList: function () {//获取部门列表
                var that = this;
                Api.getDepartmentList.ajax()
                    .done(function(data){
                        // that.departments.push(data);
                        that.departments = data;
                        that.$refs.info.departments = data;
                        console.log(data);
                        that.changeTree(data);
                    });
            },
            departmentsList: function () {
                var that = this;
                that.children = this.$refs.info;
            },
            checkInfo: function (index) {
                var that = this;
                that.checkedDepart = this.$refs.tree.getCheckedNodes();
                if(index===3){
                    if(!that.checkedDepart[0]){
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
                            var len = that.checkedDepart.length;
                            for(var i=0;i<len;i++){
                                var pid;
                                if(i==0){
                                    that.did = {id: that.checkedDepart[i].id};
                                }
                                else {
                                    pid = that.did.id + ',' + that.checkedDepart[i].id;
                                    that.did = {id: pid};
                                }
                            }
                            console.log(that.did);
                            Api.deleteDepartmentApi.ajax(that.did)
                                .done(function(data){
                                    console.log(data);
                                    that.did = {};
                                    that.$refs.tree.setCheckedKeys([]);
                                    that.getDepartmentsList();
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
                // }else if(index!=0){
                //     that.whichBtn = index;
                //     // that.children = this.$refs.info.ruleForm.department_number = 111;
                //     if(!that.checkedDepart[0]&&that.whichBtn!=5||that.checkedDepart.length>1&&that.whichBtn!=5){
                //         this.$message({
                //             message: '请选择一个部门进行此项操作',
                //             type: 'warning'
                //         });
                //     }else {
                //         this.$refs.info.whichBtns = index;
                //         that.did = {id: that.checkedDepart[0].id};
                //         Api.checkDepartmentApi.ajax(that.did)
                //             .done(function(data){
                //                 console.log(data);
                //                 that.departmentInfo = data;
                //                 that.$refs.info.ruleForm = that.departmentInfo;
                //                 if(that.departmentInfo.pid!='0'){
                //                     that.pidReverTwo.push(that.departmentInfo.pid);
                //                     that.takeCheck(that.departmentInfo.pid);
                //                 }
                //             });
                //     }
                }else {
                    if(index==0){
                        that.$refs.info.checkBtnsZero = true;
                    }
                    that.whichBtn = index;
                    that.$refs.info.whichBtns = index;
                    that.$refs.info.ruleForm.pid = '';//上级部门ID
                    that.$refs.info.ruleForm.id = '', //部门ID
                    that.$refs.info.pidTwo = [], //选择部门
                    that.$refs.info.ruleForm.departmentUplevel = '';//上级部门
                    that.$refs.info.ruleForm.department_number = '';//部门编码
                    that.$refs.info.ruleForm.department_name = ''; //部门名称
                    that.$refs.info.ruleForm.department_heads = ''; //部门领导
                    that.$refs.info.ruleForm.setup_time = ''; //成立日期
                    that.departmentInfo = [];
                    that.did = {};
                    that.$refs.tree.setCheckedKeys([]);
                    that.checkedDepart = [];
                }
            },
            resetChecked: function(index) {
                this.$refs.info.whichBtns = index;
                this.$refs.tree.setCheckedKeys([]);
                this.$refs.info.ruleForm.setup_time = '';
                this.$refs.info.ruleForm.pid = '';
                this.$refs.info.ruleForm.id = '';
                this.$refs.info.pidTwo = [];
                this.did = {id: ''};
            },
            handleClick: function(tab, event) {
                if(tab.index==0){
                    this.topBtnShow = true;
                }else if(tab.index==1){
                    this.topBtnShow = false;
                }
            },
            exportExcel: function () {
                window.location.href ="http://oa.fnji.com/Manage/OrganizationalStructure/export";
            },
            takeCheck: function (id) {
                var that = this;
                Api.checkDepartmentApi.ajax({id: id})
                    .done(function(data){
                        console.log(data);
                        if(data.pid!='0'){
                            that.pidReverTwo.push(data.pid);
                            that.takeCheck(data.pid);
                        }else {
                            var pidThree = that.pidReverTwo.reverse();
                            that.$refs.info.pidTwo = pidThree;
                            that.pidReverTwo = [];
                        }
                    });
            },
            changeCheckNode: function (info) {//点击某一部门
                var that = this;
                that.whichBtn = 1;
                that.$refs.info.whichBtns = 1;
                console.log(info);
                that.checkId = info.id;
                Api.checkDepartmentApi.ajax({id: that.checkId})
                    .done(function(data){
                        console.log(data);
                        that.departmentInfo = data;
                        that.$refs.info.ruleForm = that.departmentInfo;
                        if(that.departmentInfo.pid!='0'){
                            that.pidReverTwo.push(that.departmentInfo.pid);
                            that.takeCheck(that.departmentInfo.pid);
                        }
                    });
            }
        },
        watch: {
            isChange: function() {
                this.getDepartmentsList();
                this.$set(this.departmentList,this.departmentList);
            }
        },
        mounted: function(){
            this.departmentsList();
            this.getDepartmentsList();
        }
    };
});