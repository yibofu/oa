define([
    'text!department/component/main.html',
    'WebCommon/api',

    'Web/personnel/component/sidebar',
    'Web/personnel/component/topbar',
    'department/component/department-list',
    'jquery',

], function(
    tpl,
    Api,
    SideBar,
    TopBar,
    DepartmentList,

    $
){

    return {
        template: tpl,
        data: function(){
            return {
                btnText:'button'
            };
        },
        components: {
            SideBar:SideBar,
            TopBar:TopBar,
            DepartmentList: DepartmentList
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