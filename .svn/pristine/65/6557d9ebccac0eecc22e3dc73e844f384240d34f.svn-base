define([
    'text!component/main.html',
    'WebCommon/api',

    'Web/personnel/component/sidebar',
    'Web/personnel/component/topbar',
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
                btnText:'button',
                editableTabs: [],
                tabNum: 1,
                theTab: '',
                theTabNum: 0,
            };
        },
        components: {
            SideBar:SideBar,
            TopBar:TopBar
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
                this.editableTabs.push(this.$route);
                this.theTab = this.$route.name;
            },
            toTheRouter: function (targetName) {
                console.log(targetName);
                for(var j=0;j<this.tabNum;j++){
                    if(targetName.name==this.editableTabs[j].name){
                        this.$router.push({path:this.editableTabs[j].path})
                        console.log(this.$route);
                    }
                }
            },
            removeTab(targetName) {
                var that = this;
                if(that.tabNum>1){
                    var tabs = that.editableTabs;
                    var activeName = that.theTab;
                    if (activeName === targetName) {
                        tabs.forEach(function(tab, index){
                            if (tab.name === targetName) {
                                var nextTab = tabs[index + 1] || tabs[index - 1];
                                if (nextTab) {
                                    activeName = nextTab.name;
                                    console.log('-----------')
                                    console.log(nextTab.path);
                                    console.log('-----------')
                                    that.$router.push({path: nextTab.path});
                                    // that.$router.push(nextTab);
                                }
                            }
                        });
                    }
                    that.theTab = activeName;
                    that.editableTabs = tabs.filter(tab => tab.name !== targetName);
                    that.tabNum-=1;
                }
            },
            tabsColor: function () {
                $("#tab-员工档案").addClass('tabs-colors');
            },
        },
        watch: {
            $route: function(){
                var i=0;
                for(i;i<this.tabNum;i++){
                    if(this.editableTabs[i].name==this.$route.name){
                        this.theTab = this.$route.name;
                        break;
                    }
                }
                if(i==this.tabNum){
                    this.editableTabs.push(this.$route);
                    this.tabNum+=1;
                    this.theTab = this.$route.name;
                }
            }
        },
        mounted: function(){
            this.init();
            this.tabsColor();
        }
    };
});