define([
    'vue',
    'vueRouter',
    'moment',
    'app/routes',
    'bootstrap',
], function(
    Vue,
    VueRouter,
    moment,
    routes
){

    Vue.use(VueRouter);

    var router = new VueRouter({
        routes: routes,
        linkActiveClass: 'active'
    });

    var app = new Vue({
        router: router
    });

    return {
        run: function(){
            app.$mount('#app');
        }
    };
});