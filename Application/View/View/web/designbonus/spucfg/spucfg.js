define([
    'vue',
    'ELEMENT',
    'spucfg/component/main',
    'css!spucfg/component/main.css',
    'css!vendor/element/index.css',

], function(
    Vue,
    ELEMENT,
    MainPage,
){
    Vue.use(ELEMENT);

    var app = new Vue({
        components: {
            MainPage: MainPage
        }
    });
    app.$mount('#app');

});