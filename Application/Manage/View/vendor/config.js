requirejs.config({
    paths: {
        text: '/manage/vendor/requirejs/text',
        lodash: '/manage/vendor/lodash/lodash.min',

        jquery: '/manage/vendor/jquery/jquery.min',
        vue: '/manage/vendor/vue/vue',
        vueRouter: '/manage/vendor/vue-router/vue-router.min',
    },
    map: {
        '*': {
            css: '/manage/vendor/requirejs/css.min.js'
        }
    }
});