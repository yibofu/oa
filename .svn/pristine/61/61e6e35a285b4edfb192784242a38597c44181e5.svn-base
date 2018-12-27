define([
    'text!social-security/household-type/component/add-household-type.html',
    'social-security/household-type/common/api',
    'jquery',
    'vendor/v-distpicker-master/dist/v-distpicker',

    'css!social-security/household-type/component/add-household-type.css'
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
                whichBtn: '',
                isShow: false,
                editWhich: '',
                householdTypeInfo: {//户口性质信息
                    id: '',
                    city: '',
                    householdType: '',
                },
                tableData: [],//户口性质列表
                province: '',
                city: '',
            }
        },
        components: {
            VDistpicker: VDistpicker
        },
        methods: {
            householdTypeList: function () {
                var that = this;
                Api.getHouseholdTypeList.ajax()
                    .done(function(data){
                        that.tableData = data;
                        that.$parent.tableData = data;
                        if(data[0]){
                            var lens = data.length;
                            that.$parent.cityName = data;
                            for(var i=0;i<lens;i++){
                                that.$parent.cityName[i].text = that.$parent.cityName[i].name;
                                that.$parent.cityName[i].value = that.$parent.cityName[i].name;
                            }
                        }
                    });
            },
            checkBtn: function (index) {
                var that = this;
                if(index==1){
                    if(that.editWhich!=''){
                        Api.updateHouseholdTypeApi.ajax(that.householdTypeInfo)
                            .done(function(data){
                                that.tableData = data;
                                that.householdTypeList();
                                that.householdTypeInfo = {
                                    id: '',
                                    city: '',
                                    householdType: '',
                                };
                                that.province = '';
                                that.city = '';
                                that.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                            });
                    }else {
                        Api.addHouseholdTypeApi.ajax(that.householdTypeInfo)
                            .done(function(data){
                                that.tableData = data;
                                that.householdTypeList();
                                that.householdTypeInfo = {
                                    id: '',
                                    city: '',
                                    householdType: '',
                                };
                                that.province = '';
                                that.city = '';
                                that.$message({
                                    message: '添加成功',
                                    type: 'success'
                                });
                            });
                    }
                }
                that.isShow = false;
                that.whichBtn = '';
                that.editWhich = '';
            },
            onChangeProvince: function(data) {
                this.province = data.value
                if(this.province.length<=1||this.province==''){
                    this.province = '';
                    this.$message({
                        type: 'info',
                        message: '请选择省!'
                    });
                    this.householdTypeInfo.city = '';
                }else if(this.city.length<=1||this.city==''){
                    this.city = '';
                    this.$message({
                        type: 'info',
                        message: '请选择市区!'
                    });
                    this.householdTypeInfo.city = '';
                }else {
                    this.householdTypeInfo.city = this.province + '-' + this.city;
                }
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
                    this.householdTypeInfo.city = '';
                }else if(this.province.length>1&&this.city.length>1){
                    this.householdTypeInfo.city = this.province + '-' + this.city;
                }
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
                            that.householdTypeInfo = that.tableData[i];
                            if(that.householdTypeInfo.city){
                                var arr= new Array(); //定义一数组
                                arr=that.householdTypeInfo.city.split("-"); //字符分割
                                that.province = arr[0];
                                that.city = arr[1];
                            }
                        }
                    }
                }
            }
        },
        mounted: function(){
            this.householdTypeList();
        }
    };
});