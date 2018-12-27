define([
    'text!enum/component/enum-work-number.html',
    'enum/common/api',
    'jquery',

    'css!enum/component/enum-work-number.css'
], function(
    tpl,
    Api,
    $,
    DepartmentInfo
){
    return {
        template: tpl,
        data: function(){
            return {
                options: [{
                    value: '1',
                    label: '1'
                }, {
                    value: '2',
                    label: '2'
                }, {
                    value: '3',
                    label: '3'
                }, {
                    value: '4',
                    label: '4'
                }, {
                    value: '5',
                    label: '5'
                },{
                    value: '6',
                    label: '6'
                }, {
                    value: '7',
                    label: '7'
                }, {
                    value: '8',
                    label: '8'
                }, {
                    value: '9',
                    label: '9'
                }, {
                    value: '10',
                    label: '10'
                }],
                unumber: {
                    is_auto: 2,
                    digits: '',
                    startingValue: '',
                },
                is_auto: true,
                examples: '',
                digitLength: 0,
            }
        },
        methods: {
            addDigit: function () {
                var that= this;
                if(!that.unumber.digits){
                    that.$message({
                        type: 'warning',
                        message: '请指定规则!'
                    });
                }else if(!that.unumber.startingValue){
                    that.$message({
                        type: 'warning',
                        message: '请填入起始值!'
                    });
                }else {
                    Api.addBasicApi.ajax(that.unumber)
                        .done(function(data){
                            console.log(data);
                            that.$message({
                                type: 'success',
                                message: '设置成功!'
                            });
                        });
                }
            },
            getLength: function () {
                var that = this;
                var len = that.unumber.startingValue.length;
                if(len>that.unumber.digits){
                    that.unumber.startingValue = that.unumber.startingValue.substring(0,that.unumber.digits);
                }
            }
        },
        watch: {
            'unumber.digits': function () {
                var that = this;
                that.examples = '';
                if(that.unumber.digits){
                    if(!that.unumber.startingValue){
                        that.digitLength = that.unumber.digits;
                        for(var i=0;i<that.unumber.digits;i++){
                            that.examples = '0'+that.examples;
                        }
                    }else {
                        that.digitLength = that.unumber.digits;
                        if(that.unumber.digits==1){
                            that.examples = that.unumber.startingValue;
                        }else if(that.unumber.digits>1){
                            that.examples = that.unumber.startingValue;
                            var num = that.unumber.startingValue.length
                            for(var i=0;i<that.digit-num;i++){
                                that.examples = '0'+that.examples;
                            }
                        }
                    }
                }else {
                    that.digitLength = 0;
                }
            },
            'unumber.startingValue': function () {
                var that = this;
                that.examples = '';
                if(that.unumber.digits){
                    if(that.unumber.digits==1){
                        that.examples = that.unumber.startingValue;
                    }else if(that.unumber.digits>1){
                        that.examples = that.unumber.startingValue;
                        var num = that.unumber.startingValue.length
                        for(var i=0;i<that.unumber.digits-num;i++){
                            that.examples = '0'+that.examples;
                        }
                    }
                }
            },
            is_auto: function () {
                var that = this;
                if(that.is_auto){
                    that.unumber.is_auto = 2;
                }else {
                    that.unumber.is_auto = 1;
                }
            }
        },
        mounted: function(){
            this.departmentsList();
        }
    };
});