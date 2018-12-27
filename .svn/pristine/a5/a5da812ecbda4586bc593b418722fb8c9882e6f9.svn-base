define([
    'vue',
    'vueRouter',
    'ELEMENT',
    'app/routes',
    'enum/component/main',

    'css!WebCommon/base.css',
    'css!department/component/main.css',
    'css!vendor/element/index.css',

], function(
    Vue,
    VueRouter,
    ELEMENT,
    routes,
    MainPage
){
    Vue.use(ELEMENT);
    // Vue.use(VueRouter);
    //
    // var router = new VueRouter({
    //     routes: routes
    // });

    var app = new Vue({
        components: {
            MainPage: MainPage
        },
        // router: router
    });

    app.$mount('#app');

});