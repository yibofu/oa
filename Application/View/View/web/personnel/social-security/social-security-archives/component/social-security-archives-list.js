define([
    'text!social-security/social-security-archives/component/social-security-archives-list.html',
    'social-security/social-security-archives/common/api',
    'jquery',
    'social-security/social-security-archives/component/add-social-security-archives',

    'css!social-security/social-security-archives/component/social-security-archives-list.css'
], function(
    tpl,
    Api,
    $,
    AddSocialSecurityArchives
){
    return {
        template: tpl,
        components: {
            AddSocialSecurityArchives: AddSocialSecurityArchives,
        },
        data: function(){
            return {
                tableData: [],
                payLandList: [],
                householdTypeList: [],
                multipleSelection: [],
                selections: [],
                did: {id: ''}, //所选户口性质ID
                cityName: [],
                archivesStatus: {
                    status: 1,
                },
                pageInfo: {
                    limit: 10,//每页显示条数
                    page: 1,  //当前页
                    totalPage: 6, //总页数
                },
                workNum: 0, //总条数
                options: [],
                unumberShow: false,
                nameShow: false,
                cardNumberShow: false,
                departmentShow: false,
                payLandShow: false,
                householdTypeShow: false,
                payBaseShow: false,
                foudBaseShow: false,
                isFalse: false,
                pidTwo: ['29'],
                searchInfo: {
                    pages: 10,//每页显示条数
                    pageNum: 1,  //当前页
                    status: '',

                    unumber: '',//工号
                    name: '',//姓名
                    cardNumber: '',//证件号
                    department_id: '',//部门id
                    payLand: '',//社保缴纳地
                    householdType: '',//户口性质
                    socialStarTime: '',//社保起始月(开始)
                    socialEndTime: '',//社保起始月(结束)
                    fundStarTime: '',//公积金起始月(开始)
                    fundEndTime: '',//公积金起始月(结束)
                    payBase: '',//社保基数
                    foudBase: '',//公积金基数
                }
            }
        },
        methods: {
            getPayLandsList: function () {
                var that = this;
                Api.getHouseholdTypeList.ajax()
                    .done(function(data){
                        if(data){
                            var len = data.length;
                            for(var i=0;i<len;i++){
                                if(i==0){
                                    that.payLandList.push(data[i]);
                                    that.payLandList[0].label = data[0].city;
                                    that.payLandList[0].value = data[0].city;
                                }else {
                                    var lens = that.payLandList.length;
                                    for(var j=0;j<lens;){
                                        if(data[i].city==that.payLandList[j].city){
                                            break;
                                        }else {
                                            j++;
                                            var n = j;
                                        }
                                    }
                                    if(n==lens){
                                        that.payLandList.push(data[i]);
                                        that.payLandList[n].label = data[i].city;
                                        that.payLandList[n].value = data[i].city;
                                    }
                                }
                            }
                        }
                    });
            },
            getHouseholdTypesList: function () {
                var that = this;
                Api.getHouseholdApi.ajax({city: that.searchInfo.payLand})
                    .done(function(data){
                        if(data){
                            var len = data.length;
                            for(var i=0;i<len;i++){
                                if(i==0){
                                    that.householdTypeList.push(data[i]);
                                    that.householdTypeList[0].label = data[0].householdType;
                                    that.householdTypeList[0].value = data[0].householdType;
                                }else {
                                    that.householdTypeList.push(data[i]);
                                    that.householdTypeList[i].label = data[i].householdType;
                                    that.householdTypeList[i].value = data[i].householdType;
                                }
                            }
                        }
                    });
            },
            statusSocialFilesList: function () {
                var that = this;
                that.searchInfo.status = that.archivesStatus.status;
                that.searchInfo.pages = that.pageInfo.limit;
                that.searchInfo.pageNum = that.pageInfo.page;
                Api.searchSocialFilesApi.ajax(that.searchInfo)
                    .done(function(data){
                        console.log(data);
                        that.tableData = data.result;
                        that.workNum = parseInt(data.page.totalRows);
                        that.pageInfo.totalPage = data.page.totalPages;
                        that.pageInfo.page = data.pageNum;
                    });
            },
            getDepartmentTreeList: function () {
                var that = this;
                Api.getAllDepartmentList.ajax()
                    .done(function(data){
                        that.options = data;
                    });
            },
            filterHandler: function(value, row, column) {
                const property = column['property'];
                return row[property] === value;
            },
            operationData: function (info,index) {
                var that = this;
                console.log(info.id);
                that.$refs.infor.whichOne = info.id;
                if(index==1){
                    that.$refs.infor.isCheck = false;
                }else {
                    that.$refs.infor.isCheck = true;
                }
            },
            renderHeaderUnumber: function (h,info) {
                var that = this;
                return h('span', [
                    h('span', '工号'),
                    h('i',{
                        class: 'el-icon-search',
                        style: 'margin-left: 5px; cursor: pointer;',
                        on: {
                            click: function () {
                                console.log(info.column);
                                if(info.column.property=='unumber'){
                                    if(that.unumberShow){
                                        $('.unumber-title').css('display','none');
                                        $('.unumber-icon').css('display','none');
                                        that.unumberShow = !that.unumberShow;
                                        $('.unumber-title input').eq(1).val('');
                                        that.searchInfo.unumber = '';
                                        that.statusSocialFilesList();
                                    }else {
                                        $('.unumber-title').css('display','block');
                                        $('.unumber-icon').css('display','block');
                                        that.unumberShow = !that.unumberShow;
                                    }
                                }
                            }
                        }
                    }),
                    h('br'),
                    h('el-input',{
                        class: 'title-input unumber-title',
                        style: 'height: 20px;position: relative;display: none;',
                    }),
                    h('i',{
                        class: 'el-icon-search unumber-icon',
                        style: 'margin-left: 5px; cursor: pointer; position: absolute; right: 10px;bottom: 0;width: 20px;height:20px;padding-top:4px;box-sizing: border-box;display: none;',
                        on: {
                            click: function () {
                                console.log(info.column);
                                that.contentInto();
                                that.statusSocialFilesList();
                            }
                        }
                    })
                ])
            },
            renderHeaderName: function (h,info) {
                var that = this;
                return h('span', [
                    h('span', '姓名'),
                    h('i',{
                        class: 'el-icon-search',
                        style: 'margin-left: 5px; cursor: pointer;',
                        on: {
                            click: function () {
                                console.log(info.column);
                                if(info.column.property=='name'){
                                    if(that.nameShow){
                                        $('.name-title').css('display','none');
                                        $('.name-icon').css('display','none');
                                        that.nameShow = !that.nameShow;
                                        $('.name-title input').eq(1).val('');
                                        that.searchInfo.name = '';
                                        that.statusSocialFilesList();
                                    }else {
                                        $('.name-title').css('display','block');
                                        $('.name-icon').css('display','block');
                                        that.nameShow = !that.nameShow;
                                    }
                                }
                            }
                        }
                    }),
                    h('br'),
                    h('el-input',{
                        class: 'title-input name-title',
                        style: 'height: 20px;position: relative;display: none;',
                    }),
                    h('i',{
                        class: 'el-icon-search name-icon',
                        style: 'margin-left: 5px; cursor: pointer; position: absolute; right: 10px;bottom: 0;width: 20px;height:20px;padding-top:4px;box-sizing: border-box;display: none;',
                        on: {
                            click: function () {
                                console.log(info.column);
                                that.contentInto();
                                that.statusSocialFilesList();
                            }
                        }
                    })
                ])
            },
            renderHeaderCardNumber: function (h,info) {
                var that = this;
                return h('span', [
                    h('span', '证件号'),
                    h('i',{
                        class: 'el-icon-search',
                        style: 'margin-left: 5px; cursor: pointer;',
                        on: {
                            click: function () {
                                console.log(info.column);
                                if(info.column.property=='cardNumber'){
                                    if(that.cardNumberShow){
                                        $('.cardNumber-title').css('display','none');
                                        $('.cardNumber-icon').css('display','none');
                                        that.cardNumberShow = !that.cardNumberShow;
                                        $('.cardNumber-title input').eq(1).val('');
                                        that.searchInfo.cardNumber = '';
                                        that.statusSocialFilesList();
                                    }else {
                                        $('.cardNumber-title').css('display','block');
                                        $('.cardNumber-icon').css('display','block');
                                        that.cardNumberShow = !that.cardNumberShow;
                                    }
                                }
                            }
                        }
                    }),
                    h('br'),
                    h('el-input',{
                        class: 'title-input cardNumber-title',
                        style: 'height: 20px;position: relative; display: none;',
                    }),
                    h('i',{
                        class: 'el-icon-search cardNumber-icon',
                        style: 'margin-left: 5px; cursor: pointer; position: absolute; right: 10px;bottom: 0;width: 20px;height:20px;padding-top:4px;box-sizing: border-box;display: none;',
                        on: {
                            click: function () {
                                console.log(info.column);
                                that.contentInto();
                                that.statusSocialFilesList();
                            }
                        }
                    })
                ])
            },
            renderHeaderDepartment: function (h,info) {
                var that = this;
                return h('span', [
                    h('span', '部门'),
                    h('i',{
                        class: 'el-icon-search',
                        style: 'margin-left: 5px; cursor: pointer;',
                        on: {
                            click: function (e) {
                                console.log(info.column);
                                if(info.column.property=='department_name'){
                                    if(that.departmentShow){
                                        $('.cascader-info').css('display','none');
                                        that.departmentShow = !that.departmentShow;
                                        that.pidTwo = [];
                                        that.searchInfo.department_id = '';
                                        that.contentInto();
                                        that.statusSocialFilesList();
                                    }else {
                                        $('.cascader-info').css('display','block');
                                        that.departmentShow = !that.departmentShow;
                                    }
                                }
                            },
                        },
                    }),
                    h('br'),
                    h('el-cascader',{
                        // style: 'display: hidden;',
                        class: 'cascader-info',
                        attrs: {
                            ref: 'sel',
                            id: 'table-cascader',
                            style: 'height: 20px;display: none;',
                            size: 'mini',
                            options: this.options,
                            filterable: true,
                            clearable: true,
                            'change-on-select': true,
                            'show-all-levels': false,
                        },
                        on: {
                            '!click': function (e) {
                                let input = $('#table-cascader input').val();
                            },
                            input: function (event) {
                                that.pidTwo = event;
                                var num = that.pidTwo.length-1;
                                that.searchInfo.department_id = that.pidTwo[num];
                                that.contentInto();
                                that.statusSocialFilesList();
                            }
                        }
                    }),
                ])
            },
            renderHeaderPayLand: function (h,info) {
                var that = this;
                return h('span', [
                    h('span', '社保缴纳地'),
                    h('i',{
                        class: 'el-icon-search',
                        style: 'margin-left: 5px; cursor: pointer;',
                        on: {
                            click: function () {
                                console.log(info.column);
                                if(info.column.property=='payLand'){
                                    if(that.payLandShow){
                                        $('.cascader-payLand').css('display','none');
                                        that.payLandShow = !that.payLandShow;
                                        that.searchInfo.payLand = '';
                                        that.contentInto();
                                        that.statusSocialFilesList();
                                    }else {
                                        $('.cascader-payLand').css('display','block');
                                        that.payLandShow = !that.payLandShow;
                                    }
                                }
                            },
                        }
                    }),
                    h('br'),
                    h('el-cascader',{
                        // style: 'display: hidden;',
                        class: 'cascader-payLand',
                        attrs: {
                            id: 'table-payLand',
                            style: 'height: 20px;display: none;',
                            size: 'mini',
                            options: this.payLandList,
                            filterable: true,
                            clearable: true,
                            'change-on-select': true,
                            'show-all-levels': false,
                        },
                        on: {
                            '!click': function (e) {
                                let input = $('#table-payLand input').val();
                            },
                            input: function (event) {
                                that.searchInfo.payLand = event[0];
                                that.contentInto();
                                that.statusSocialFilesList();
                            }
                        }
                    }),
                ])
            },
            renderHeaderHouseholdType: function (h,info) {
                var that = this;
                return h('span', [
                    h('span', '户口性质'),
                    h('i',{
                        class: 'el-icon-search',
                        style: 'margin-left: 5px; cursor: pointer;',
                        on: {
                            click: function () {
                                console.log(info.column);
                                if(info.column.property=='householdType'){
                                    if(that.householdTypeShow){
                                        $('.cascader-householdType').css('display','none');
                                        that.householdTypeShow = !that.householdTypeShow;
                                        that.searchInfo.householdType = '';
                                        that.contentInto();
                                        that.statusSocialFilesList();
                                    }else {
                                        $('.cascader-householdType').css('display','block');
                                        that.householdTypeShow = !that.householdTypeShow;
                                    }
                                }
                            },
                        }
                    }),
                    h('br'),
                    h('el-cascader',{
                        // style: 'display: hidden;',
                        class: 'cascader-householdType',
                        attrs: {
                            id: 'table-householdType',
                            style: 'height: 20px;display: none;',
                            size: 'mini',
                            options: that.householdTypeList,
                            filterable: true,
                            clearable: true,
                            'change-on-select': true,
                            'show-all-levels': false,
                        },
                        on: {
                            '!click': function (e) {
                                let input = $('#table-householdType input').val();
                            },
                            input: function (event) {
                                that.searchInfo.householdType = event[0];
                                that.contentInto();
                                that.statusSocialFilesList();
                            }
                        }
                    }),
                ])
            },
            renderHeaderPayBase: function (h,info) {
                var that = this;
                return h('span', [
                    h('span', '社保基数'),
                    h('i',{
                        class: 'el-icon-search',
                        style: 'margin-left: 5px; cursor: pointer;',
                        on: {
                            click: function () {
                                console.log(info.column);
                                if(info.column.property=='payBase'){
                                    if(that.payBaseShow){
                                        $('.payBase-title').css('display','none');
                                        $('.payBase-icon').css('display','none');
                                        that.payBaseShow = !that.payBaseShow;
                                        $('.payBase-title input').eq(1).val('');
                                        that.searchInfo.payBase = '';
                                        that.statusSocialFilesList();
                                    }else {
                                        $('.payBase-title').css('display','block');
                                        $('.payBase-icon').css('display','block');
                                        that.payBaseShow = !that.payBaseShow;
                                    }
                                }
                            }
                        }
                    }),
                    h('br'),
                    h('el-input',{
                        class: 'title-input payBase-title',
                        style: 'height: 20px;position: relative; display: none;',
                    }),
                    h('i',{
                        class: 'el-icon-search payBase-icon',
                        style: 'margin-left: 5px; cursor: pointer; position: absolute; right: 10px;bottom: 0;width: 20px;height:20px;padding-top:4px;box-sizing: border-box;display: none;',
                        on: {
                            click: function () {
                                console.log(info.column);
                                that.contentInto();
                                that.statusSocialFilesList();
                            }
                        }
                    })
                ])
            },
            renderHeaderFoudBase: function (h,info) {
                var that = this;
                return h('span', [
                    h('span', '公积金基数'),
                    h('i',{
                        class: 'el-icon-search',
                        style: 'margin-left: 5px; cursor: pointer;',
                        on: {
                            click: function () {
                                console.log(info.column);
                                if(info.column.property=='foudBase'){
                                    if(that.foudBaseShow){
                                        $('.foudBase-title').css('display','none');
                                        $('.foudBase-icon').css('display','none');
                                        that.foudBaseShow = !that.foudBaseShow;
                                        $('.foudBase-title input').eq(1).val('');
                                        that.searchInfo.foudBase = '';
                                        that.statusSocialFilesList();
                                    }else {
                                        $('.foudBase-title').css('display','block');
                                        $('.foudBase-icon').css('display','block');
                                        that.foudBaseShow = !that.foudBaseShow;
                                    }
                                }
                            }
                        }
                    }),
                    h('br'),
                    h('el-input',{
                        class: 'title-input foudBase-title',
                        style: 'height: 20px;position: relative; display: none;',
                    }),
                    h('i',{
                        class: 'el-icon-search foudBase-icon',
                        style: 'margin-left: 5px; cursor: pointer; position: absolute; right: 10px;bottom: 0;width: 20px;height:20px;padding-top:4px;box-sizing: border-box;display: none;',
                        on: {
                            click: function () {
                                console.log(info.column);
                                that.contentInto();
                                that.statusSocialFilesList();
                            }
                        }
                    })
                ])
            },
            // renderHeaderPayAccount: function (h,info) {
            //     var that = this;
            //     return h('span', [
            //         h('span', '缴纳账户'),
            //         h('i',{
            //             class: 'el-icon-search',
            //             style: 'margin-left: 5px; cursor: pointer;',
            //             on: {
            //                 click: function () {
            //                     console.log(info.column);
            //                     if(info.column.property=='payAccount'){
            //                         if(that.foudBaseShow){
            //                             $('.payAccount-title').css('display','none');
            //                             $('.payAccount-icon').css('display','none');
            //                             that.foudBaseShow = !that.foudBaseShow;
            //                             $('.foudBase-title input').eq(1).val('');
            //                             that.searchInfo.foudBase = '';
            //                             that.statusSocialFilesList();
            //                         }else {
            //                             $('.foudBase-title').css('display','block');
            //                             $('.foudBase-icon').css('display','block');
            //                             that.foudBaseShow = !that.foudBaseShow;
            //                         }
            //                     }
            //                 }
            //             }
            //         }),
            //         h('br'),
            //         h('el-input',{
            //             class: 'title-input foudBase-title',
            //             style: 'height: 20px;position: relative; display: none;',
            //         }),
            //         h('i',{
            //             class: 'el-icon-search foudBase-icon',
            //             style: 'margin-left: 5px; cursor: pointer; position: absolute; right: 10px;bottom: 0;width: 20px;height:20px;padding-top:4px;box-sizing: border-box;display: none;',
            //             on: {
            //                 click: function () {
            //                     console.log(info.column);
            //                     that.contentInto();
            //                     that.statusSocialFilesList();
            //                 }
            //             }
            //         })
            //     ])
            // },
            // renderHeaderSocialStarting: function (h,info) {
            //     var that = this;
            //     return h('span', [
            //         h('span', '社保起始月'),
            //         h('i',{
            //             class: 'el-icon-search',
            //             style: 'margin-left: 5px; cursor: pointer;',
            //             on: {
            //                 click: function () {
            //                     console.log(info.column);
            //                     if(info.column.property=='payBase'){
            //                         if(that.payBaseShow){
            //                             $('.payBase-title').css('display','none');
            //                             $('.payBase-icon').css('display','none');
            //                             that.payBaseShow = !that.payBaseShow;
            //                             $('.payBase-title input').eq(1).val('');
            //                             that.searchInfo.payBase = '';
            //                             that.statusSocialFilesList();
            //                         }else {
            //                             $('.payBase-title').css('display','block');
            //                             $('.payBase-icon').css('display','block');
            //                             that.payBaseShow = !that.payBaseShow;
            //                         }
            //                     }
            //                 }
            //             }
            //         }),
            //         h('br'),
            //         h('el-input',{
            //             class: 'title-input payBase-title',
            //             style: 'height: 20px;position: relative; display: none;',
            //         }),
            //         h('i',{
            //             class: 'el-icon-search payBase-icon',
            //             style: 'margin-left: 5px; cursor: pointer; position: absolute; right: 10px;bottom: 0;width: 20px;height:20px;padding-top:4px;box-sizing: border-box;display: none;',
            //             on: {
            //                 click: function () {
            //                     console.log(info.column);
            //                     that.contentInto();
            //                     that.statusSocialFilesList();
            //                 }
            //             }
            //         })
            //     ])
            // },
            handleSizeChange: function (val) {//每页几条
                this.pageInfo.limit = val;
                this.pageInfo.page = 1;
                this.statusSocialFilesList();
            },
            handleCurrentChange: function (val) {//第几页
                this.pageInfo.page = val;
                this.statusSocialFilesList();
            },
            tableHeaderColor: function() {
                return 'background-color: #F7F6Fd;font-size: 14px;font-weight: bold;'
            },
            contentInto: function () {
                var that = this;
                if(that.archivesStatus.status==1){
                    var unumber = $('#pane-first .unumber-title input').eq(1).val();
                    var name = $('#pane-first .name-title input').eq(1).val();
                    var cardNumber = $('#pane-first .cardNumber-title input').eq(1).val();
                    var payBase = $('#pane-first .payBase-title input').eq(1).val();
                    var foudBase = $('#pane-first .foudBase-title input').eq(1).val();
                }else {
                    var unumber = $('#pane-second .unumber-title input').eq(1).val();
                    var name = $('#pane-second .name-title input').eq(1).val();
                    var cardNumber = $('#pane-second .cardNumber-title input').eq(1).val();
                    var payBase = $('#pane-first .payBase-title input').eq(1).val();
                    var foudBase = $('#pane-first .foudBase-title input').eq(1).val();
                }
                that.searchInfo.unumber = unumber;
                that.searchInfo.name = name;
                that.searchInfo.cardNumber = cardNumber;
                that.searchInfo.payBase = payBase;
                that.searchInfo.foudBase = foudBase;
            },
        },
        watch: {
            'archivesStatus.status': function () {
                this.pageInfo.page = 1;
                this.statusSocialFilesList();
                $('.unumber-title input').eq(1).val('');
                $('.unumber-title').css('display','none');
                $('.unumber-icon').css('display','none');
                this.unumberShow = false;
                $('.name-title input').eq(1).val('');
                $('.name-title').css('display','none');
                $('.name-icon').css('display','none');
                this.nameShow = false;
                $('.cardNumber-title input').eq(1).val('');
                $('.cardNumber-title').css('display','none');
                $('.cardNumber-icon').css('display','none');
                this.cardNumberShow = false;
                this.pidTwo = [];
                this.departmentShow = false;
            },
            'searchInfo.payLand': function () {
                var that = this;
                if(that.searchInfo.payLand){
                    that.getHouseholdTypesList();
                }else {
                    that.householdList = [];
                }
            }
        },
        mounted: function(){
            this.getPayLandsList();
            this.statusSocialFilesList();
            this.getDepartmentTreeList();
        }
    };
});