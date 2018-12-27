define([
    'text!social-security/social-security-overpay/component/add-social-security-overpay.html',
    'social-security/social-security-overpay/common/api',
    'jquery',

    'css!social-security/social-security-overpay/component/add-social-security-overpay.css'
], function(
    tpl,
    Api,
    $,
){
    return {
        template: tpl,
        components: {
        },
        data: function(){
            return {
                value1: false,
                value2: false,
                value3: false,
                value4: false,
                value5: false,
                value6: false,
                value7: false,
                options: [{
                    value: '选项1',
                    label: '个人承担'
                }, {
                    value: '选项2',
                    label: '公司承担'
                },],
                tableData: [],
            }
        },
        methods: {
            checkBtn: function (num) {
                var that = this;
                if(num==0){
                    that.$parent.isAdd = false;
                }
            },
            tableHeaderColor: function() {
                return 'background-color: #E3F6F4;font-size: 14px;font-weight: bold;'
            },
        },
        watch: {

        },
        mounted: function(){

        }
    };
});