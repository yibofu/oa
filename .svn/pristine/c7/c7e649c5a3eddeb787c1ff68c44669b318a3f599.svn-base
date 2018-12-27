define([
    'text!staff/component/main.html',
    'WebCommon/api',

    'Web/personnel/component/sidebar',
    'Web/personnel/component/topbar',
    'staff/component/staff-con',
    'jquery',

], function(
    tpl,
    Api,
    SideBar,
    TopBar,
    StaffCon,

    $
){

    return {
        template: tpl,
        data: function(){
            return {
                btnText:'button',
            };
        },
        components: {
            SideBar:SideBar,
            TopBar:TopBar,
            StaffCon: StaffCon
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

            init: function ()
            {
            },
        },
        mounted: function(){
            this.init();
        }
    };
});