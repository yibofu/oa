define([
    'vue',
    'ELEMENT',
    'vueRouter',
    'app/routes',
    'component/main',

    'css!WebCommon/base.css',
    'css!component/main.css',
    'css!vendor/element/index.css',

], function(
    Vue,
    ELEMENT,
    VueRouter,
    routes,
    MainPage
){
    Vue.use(ELEMENT);
    Vue.use(VueRouter);

    var router = new VueRouter({
        routes: routes
    });

    var app = new Vue({
        components: {
            MainPage: MainPage
        },
        router: router,
        methods: {
            init: function ()
            {

            },
        },
        mounted: function(){
            this.init();
        }

    });
    app.$mount('#app');
});