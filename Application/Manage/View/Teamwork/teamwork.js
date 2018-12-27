define([
    'vue',
    'jquery',
    'api',
    'teamwork/component/teamwork-list',

    'css!/Application/Manage/View/common/base.css',
    'css!teamwork/teamwork.css'

], function(
    Vue,$,Api,
    TeamworkList

){
    var app = new Vue({
        data: function(){
            return {
                name: 'lize',
            };
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