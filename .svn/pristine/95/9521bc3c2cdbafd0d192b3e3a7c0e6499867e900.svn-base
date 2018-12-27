define([
    'vue',
    'jquery',
    'common/api',
    'teamwork/component/teamwork-list',

    'css!https://unpkg.com/element-ui/lib/theme-chalk/index.css'

], function(
    Vue,$,Api

){
    return{
        data: function(){
            return {
                name: 'lize',
            };
        },
        methods: {

        },components: {
        },
        mounted: function(){

        },
        template: tpl,
        props: {
            currentPage: Number,

            pageCount: Number,

            pagerCount: Number,

            disabled: Boolean
        },
        watch: {
            showPrevMore(val) {
                if (!val) this.quickprevIconClass = 'el-icon-more';
            },

            showNextMore(val) {
                if (!val) this.quicknextIconClass = 'el-icon-more';
            }
        },
        computed: {}
    };
});