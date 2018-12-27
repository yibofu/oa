define([
    'text!social-security/social-security-archives/component/add-social-security-archives.html',
    'social-security/social-security-archives/common/api',
    'jquery',
    'vendor/v-distpicker-master/dist/v-distpicker',

    'css!social-security/social-security-archives/component/add-social-security-archives.css'
], function(
    tpl,
    Api,
    $,
    VDistpicker
){
    return {
        template: tpl,
        data: function(){
            return {
                whichBtn: '',//点击了那个按钮
                isShow: false,//是否显示添加框
                isCheck: true,//true-查看，false-修改
                whichOne: '',//选中数据ID
                archivesInfo: {//户口性质信息
                    id: '',//员工ID
                    name: '',//员工姓名
                    unumber: '',//工号
                    department_name: '',//员工所属部门
                    cardNumber: '',//证件号
                    payLand: '',//省-市
                    householdType: '',//户口性质
                    payAccount: '',//缴纳账户
                    payBase: '',//社保基数
                    foudBase: '',//公积金基数
                    socialStarting: '',//社保起始月
                    fundStarting: '',//公积金起始月
                    socialEnding: '',//社保最后缴纳月
                    fundEnding: '',//社保最后缴纳月
        },
                tableData: [],//户口性质列表
                province: '',//省
                city: '',//市
                formInline: {
                    user: '',
                    region: ''
                },
                householdList: [],
                payAccountList: [],
            }
        },
        components: {
            VDistpicker: VDistpicker
        },
        methods: {
            householdsList: function () {//户口类别
                var that = this;
                Api.getHouseholdApi.ajax({city:that.archivesInfo.payLand})
                    .done(function(data){
                        that.householdList = data;
                    });
            },
            payAccountsList: function () {
                var that = this;
                Api.getPayAccountList.ajax()
                    .done(function(data){
                        that.payAccountList = data;
                    });
            },
            checkBtn: function (index) {
                var that = this;
                if(index==1){
                    Api.updateHouseholdTypeApi.ajax(that.householdTypeInfo)
                        .done(function(data){
                            that.tableData = data;
                            that.householdTypeList();
                            that.province = '';
                            that.city = '';
                            that.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                            that.isShow = false;
                            that.whichBtn = '';
                            that.whichOne = '';
                        });
                }else if(index==2){
                    that.isCheck = false;
                }else {
                    that.isShow = false;
                    that.whichBtn = '';
                    that.whichOne = '';
                }
            },
            onChangeProvince: function(data) {
                this.province = data.value;
                if(this.province.length<=1||this.province==''){
                    this.province = '';
                    this.$message({
                        type: 'info',
                        message: '请选择省!'
                    });
                    this.archivesInfo.payLand = '';
                }else if(this.city.length<=1||this.city==''){
                    this.city = '';
                    this.$message({
                        type: 'info',
                        message: '请选择市区!'
                    });
                    this.archivesInfo.payLand = '';
                }else {
                    this.archivesInfo.payLand = this.province + '-' + this.city;
                    this.householdsList();
                }
                this.formInline.householdType = '';
            },
            onChangeCity: function(data) {
                this.city = data.value
                if(this.province.length<=1){
                    this.province = '';
                    this.$message({
                        type: 'info',
                        message: '请优先选择省!'
                    });
                }else if(this.city.length<=1||this.city==''){
                    this.city = '';
                    this.$message({
                        type: 'info',
                        message: '请选择市区!'
                    });
                    this.archivesInfo.payLand = '';
                }else if(this.province.length>1&&this.city.length>1){
                    this.archivesInfo.payLand = this.province + '-' + this.city;
                    this.householdsList();
                }
                this.formInline.householdType = '';
            },
        },
        watch: {
            whichOne: function () {
                var that = this;
                if(!that.isShow&&that.whichOne!=''){
                    that.isShow = true;
                    Api.checkSocialFilesApi.ajax({id: that.whichOne})
                        .done(function(data){
                            that.archivesInfo = data;
                            if(data.payLand!=''){
                                var arr= new Array(); //定义一数组
                                arr=data.payLand.split("-"); //字符分割
                                that.province = arr[0];
                                that.city = arr[1];
                            }
                        });
                }
            }
        },
        mounted: function(){
            // this.householdsList();
            this.payAccountsList();
        }
    };
});