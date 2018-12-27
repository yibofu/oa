define([
    'text!staff/staff-add/staff-add.html',
    'staff/common/api',
    'vendor/v-distpicker-master/dist/v-distpicker',
    'vue',

    'staff/staff-add/staff-add',
    'jquery',
    'css!staff/staff-add/staff-add.css'
], function(
    tpl,
    Api,
    VDistpicker,
    Vue,
    $
){
    // Vue.component('v-distpicker', VDistpicker);
    return {
        template: tpl,
        data: function(){
            return {
                btnText:'button',
                header: [],
                activeNames: ['1'],
                contractNumber: 1, //合同签订次数
                bankCardNumber: 1, //银行卡数量
                formInline: {
                    id: '', //员工ID
                    status: '试用',//员工状态
                    photo: '', //头像
                    name: '', //姓名
                    uname: '', //昵称
                    unumber: '', //工号
                    sex: '', //性别
                    department_id: '', //部门
                    posts: '', //岗位
                    leader: '', //导师
                    category_id: '', //人员类别
                    workEmail: '', //工作邮箱
                    telephone: '', //手机号码
                    weixin: '', //微信号
                    ownEmail: '', //个人邮箱
                    birthday: '', //出生日期
                    constellation: '', //星座
                    qq: '', //QQ号
                    national: '', //民族
                    married: '', //婚姻状态
                    native: '', //籍贯
                    education_id: '', //学历
                    school: '', //毕业院校
                    hobby: '', //兴趣爱好
                    cardType_id: '', //证件类型
                    cardNumber: '', //证件号码
                    rank_id: '', //职级
                    position_id: '', //职位
                    coreMembers: '', //是否核心人才
                    source_id: '', //招聘来源
                    referees: '', //推荐人
                    hiredate: '', //入职日期
                    correctionDate: '', //转正日期
                    homeAddress: '', //家庭地址
                    address: '', //现居住地
                    contactPerson: '', //紧急联系人
                    contactPersonPhone:'', //紧急联系人电话
                    file: [], //简历附件
                    oldName: '', //简历名称
                    payType: '', //上下发薪
                    // discount: '', //内购折扣
                    contractType_id: '', //合同类型
                    company_id: '', //合同公司
                    contractStart: '', //合同起始日
                    signedYears: '', //签订年限
                    contractEnd: '', //合同终止日
                    leaveDate: '', //离职日期
                    leaveType_id: '', //离职类别
                    leaveReason: '', //离职原因
                    householdType: '', //户口类型
                    payLand: '', //社保缴纳地
                    payAccount: '',//缴纳账户
                    payBase: '', //社保基数
                    foudBase: '', //公积金基数
                    socialStarting: '', //社保起始月
                    fundStarting: '', //公积金起始月
                    medical: '', //医疗
                    pension: '', //养老
                    unemployment: '', //失业
                    fund: '', //公积金
                    medicalTwo: '', //医疗(公)
                    pensionTwo: '', //养老(公)
                    unemploymentTwo: '', //失业(公)
                    hurted: '', //工伤---暂时不用
                    hurtedTwo: '', //工伤(公)
                    birthed: '', //生育---暂时不用
                    birthedTwo: '', //生育(公)
                    fundTwo: '', //公积金(公)
                    bankCardNumber: [''], //银行卡号
                    openBank: [''], //开户行
                    accountTitle: [''], //账户名称
                    attendanceSystem: '', //考勤制度
                    attendance: '', //考勤班次
                    restDayPlan: '', //休息日方案
                },
                oldName: '',
                is_auto: '',
                unumber_maxLength: '',
                nations: ["汉族","蒙古族","回族","藏族","维吾尔族","苗族","彝族","壮族","布依族","朝鲜族","满族","侗族","瑶族","白族","土家族",
                    "哈尼族","哈萨克族","傣族","黎族","傈僳族","佤族","畲族","高山族","拉祜族","水族","东乡族","纳西族","景颇族","柯尔克孜族",
                    "土族","达斡尔族","仫佬族","羌族","布朗族","撒拉族","毛南族","仡佬族","锡伯族","阿昌族","普米族","塔吉克族","怒族", "乌孜别克族",
                    "俄罗斯族","鄂温克族","德昂族","保安族","裕固族","京族","塔塔尔族","独龙族","鄂伦春族","赫哲族","门巴族","珞巴族","基诺族"],
                categoryType: [],
                province: '',
                city: '',
                pidTwo: [],
                departmentList: [],
                educationList: [],
                cardList: [],
                rankList: [],
                positionList: [],
                sourceList: [],
                companyList: [],
                leaveList: [],
                householdList: [],
                leaderList: [],
                payAccountList: [],
            };
        },
        components: {
            VDistpicker: VDistpicker
        },
        computed: {
            sidebar: function() {
                // return this.$store.state.app.sidebar
            }
        },
        created: function () {
            var obj = this;


        },
        methods: {
            staffInfoBack: function () {
                this.formInline = {
                    id: '', //员工ID
                    status: '试用',//员工状态
                    photo: '', //头像
                    name: '', //姓名
                    uname: '', //昵称
                    unumber: '', //工号
                    sex: '', //性别
                    department_id: '', //部门
                    posts: '', //岗位
                    leader: '', //导师
                    category_id: '', //人员类别
                    workEmail: '', //工作邮箱
                    telephone: '', //手机号码
                    weixin: '', //微信号
                    ownEmail: '', //个人邮箱
                    birthday: '', //出生日期
                    constellation: '', //星座
                    qq: '', //QQ号
                    national: '', //民族
                    married: '', //婚姻状态
                    native: '', //籍贯
                    education_id: '', //学历
                    school: '', //毕业院校
                    hobby: '', //兴趣爱好
                    cardType_id: '', //证件类型
                    cardNumber: '', //证件号码
                    rank_id: '', //职级
                    position_id: '', //职位
                    coreMembers: '', //是否核心人才
                    source_id: '', //招聘来源
                    referees: '', //推荐人
                    hiredate: '', //入职日期
                    correctionDate: '', //转正日期
                    homeAddress: '', //家庭地址
                    address: '', //现居住地
                    contactPerson: '', //紧急联系人
                    contactPersonPhone:'', //紧急联系人电话
                    file: [], //简历附件
                    oldName: '', //简历名称
                    payType: '', //上下发薪
                    // discount: '', //内购折扣
                    contractType_id: '', //合同类型
                    company_id: '', //合同公司
                    contractStart: '', //合同起始日
                    signedYears: '', //签订年限
                    contractEnd: '', //合同终止日
                    leaveDate: '', //离职日期
                    leaveType_id: '', //离职类别
                    leaveReason: '', //离职原因
                    householdType: '', //户口类型
                    payLand: '', //社保缴纳地
                    payAccount: '',//缴纳账户
                    payBase: '', //社保基数
                    foudBase: '', //公积金基数
                    socialStarting: '', //社保起始月
                    fundStarting: '', //公积金起始月
                    medical: '', //医疗
                    pension: '', //养老
                    unemployment: '', //失业
                    fund: '', //公积金
                    medicalTwo: '', //医疗(公)
                    pensionTwo: '', //养老(公)
                    unemploymentTwo: '', //失业(公)
                    hurted: '', //工伤---暂时不用
                    hurtedTwo: '', //工伤(公)
                    birthed: '', //生育---暂时不用
                    birthedTwo: '', //生育(公)
                    fundTwo: '', //公积金(公)
                    bankCardNumber: [''], //银行卡号
                    openBank: [''], //开户行
                    accountTitle: [''], //账户名称
                    attendanceSystem: '', //考勤制度
                    attendance: '', //考勤班次
                    restDayPlan: '', //休息日方案
                }
            },
            addStaffInfo: function (formName) {
                var that = this;
                if(that.formInline.leaveDate!=''||that.formInline.leaveDate!=null){
                    that.formInline.status = '离职';
                }else {
                    if(that.formInline.correctionDate!=''||that.formInline.correctionDate!=null){
                        that.formInline.status = '正式';
                    }else {
                        that.formInline.status = '试用';
                    }
                }
                Api.addBasicApi.ajax(that.formInline)
                    .done(function(data){
                        that.formInline.id = data.result;
                        Api.addPersonnelApi.ajax(that.formInline)
                            .done(function(data){
                                console.log(data);
                                Api.addSocialSecurityInformationApi.ajax(that.formInline)
                                    .done(function(data){
                                        console.log(data);
                                        Api.addSocialSecurityInformationTwoApi.ajax(that.formInline)
                                            .done(function(data){
                                                console.log(data);
                                                Api.addBankInformationApi.ajax(that.formInline)
                                                    .done(function(data){
                                                        console.log(data);
                                                        // Api.addAttendanceInformationApi.ajax(that.formInline)
                                                        //     .done(function(data){
                                                        //         console.log(data);
                                                        that.$message({
                                                            message: '员工档案创建成功',
                                                            type: 'success'
                                                        });
                                                        this.$router.push({path: '/staff-con'});
                                                        this.staffInfoBack();
                                                        // });
                                                    });
                                            });
                                    });
                            });
                    });
            },
            init: function () {
                var that = this;
                that.bankCardNumber = that.formInline.bankCardNumber.length;
                Api.getUnumberDigitApi.ajax()
                    .done(function(data){
                        console.log(data);
                        if(data.workingRules.is_auto=='2'){
                            that.is_auto = true;
                            that.unumber_maxLength = data.workingRules.digits;
                            var unumber = "" + data.unumber.unumber;
                            var len = unumber.length;
                            var num = data.workingRules.digits - len;
                            for(var i=0;i<num;i++){
                                unumber = '0'+unumber;
                            }
                            that.formInline.unumber = unumber;
                        }else {
                            that.is_auto = false;
                            that.unumber_maxLength = data.workingRules.digits;
                        }
                    });
            },
            addBankCard: function () {
                var str = '';
                this.formInline.bankCardNumber.push(str);
                this.formInline.openBank.push(str);
                this.formInline.accountTitle.push(str);
                this.bankCardNumber = this.formInline.bankCardNumber.length;
            },
            deleteBankCard: function (index) {
                index += 1;
                this.formInline.bankCardNumber.splice(index,1);
                this.formInline.openBank.splice(index,1);
                this.formInline.accountTitle.splice(index,1);
                this.bankCardNumber = this.formInline.bankCardNumber.length;
            },
            toDate: function () {//计算合同终止日
                var that = this;
                if(that.formInline.contractStart&&that.formInline.signedYears){
                    var arr = that.formInline.contractStart.split('-');
                    arr[0] = parseInt(arr[0])+parseInt(that.formInline.signedYears);
                    that.formInline.contractEnd = arr.join('-');
                    var date = new Date(that.formInline.contractEnd); //时间对象
                    var str = date.getTime(); //转换成时间戳
                    str = str-1000*60*60*24;
                    var myDate = new Date(str);
                    var Y=myDate.getFullYear(); + "-" + (myDate.getMonth()+1) + "-" + myDate.getDate();
                    var M=myDate.getMonth()+1;
                    if(M<10){
                        M = '0'+M;
                    }
                    var D=myDate.getDate();
                    if(D<10){
                        D = '0'+D;
                    }
                    var getDate = Y+'-'+M+'-'+D;
                    that.formInline.contractEnd = getDate;
                    that.$set(that.formInline.contractEnd,that.formInline.contractEnd);
                }
            },
            getPhoto: function () {//上传头像
                var that = this;
                var files = document.getElementsByClassName('photo')[0].files[0];
                console.log(files);
                if(files){
                    var formData = new FormData();
                    formData.append("file[]", files);
                    console.log(formData);
                    Api.uploadPhotoApi.ajaxPromise(formData,{type: 'POST', processData: false,
                        contentType: false})
                        .done(function (data) {
                            console.log(data);
                            that.formInline.photo = data.file;
                        });
                }
            },
            uploadResume: function () {//上传简历
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
            onChangeProvince: function(data) {
                this.province = data.value
                if(this.province.length<=1||this.province==''){
                    this.province = '';
                    this.$message({
                        type: 'info',
                        message: '请选择省!'
                    });
                    this.formInline.payLand = '';
                }else if(this.city.length<=1||this.city==''){
                    this.city = '';
                    this.$message({
                        type: 'info',
                        message: '请选择市区!'
                    });
                    this.formInline.payLand = '';
                }else {
                    this.formInline.payLand = this.province + '-' + this.city;
                    this.householdsList();
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
                    this.formInline.payLand = '';
                }else if(this.province.length>1&&this.city.length>1){
                    this.formInline.payLand = this.province + '-' + this.city;
                    this.householdsList();
                }
            },
            categoryList: function () {//合同类型
                var that = this;
                Api.getCategoryApi.ajax()
                    .done(function(data){
                        that.categoryType = data;
                    });
            },
            departmentsList: function () {//部门
                var that = this;
                Api.getAllDepartmentList.ajax()
                    .done(function(data){
                        that.departmentList = data;
                    });
            },
            educationsList: function () {//学历
                var that = this;
                Api.getEducationApi.ajax()
                    .done(function(data){
                        that.educationList = data;
                    });
            },
            cardsList: function () {//证件类型
                var that = this;
                Api.getCardApi.ajax()
                    .done(function(data){
                        that.cardList = data;
                    });
            },
            ranksList: function () {//职级
                var that = this;
                Api.getRankApi.ajax()
                    .done(function(data){
                        that.rankList = data;
                    });
            },
            positionsList: function () {//职位
                var that = this;
                Api.getPositionApi.ajax()
                    .done(function(data){
                        that.positionList = data;
                    });
            },
            sourcesList: function () {//招聘平台
                var that = this;
                Api.getSourceApi.ajax()
                    .done(function(data){
                        that.sourceList = data;
                    });
            },
            companysList: function () {//合同公司
                var that = this;
                Api.getCompanyApi.ajax()
                    .done(function(data){
                        that.companyList = data;
                    });
            },
            leavesList: function () {//离职类别
                var that = this;
                Api.getLeaveApi.ajax()
                    .done(function(data){
                        that.leaveList = data;
                    });
            },
            householdsList: function () {//户口类别
                var that = this;
                Api.getHouseholdApi.ajax({city:that.formInline.payLand})
                    .done(function(data){
                        that.householdList = data;
                    });
            },
            giveSocialInfo: function (info) {
                var that = this;
                that.formInline.medical = info.medical; //医疗
                that.formInline.pension = info.pension; //养老
                that.formInline.unemployment = info.unemployment; //失业
                that.formInline.fund = info.fund; //公积金
                that.formInline.medicalTwo = info.medicalTwo; //医疗(公)
                that.formInline.pensionTwo = info.pensionTwo; //养老(公)
                that.formInline.unemploymentTwo = info.unemploymentTwo; //失业(公)
                that.formInline.hurtedTwo = info.hurtedTwo; //工伤
                that.formInline.birthedTwo = info.birthedTwo; //生育
                that.formInline.fundTwo = info.fundTwo; //公积金(公)
            },
            giveDepartmentId: function () {
                var num = this.pidTwo.length-1;
                this.formInline.department_id = this.pidTwo[num];
            },
            leadersList: function () {//导师
                var that = this;
                Api.personneStatusInformationApi.ajax()
                    .done(function(data){
                        that.leaderList = data.result;
                    });
            },
            payAccountsList: function () {
                var that = this;
                Api.getPayAccountList.ajax()
                    .done(function(data){
                        that.payAccountList = data;
                    });
            },
            // 根据生日的月份和日期，计算星座。
            getAstro: function (m,d){
                return "魔羯座水瓶座双鱼座白羊座金牛座双子座巨蟹座狮子座处女座天秤座天蝎座射手座魔羯座".substr(m*3-(d<"102223444433".charAt(m-1)- -19)*3,3);
            }
        },
        watch: {
            'formInline.householdType': function () {
                var that = this;
                if(that.formInline.payLand&&that.formInline.payLand!=''&&
                    that.formInline.householdType &&that.formInline.householdType!=''&&
                    that.formInline.payBase&&that.formInline.payBase!=''&&
                    that.formInline.foudBase&&that.formInline.foudBase!=''){
                    Api.addSocialSecurityInformationApi.ajax(that.formInline)
                        .done(function(data){
                            // that.householdList = data;
                            console.log(data);
                            that.giveSocialInfo(data);
                        });
                }
            },
            'formInline.payBase': function () {
                var that = this;
                if(that.formInline.payLand&&that.formInline.payLand!=''&&
                    that.formInline.householdType &&that.formInline.householdType!=''&&
                    that.formInline.payBase&&that.formInline.payBase!=''&&
                    that.formInline.foudBase&&that.formInline.foudBase!=''){
                    Api.addSocialSecurityInformationApi.ajax(that.formInline)
                        .done(function(data){
                            // that.householdList = data;
                            console.log(data);
                            that.giveSocialInfo(data);
                        });
                }
            },
            'formInline.foudBase': function () {
                var that = this;
                if(that.formInline.payLand&&that.formInline.payLand!=''&&
                    that.formInline.householdType &&that.formInline.householdType!=''&&
                    that.formInline.payBase&&that.formInline.payBase!=''&&
                    that.formInline.foudBase&&that.formInline.foudBase!=''){
                    Api.addSocialSecurityInformationApi.ajax(that.formInline)
                        .done(function(data){
                            // that.householdList = data;
                            console.log(data);
                            that.giveSocialInfo(data);
                        });
                }
            },
            'formInline.birthday': function () {
                var that = this;
                if(that.formInline.birthday){
                    var arr = that.formInline.birthday.split('-');
                    that.formInline.constellation = that.getAstro(arr[1],arr[2]);
                }
            }
        },
        mounted: function(){
            this.init();
            this.categoryList();
            this.departmentsList();
            this.educationsList();
            this.cardsList();
            this.ranksList();
            this.positionsList();
            this.sourcesList();
            this.companysList();
            this.leavesList();
            this.leadersList();
            this.payAccountsList();
        }
    };
});