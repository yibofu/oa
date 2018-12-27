define([
    'text!spucfg/component/main.html',
    'WebCommon/api',

    'WebComponent/sidebar',
    'WebComponent/topbar',

    'jquery',

], function(
    tpl,
    Api,
    SideBar,
    TopBar,

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
            TopBar:TopBar

        },
        computed: {
            sidebar() {
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