define([
    'text!social-security/social-security-program/component/add-social-security-program.html',
    'social-security/social-security-program/common/api',
    'jquery',
    'vendor/v-distpicker-master/dist/v-distpicker',

    'css!social-security/social-security-program/component/add-social-security-program.css'
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
                socialSecurityInfo: {//社保方案信息
                    id: '',
                    city: '',
                    householdType: '',//户口性质
                    effectiveDate: '',//生效日期
                    iexpiryDate: '',//失效日期
                    medicalBase: '',//医疗最低基数(元)
                    medicalHighestBase: '',//医疗最高基数(元)
                    medicalRatio: '',//医疗比例%(个人)
                    medicalFixedFee: '',//固定医疗费用（个人）
                    medicalRatioTwo: '',//医疗比例%(公司)
                    medicalFixedFeeTwo: '',//固定医疗费用（公司）
                    largeMedicalBase: '',//大额医疗最低基数(元)
                    largeMedicalHighestBase: '',//大额医疗最高基数(元)
                    largeMedicalRatio: '',//大额医疗比例%(个人)
                    largeMedicalFixedFee: '',//固定大额医疗费用（个人）
                    largeMedicalRatioTwo: '',//大额医疗比例%(公司)
                    largeMedicalFixedFeeTwo: '',//固定大额医疗费用（公司）
                    pensionBase: '',//养老最低基数(元)
                    pensionHighestBase: '',//养老最高基数(元)
                    pensionRatio: '',//养老比例%(个人)
                    pensionFixedFee: '', //固定养老费用（个人）
                    pensionRatioTwo: '',//养老比例%(公司)
                    pensionFixedFeeTwo: '',//固定养老费用（公司）
                    hurtedBase: '',//工伤最低基数(元)
                    hurtedHighestBase: '',//工伤最高基数(元)
                    hurtedRatio: '',//工伤比例%(个人)
                    hurtedFixedFee: '',//固定工伤费用（个人）
                    hurtedRatioTwo: '',//工伤比例%(公司)
                    hurtedFixedFeeTwo: '',//固定工伤费用（公司）
                    unemploymentBase: '',//失业最低基数(元)
                    unemploymentHighestBase: '',//失业最高基数(元)
                    unemploymentRatio: '',//失业比例%(个人)
                    unemploymentFixedFee: '',//'固定失业费用（个人）
                    unemploymentRatioTwo: '',//失业比例%(公司)
                    unemploymentFixedFeeTwo: '',//固定失业费用（公司）
                    birthedBase: '',//生育最低基数(元)
                    birthedHighestBase: '',//生育最高基数(元)
                    birthedRatio: '',//生育比例%(个人)
                    birthedFixedFee: '',//固定生育费用（个人）
                    birthedRatioTwo: '',//生育比例%(公司)
                    birthedFixedFeeTwo: '',//固定生育费用（公司）
                    foudBase: '',//公积金最低基数(元)
                    highestfoud: '',//公积金最高基数(元)
                    foudRatio: '',//公积金比例%(个人)
                    foudBaseFixedFee: '',//固定公积金费用（个人）
                    foudRatioTwo: '',//公积金比例%(公司)
                    foudBaseFixedFeeTwo: '',//固定公积金费用（公司）
                },
                tableData: [],//社保方案列表
                province: '',
                city: '',
                householdList: [],
            }
        },
        components: {
            VDistpicker: VDistpicker
        },
        methods: {
            socialSecurityPlanList: function () {
                var that = this;
                Api.getSocialSecurityPlanList.ajax()
                    .done(function(data){
                        that.tableData = data;
                        that.$parent.tableData = data;
                    });
            },
            checkBtn: function (index) {
                var that = this;
                if(index==1){
                    if(that.editWhich!=''){
                        Api.updateSocialSecurityPlanApi.ajax(that.socialSecurityInfo)
                            .done(function(data){
                                that.tableData = data;
                                that.socialSecurityPlanList();
                                that.socialSecurityInfo = {
                                    id: '',
                                    city: '',
                                    householdType: '',//户口性质
                                    effectiveDate: '',//生效日期
                                    medicalBase: '',//医疗基数(元)
                                    medicalRatio: '',//医疗比例%(个人)
                                    medicalRatioTwo: '',//医疗比例%(公司)
                                    largeMedicalBase: '',//大额医疗基数(元)
                                    largeMedicalRatio: '',//大额医疗比例%(个人)
                                    largeMedicalRatioTwo: '',//大额医疗比例%(公司)
                                    pensionBase: '',//养老基数(元)
                                    pensionRatio: '',//养老比例%(个人)
                                    pensionRatioTwo: '',//养老比例%(公司)
                                    hurtedBase: '',//工伤基数(元)
                                    hurtedRatio: '',//工伤比例%(个人)
                                    hurtedRatioTwo: '',//工伤比例%(公司)
                                    unemploymentBase: '',//失业基数(元)
                                    unemploymentRatio: '',//失业比例%(个人)
                                    unemploymentRatioTwo: '',//失业比例%(公司)
                                    birthedBase: '',//生育基数(元)
                                    birthedRatio: '',//生育比例%(个人)
                                    birthedRatioTwo: '',//生育比例%(公司)
                                    foudBase: '',//公积金基数(元)
                                    foudRatio: '',//公积金比例%(个人)
                                    foudRatioTwo: '',//公积金比例%(公司)
                                };
                                that.province = '';
                                that.city = '';
                                that.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                                that.isShow = false;
                                that.whichBtn = '';
                                that.editWhich = '';
                            });
                    }else {
                        if(that.socialSecurityInfo.city==''){
                            that.$message({
                                type: 'warning',
                                message: '请选择城市！'
                            });
                        }else if(that.socialSecurityInfo.householdType==''){
                            that.$message({
                                type: 'warning',
                                message: '请选择户口性质！'
                            });
                        }else if(that.socialSecurityInfo.effectiveDate==''){
                            that.$message({
                                type: 'warning',
                                message: '请选择生效日期！'
                            });
                        }else {
                            Api.addSocialSecurityPlanApi.ajax(that.socialSecurityInfo)
                                .done(function(data){
                                    that.tableData = data;
                                    that.socialSecurityPlanList();
                                    that.socialSecurityInfo = {
                                        id: '',
                                        city: '',
                                        householdType: '',//户口性质
                                        effectiveDate: '',//生效日期
                                        iexpiryDate: '',//失效日期
                                        medicalBase: '',//医疗基数(元)
                                        medicalRatio: '',//医疗比例%(个人)
                                        medicalRatioTwo: '',//医疗比例%(公司)
                                        largeMedicalBase: '',//大额医疗基数(元)
                                        largeMedicalRatio: '',//大额医疗比例%(个人)
                                        largeMedicalRatioTwo: '',//大额医疗比例%(公司)
                                        pensionBase: '',//养老基数(元)
                                        pensionRatio: '',//养老比例%(个人)
                                        pensionRatioTwo: '',//养老比例%(公司)
                                        hurtedBase: '',//工伤基数(元)
                                        hurtedRatio: '',//工伤比例%(个人)
                                        hurtedRatioTwo: '',//工伤比例%(公司)
                                        unemploymentBase: '',//失业基数(元)
                                        unemploymentRatio: '',//失业比例%(个人)
                                        unemploymentRatioTwo: '',//失业比例%(公司)
                                        birthedBase: '',//生育基数(元)
                                        birthedRatio: '',//生育比例%(个人)
                                        birthedRatioTwo: '',//生育比例%(公司)
                                        foudBase: '',//公积金基数(元)
                                        foudRatio: '',//公积金比例%(个人)
                                        foudRatioTwo: '',//公积金比例%(公司)
                                    };
                                    that.province = '';
                                    that.city = '';
                                    that.$message({
                                        message: '添加成功',
                                        type: 'success'
                                    });
                                    that.isShow = false;
                                    that.whichBtn = '';
                                    that.editWhich = '';
                                });
                        }
                    }
                }else {
                    that.socialSecurityInfo = {
                        id: '',
                        city: '',
                        householdType: '',//户口性质
                        effectiveDate: '',//生效日期
                        iexpiryDate: '',//失效日期
                        medicalBase: '',//医疗基数(元)
                        medicalRatio: '',//医疗比例%(个人)
                        medicalRatioTwo: '',//医疗比例%(公司)
                        largeMedicalBase: '',//大额医疗基数(元)
                        largeMedicalRatio: '',//大额医疗比例%(个人)
                        largeMedicalRatioTwo: '',//大额医疗比例%(公司)
                        pensionBase: '',//养老基数(元)
                        pensionRatio: '',//养老比例%(个人)
                        pensionRatioTwo: '',//养老比例%(公司)
                        hurtedBase: '',//工伤基数(元)
                        hurtedRatio: '',//工伤比例%(个人)
                        hurtedRatioTwo: '',//工伤比例%(公司)
                        unemploymentBase: '',//失业基数(元)
                        unemploymentRatio: '',//失业比例%(个人)
                        unemploymentRatioTwo: '',//失业比例%(公司)
                        birthedBase: '',//生育基数(元)
                        birthedRatio: '',//生育比例%(个人)
                        birthedRatioTwo: '',//生育比例%(公司)
                        foudBase: '',//公积金基数(元)
                        foudRatio: '',//公积金比例%(个人)
                        foudRatioTwo: '',//公积金比例%(公司)
                    };
                    that.province = '';
                    that.city = '';
                    that.isShow = false;
                    that.whichBtn = '';
                    that.editWhich = '';
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
                    this.socialSecurityInfo.city = '';
                }else if(this.city.length<=1||this.city==''){
                    this.city = '';
                    this.$message({
                        type: 'info',
                        message: '请选择市区!'
                    });
                    this.socialSecurityInfo.city = '';
                }else {
                    this.socialSecurityInfo.city = this.province + '-' + this.city;
                    this.householdsList();
                }
            },
            onChangeCity: function(data) {
                this.city = data.value;
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
                    this.socialSecurityInfo.city = '';
                }else if(this.province.length>1&&this.city.length>1){
                    this.socialSecurityInfo.city = this.province + '-' + this.city;
                    this.householdsList();
                }
            },
            householdsList: function () {//户口类别
                var that = this;
                Api.getHouseholdApi.ajax({city:that.socialSecurityInfo.city})
                    .done(function(data){
                        that.householdList = data;
                    });
            }
        },
        watch: {
            editWhich: function () {
                var that = this;
                if(!that.isShow&&that.editWhich!=''){
                    that.isShow = true;
                    var len = that.tableData.length;
                    for(var i=0;i<len;i++){
                        if(that.tableData[i].id==that.editWhich){
                            that.socialSecurityInfo = that.tableData[i];
                        }
                    }
                }
            },
            province: function () {
                var that = this;
                that.socialSecurityInfo.householdType = '';
            },
            city: function () {
                var that = this;
                that.socialSecurityInfo.householdType = '';
            },
            'socialSecurityInfo.householdType': function () {
                var that = this;
                if(that.socialSecurityInfo.householdType!=''){
                    Api.cityIsExistApi.ajax(that.socialSecurityInfo)
                        .done(function(data){
                            console.log(typeof(data));
                            if(data.result){
                                that.$message({
                                    type: 'warning',
                                    message: data.result.result
                                });
                            }
                        });
                }
            },
            'socialSecurityInfo.effectiveDate': function () {
                var that = this;
                if(that.socialSecurityInfo.effectiveDate!=''){
                    Api.cityIsExistApi.ajax(that.socialSecurityInfo)
                        .done(function(data){
                            console.log(data);
                            if(data.result){
                                var myDate = new Date();
                                var theYear = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
                                var theMouth = myDate.getMonth()+1; //获取当前月份(0-11,0代表1月)
                                if(theMouth<10){
                                    theMouth = '0'+theMouth;
                                }
                                var theDay = myDate.getDate(); //获取当前日(1-31)
                                if(theDay<10){
                                    theDay = '0'+theDay;
                                }
                                var thisDay = theYear+'-'+theMouth+'-'+theDay;//当前日期
                                var dates = new Date(thisDay);
                                var timeNow = dates.getTime();//当前日期的时间戳
                                var date = new Date(that.socialSecurityInfo.effectiveDate);
                                var effectiveDate = date.getTime();//生效日期的时间戳
                                if(effectiveDate<timeNow){
                                    that.$message({
                                        type: 'warning',
                                        message: "生效日期不能小于当前日期"
                                    });
                                }else {
                                    var iexpiryDate = effectiveDate - 1 * 60 * 60 * 24 * 1000;
                                    var timer = new Date(iexpiryDate);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                                    var Y = timer.getFullYear() + '-';
                                    var M = (timer.getMonth()+1 < 10 ? '0'+(timer.getMonth()+1) : timer.getMonth()+1) + '-';
                                    var D = timer.getDate();
                                    if(D<10){
                                        D = '0'+D;
                                    }
                                    that.socialSecurityInfo.iexpiryDate = Y + M + D;
                                }
                            }
                        });

                }
            }
        },
        mounted: function(){
            this.socialSecurityPlanList();
        }
    };
});