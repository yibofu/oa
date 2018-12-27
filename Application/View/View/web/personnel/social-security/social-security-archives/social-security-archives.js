define([
    'text!social-security/social-security-archives/social-security-archives.html',
    'social-security/social-security-archives/common/api',
    'jquery',
    'social-security/social-security-archives/component/social-security-archives-list',
], function(
    tpl,
    Api,
    $,
    SocialSecurityArchivesList
){
    return {
        template: tpl,
        components: {
            SocialSecurityArchivesList: SocialSecurityArchivesList,
        },
        data: function(){
            return {
                activeName: 'first',
            }
        },
        methods: {
            handleClick: function(tab, event) {
                console.log(tab);
                if(tab.index==0){
                    this.$refs.socialLista.archivesStatus.status = 1;
                    this.gaveSearchInfo(this.$refs.socialLista);
                    this.$refs.socialListb.archivesStatus.status = 1;
                    this.gaveSearchInfo(this.$refs.socialListb);
                }else {
                    this.$refs.socialLista.archivesStatus.status = 2;
                    this.gaveSearchInfo(this.$refs.socialLista);
                    this.$refs.socialListb.archivesStatus.status = 2;
                    this.gaveSearchInfo(this.$refs.socialListb);
                }
            },
            gaveSearchInfo: function (who) {
                who.searchInfo = {
                    pages: 10,//每页显示条数
                    pageNum: 1,  //当前页
                    status: '',

                    unumber: '',//工号
                    name: '',//姓名
                    cardNumber: '',//证件号
                    department_id: '',//部门id
                    payLand: '',//社保缴纳地
                    householdType: '',//户口性质
                    socialStarTime: '',//社保起始月(开始)
                    socialEndTime: '',//社保起始月(结束)
                    fundStarTime: '',//公积金起始月(开始)
                    fundEndTime: '',//公积金起始月(结束)
                    payBase: '',//社保基数
                    foudBase: '',//公积金基数
                }
            }
        },
        watch: {

        },
        mounted: function(){

        }
    };
});