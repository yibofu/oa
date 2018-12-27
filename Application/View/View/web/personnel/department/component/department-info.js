define([
    'text!department/component/department-info.html',
    'department/common/api',
    'jquery',

    'css!department/component/department-info.css'
], function(
    tpl,
    Api,
    $,
    DepartmentInfo
){
    return {
        template: tpl,
        data: function(){
            return {
                ruleForm: {
                    pid: '',//上级部门ID
                    id: '', //部门ID
                    pidTwo: [],
                    // departmentUplevel: '',//上级部门
                    department_number: '',//部门编码
                    department_name: '', //部门名称
                    department_heads: '', //部门领导
                    setup_time: '', //成立日期
                },
                departments: [],
                rules: {
                    department_number: [
                        { required: true, message: '请输入部门编号', trigger: 'blur' },
                    ],
                    department_name: [
                        { required: true, message: '请输入部门名称', trigger: 'blur' },
                    ],
                    department_heads: [
                        { required: true, message: '请输入部门领导名', trigger: 'blur' },
                    ],
                },
                pidTwo: [],
                hasTime: false,
                whichBtns: 0,
                canChange: false,
                isReset: false,
                checkBtnsZero: false,
            }
        },
        methods: {
            timeChange: function () {
                if(this.ruleForm.setup_time=='') {
                    this.hasTime = true;
                    $('.border-line').parent().find('div').eq(0).find('input').addClass('border-time-error');
                }else {
                    this.hasTime = false;
                    $('.border-line').parent().find('div').eq(0).find('input').removeClass('border-time-error');
                }
            },
            submitForm: function(formName) {//创建部门
                var that = this;
                this.$refs[formName].validate(function(valid){
                    if (valid) {
                        if(that.ruleForm.setup_time==''){
                            that.hasTime = true;
                        }else {
                            Api.addDepartmentApi.ajax(that.ruleForm)
                                .done(function(data){
                                    console.log(data);
                                    that.ruleForm.setup_time = '';
                                    that.$refs[formName].resetFields();
                                    that.isReset = true;
                                    that.departmentsList();
                                    that.$parent.$parent.$parent.did = {id: ''};
                                    that.$parent.$parent.$parent.$refs.tree.setCheckedKeys([]);
                                    that.$parent.$parent.$parent.departmentList = that.departments;
                                    that.$parent.$parent.$parent.isChange += 1;
                                    that.$message({
                                        message: '添加成功',
                                        type: 'success'
                                    });
                                });
                        }
                    } else {
                        if(that.ruleForm.setup_time==''){
                            that.hasTime = true;
                            $('.border-line').parent().find('div').eq(0).find('input').addClass('border-time-error');
                        }
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            doEdit: function(formName) {//修改部门信息
                var that = this;
                this.$refs[formName].validate(function(valid){
                    if (valid) {
                        if(that.ruleForm.setup_time==''){
                            that.hasTime = true;
                            $('.border-line').parent().find('div').eq(0).find('input').addClass('border-time-error');
                        }else {
                            Api.updateDepartmentApi.ajax(that.ruleForm)
                                .done(function (data) {
                                    console.log(data);
                                    that.ruleForm.setup_time = '';
                                    that.whichBtns = 0;
                                    that.$refs[formName].resetFields();
                                    that.isReset = true;
                                    that.departmentsList();
                                    that.$parent.$parent.$parent.did = {id: ''};
                                    that.$parent.$parent.$parent.$refs.tree.setCheckedKeys([]);
                                    that.$parent.$parent.$parent.did = {id: ''};
                                    that.$parent.$parent.$parent.isChange += 1;
                                    that.$message({
                                        message: '修改成功',
                                        type: 'success'
                                    });
                                });
                        }
                    } else {
                        if(that.ruleForm.setup_time==''){
                            that.hasTime = true;
                            $('.border-line').parent().find('div').eq(0).find('input').addClass('border-time-error');
                        }
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            departmentsList: function () {//获取部门列表
                var that = this;
                Api.getAllDepartmentList.ajax()
                    .done(function(data){
                        // that.departments.push(data);
                        that.departments = data;
                        this.$set(this.departments,this.departments);
                        console.log(data);
                    });
            },
            resetForm: function(formName) {//清空表单数据
                this.ruleForm.setup_time = '';
                this.ruleForm.id = '';
                this.hasTime = false;
                this.isReset = true;
                $('.border-line').parent().find('div').eq(0).find('input').removeClass('border-time-error');
                this.$refs[formName].resetFields();
                this.$parent.$parent.$parent.did = {id: ''};
                this.$parent.$parent.$parent.$refs.tree.setCheckedKeys([]);
                this.whichBtns = 0;
            },
            givePid: function () {
                var num = this.pidTwo.length-1;
                this.ruleForm.pid = this.pidTwo[num];
            },
            changeToEdit: function () {
                var that = this;
                that.whichBtns = 2;
            }
        },
        watch: {
            whichBtns: function () {
                if(this.whichBtns==1){
                    this.canChange = true;
                }else if(this.whichBtns==0||this.whichBtns==3||this.whichBtns==4){
                    this.hasTime = false;
                    $('.border-line').parent().find('div').eq(0).find('input').removeClass('border-time-error');
                    $('.border-line').parent().find('div').eq(0).find('input').removeClass('border-time-seccess');
                    this.$refs['ruleForm'].resetFields();
                    $('.departmentNumber').removeClass('is-success');
                    $('.departmentName').removeClass('is-success');
                    $('.departmentHeader').removeClass('is-success');
                    $('.departmentUplevel').removeClass('is-success');
                    this.canChange = false;
                }else if(this.whichBtns==2){
                    if(this.ruleForm.setup_time!=''){
                        this.hasTime = false;
                        $('.border-line').parent().find('div').eq(0).find('input').addClass('border-time-seccess');
                    }else {
                        this.hasTime = true;
                        $('.border-line').parent().find('div').eq(0).find('input').removeClass('border-time-seccess');
                        $('.border-line').parent().find('div').eq(0).find('input').addClass('border-time-error');
                    }
                    this.canChange = false;
                    $('.departmentNumber').addClass('is-success');
                    $('.departmentName').addClass('is-success');
                    $('.departmentHeader').addClass('is-success');
                    $('.departmentUplevel').addClass('is-success');
                }
            },
            'ruleForm.setup_time': function() {
                if(this.whichBtns==2){
                    if(this.ruleForm.setup_time!=''){
                        this.hasTime = false;
                        $('.border-line').parent().find('div').eq(0).find('input').addClass('border-time-seccess');
                    }else {
                        if(!this.isReset){
                            this.hasTime = true;
                            $('.border-line').parent().find('div').eq(0).find('input').removeClass('border-time-seccess');
                            $('.border-line').parent().find('div').eq(0).find('input').addClass('border-time-error');
                        }else {
                            $('.border-line').parent().find('div').eq(0).find('input').removeClass('border-time-seccess');
                            this.isReset = false;
                        }
                    }
                }else if(this.whichBtns==0){
                    if(!this.checkBtnsZero){
                        if(this.ruleForm.setup_time){
                            this.hasTime = false;
                            $('.border-line').parent().find('div').eq(0).find('input').addClass('border-time-seccess');
                        }else {
                            if(!this.isReset){
                                this.hasTime = true;
                                $('.border-line').parent().find('div').eq(0).find('input').removeClass('border-time-seccess');
                                $('.border-line').parent().find('div').eq(0).find('input').addClass('border-time-error');
                            }else {
                                $('.border-line').parent().find('div').eq(0).find('input').removeClass('border-time-seccess');
                                this.isReset = false;
                            }
                        }
                    }else {
                        this.hasTime = false;
                        $('.border-line').parent().find('div').eq(0).find('input').removeClass('border-time-seccess');
                        $('.border-line').parent().find('div').eq(0).find('input').removeClass('border-time-error');
                    }

                }else {
                    this.hasTime = false;
                    $('.border-line').parent().find('div').eq(0).find('input').removeClass('border-time-seccess');
                    $('.border-line').parent().find('div').eq(0).find('input').removeClass('border-time-error');
                }
            },
            pidTwo: function () {
                this.ruleForm.pidTwo = this.pidTwo;
            }
        },
        mounted: function(){
            this.departmentsList();
        }
    };
});