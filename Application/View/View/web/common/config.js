requirejs.config({
    paths: {
        Web: '/Application/View/View/web',
        WebCommon: '/Application/View/View/web/common',
        WebComponent: '/Application/View/View/web/component',
        vendor: '/Application/View/View/vendor/',

        text: '/Application/View/View/vendor/requirejs/text',
        lodash: '/Application/View/View/vendor/lodash/lodash.min',

        jquery: '/Application/View/View/vendor/jquery/jquery.min',
        bootstrap: '/Application/View/View/vendor/bootstrap/js/bootstrap.bundle.min',
        dataTables: '/Application/View/View/vendor/DataTables/media/js/jquery.dataTables.min',

        bsDateTimePicker: '/Application/View/View/vendor/bootstrap/js/bootstrap-datetimepicker.min',
        bsDateRangePicker: '/Application/View/View/vendor/bootstrap/js/daterangepicker',
        momentZhCN: '/Application/View/View/vendor/moment/locale/zh-cn',

        vue: '/Application/View/View/vendor/vue/vue',
        vueRouter: '/Application/View/View/vendor/vue/vue-router.min',

        moment: '/Application/View/View/vendor/moment/moment.min',

        slick: '/Application/View/View/vendor/slick/slick',
        headroom: '/Application/View/View/vendor/headroom.js/headroom.min',

        wxLogin: '/Application/View/View/vendor/weixin/wxLogin',
        lazyLoad: '/Application/View/View/vendor/jquery-lazyload/jquery.lazyload',
        imagesloaded:'/Application/View/View/vendor/imagesloaded/imagesloaded.pkgd.min',
        masonry:'/Application/View/View/vendor/masonry/masonry',

        scrollTo: '/Application/View/View/vendor/jquery-scrollto/jquery.scrollTo',
        iScroll: '/Application/View/View/vendor/iscroll/iscroll',
        hammer: '/Application/View/View/vendor/hammerjs/hammer',
        base64: '/Application/View/View/vendor/base64/base64',

        image360: '/Application/View/View/vendor/jquery-image360/jquery.image360',
        bbq: '/Application/View/View/vendor/jquery-bbq/jquery.ba-bbq.min',
        qrcode: '/Application/View/View/vendor/jquery-qrcode/jquery.qrcode.min',

        vueLazyload: '/Application/View/View/vendor/vue-lazyload/vue-lazyload',
        ELEMENT: '/Application/View/View/vendor/element/index',

    },
    shim: {
        lazyLoad: {
            deps: ['jquery']
        },
        scrollTo: {
            deps: ['jquery']
        },
        imagesloaded: {
            deps: ['jquery']
        },
        masonry: {
            deps: ['jquery']
        },
        vueLazyload: {
            deps: ['vue']
        },
        bbq : {
            deps: ['jquery']
        },
        bsDateTimePicker: {
            exports: '$',
            deps: ['jquery', 'momentZhCN', 'css!/Application/View/View/vendor/bootstrap/css/bootstrap-datetimepicker.min.css']
        },
    },
    map: {
        '*': {
            css: '/Application/View/View/vendor/requirejs/css.min.js',

        }
    }
});