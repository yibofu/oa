define([
    'vue',
    'jquery',
    'teamwork/common/api',
    'teamwork/component/teamwork-list',

    'css!WebCommon/base.css',
    'css!teamwork/teamwork.css'

], function(
    Vue,$,Api,
    TeamworkList

){
    var app = new Vue({
        data: function(){
            return {};
        },
        methods: {

        },components: {
            TeamworkList: TeamworkList,
        },
        mounted: function(){

        },
    });
    app.$mount('#app');

});