define([
    'vue',
    'manage/common/toast/loading.js',
    'jquery'
], function(
    Vue,
    LoadingToast,
    $
){
    var $toastOverlay = $('<div/>').appendTo('body');

    return new Vue({
        el: $toastOverlay[0],
        template: '<loading-toast v-show="loadingToast.isShow"></loading-toast>',
        components: {
            LoadingToast: LoadingToast
        },
        data: {
            loadingToast: {
                isShow: false
            }
        },
        methods: {
            showLoadingToast: function(){
                this.loadingToast.isShow = true;
            },
            hideLoadingToast: function(){
                this.loadingToast.isShow = false;
            }
        }
    });
});