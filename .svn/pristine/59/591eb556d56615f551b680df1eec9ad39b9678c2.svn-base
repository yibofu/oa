define([
    'text!enum/social-security-place/component/add-social-security-place.html',
    'enum/social-security-place/common/api',
    'jquery',

    'css!enum/social-security-place/component/add-social-security-place.css'
], function(
    tpl,
    Api,
    $
){
    return {
        template: tpl,
        data: function(){
            return {
                whichBtn: '',
                isShow: false,
                editWhich: ''
            }
        },
        methods: {
            checkBtn: function (index) {
                if(index==1){
                    alert(1)
                }
                this.isShow = false;
                this.whichBtn = '';
                this.editWhich = '';
            },
        },
        watch: {
            editWhich: function () {
                if(!this.isShow&&this.editWhich!=''){
                    this.isShow = true;
                }
            }
        },
        mounted: function(){

        }
    };
});