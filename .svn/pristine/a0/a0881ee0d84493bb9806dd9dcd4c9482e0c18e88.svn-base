define([
    'text!staff/staff-operation/staff-operation.html',
    'staff/common/api',

    'staff/staff-add/staff-add',
    'staff/staff-info/staff-info',
    'jquery',
    'css!staff/staff-operation/staff-operation.css'
], function(
    tpl,
    Api,
    StaffAdd,
    StaffInfo,
    $
){

    return {
        template: tpl,
        data: function(){
            return {
                btnText:'button',
                staffPage: '',

            };
        },
        components: {
            StaffAdd: StaffAdd,
            StaffInfo: StaffInfo
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
            init: function () {
                var that = this;
                that.staffPage = that.$route.query.isAdd;
                console.log(that.$route);
            },
            backToList: function () {
                this.$router.push({path: '/staff-con'});
            }
        },
        watch: {
            $route: function(){
                this.init();
            }
        },
        mounted: function(){
            this.init();
            // this.getDepartmentsList();
        }
    };
});