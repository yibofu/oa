define([
    'text!teamwork/component/teamwork-list.html',
    'vue',
    'jquery',
    'teamwork/common/api',
    'WebComponent/bs-date-picker',
    'teamwork/component/bs-date-pickers',
    'moment',
    // 'ELEMENT',

    'css!WebCommon/base.css',
    'css!vendor/bootstrap/css/bootstrap-datetimepicker.min.css',
    'css!vendor/font-awesome/css/font-awesome.min.css',
    'css!teamwork/component/teamwork-list.css',
    'css!vendor/element/index.css',
], function(
    tpl,
    Vue,$,
    Api,
    BsDateTimePicker,
    BsDateTimePickers,
    moment
){
    return {
        data: function(){
            return {
                tableData: {page:{}},
                multipleSelection: [],
                editShow: false,
                product: {
                    file: [],
                    oldName: []
                },
                products: {
                    file: [],
                    oldName: []
                },
                isEdit: false,
                deleteShow: false,
                deleteId: {},
                deleteNum: [],
                btnClass: 0,
                btnStatus: 0,
                workNum: 0,
                pageInfo: {
                    limit: 10,
                    page: 1,
                    totalPage: 6,
                },
                thePage: 1,
                isPageShow: false,
                isStatusShow: false,
                isPersonShow: false,
                isOperatorShow: false,
                isEmergencyShow: false,
                checkAll: false,
                isIndeterminate: true,
                operatorList: [],
                statusList: [],
                emergencyList: ['一般','紧急','十分紧急'],
                quick: false,
                quickShow: ['全部','一般','紧急','十分紧急'],
                checkInfo: {
                    acceptancetimeStar: '',
                    acceptancetimeEnd: ''
                },
                checkOperator: [{id: null, name: '全部'}],
                checkStatus: [{id: null, develop_status: '全部', statusCount: 0}],
                openOper: false,
                openDes: false,
                openStatus: false,
                openEmergency: false,
                openAcceptancetimeStar: false,
                openAcceptancetimeEnd: false,
                isCheck: false,
                id: '',
                image: '',
                isCheckStatus: false,
                isCheckPerson: false,
                updateId: {},
                btnTheNumber: 0,
                isStatusBtnsShow: true,
                filesOpen: false,
                isIndex: 1,
                filesNumber: 0,
                lookShow: false,
                lookCon: ['全部','关闭'],
                lookConNow: '全部',
                header: []
            }
        },
        methods: {
            changeLookShow: function () {
                  this.lookShow = !this.lookShow;
            },
            filesShow: function (index) {
                var arr = '';
                this.product.file.push(arr);
                this.product.oldName.push(arr);
                // this.products = this.product;
                this.$set(this.products.file, index, this.product.file[index]);
                this.$set(this.products.oldName, index, this.product.oldName[index]);
            },
            takeFiles:function () {
                var that = this;
                that.filesOpen = true;
                if(that.product.file.length===0){
                    var arr = '';
                    that.product.file.push(arr);
                    that.product.oldName.push(arr);
                }
                this.products = this.product;
            },
            closeFiles: function () {
                var that = this;
                that.filesOpen = false;
                var len = that.product.file.length;
                var aaa = [];
                var bbb = [];
                for(var i=0;i<len;i++){
                    if(that.product.file[i].length>0){
                        aaa.push(that.product.file[i]);
                        bbb.push(that.product.oldName[i]);
                    }
                }
                that.product.file = aaa;
                that.product.oldName = bbb;
                if(that.product.file!=[]){
                    that.filesNumber = that.product.file.length;
                }
                that.products = that.product;
                console.log(that.product.file);
            },
            getClosedList: function () {
                var _this = this;
                Api.getClosedList.ajax({pages: _this.pageInfo.limit,pageNum: _this.pageInfo.page})
                    .done(function(data){
                        $(".ischecked").removeClass("is-checked");
                        _this.deleteId = {};
                        _this.updateId = {};
                        _this.tableData = data;
                        lens = _this.tableData.result.length;
                        for(var j=0;j<lens;j++){
                            _this.tableData.result[j].checked = false;
                        }
                        _this.workNum = parseInt(_this.tableData.page.totalRows);
                        _this.checkStatus[0].statusCount = _this.workNum;
                        _this.pageInfo.totalPage = data.page.totalPages;
                    });
            },
            clearTime: function () {
                this.checkInfo.acceptancetimeStar = '';
                this.checkInfo.acceptancetimeEnd = '';
            },
            openQuick: function () {
                this.quick = !this.quick;
                this.openDes = false;
                this.openOper = false;
                this.openStatus = false;
                this.openAcceptancetimeStar = false;
            },
            openDespel: function () {
                this.openDes = !this.openDes;
                this.quick = false;
                this.openOper = false;
                this.openStatus = false;
                this.openAcceptancetimeStar = false;
            },
            openOperator: function () {
                this.openOper = !this.openOper;
                this.quick = false;
                this.openDes = false;
                this.openStatus = false;
                this.openAcceptancetimeStar = false;
            },
            openStatusList: function () {
                this.openStatus = !this.openStatus;
                this.openOper = false;
                this.quick = false;
                this.openDes = false;
                this.openAcceptancetimeStar = false;
            },
            closeQuick: function (num,item,index) {
                if(num==1){
                    if(index!=0){
                        this.checkInfo.emergency = item;
                    }else {
                        this.checkInfo.emergency = '';
                    }
                }else if(num==2){
                    if(index!=0){
                        this.checkInfo.designatedPersonName = item.name;
                        this.checkInfo.designatedPerson = item.id;
                    }else {
                        this.checkInfo.designatedPersonName = '';
                        this.checkInfo.designatedPerson = '';
                    }
                }else if(num==3){
                    if(index!=0){
                        this.checkInfo.operator = item.name;
                        this.checkInfo.operator_name = item.id;
                    }else {
                        this.checkInfo.operator = '';
                        this.checkInfo.operator_name = '';
                    }
                }else if(num==4){
                    if(index!=0){
                        this.checkInfo.statusInfo = item.develop_status;
                        this.checkInfo.status = item.id;
                    }else {
                        this.checkInfo.statusInfo = '';
                        this.checkInfo.status = '';
                    }
                }
                this.quick = false;
                this.openOper = false;
                this.openDes = false;
                this.openStatus = false;
            },
            onCheck: function () {
                var _this = this;
                var info = {};
                info = _this.checkInfo;
                if(_this.checkInfo.acceptancetimeStar.length>0&&
                    _this.checkInfo.acceptancetimeEnd.length==0){
                    return alert("请选择结束时间");
                }else if(_this.checkInfo.acceptancetimeEnd.length>0&&
                    _this.checkInfo.acceptancetimeStar.length==0){
                    return alert("请选择开始时间");
                }
                info.pages = _this.pageInfo.limit;
                console.log(info);
                if(_this.btnTheNumber==0){
                    Api.getTeamworkList.ajax(info)
                        .done(function(data){
                            // data = JSON.parse(data);
                            $(".ischecked").removeClass("is-checked");
                            _this.deleteId = {};
                            _this.updateId = {};
                            _this.tableData = data;
                            console.log(data);
                            _this.tableData = data;
                            lens = _this.tableData.result.length;
                            for(var j=0;j<lens;j++){
                                _this.tableData.result[j].checked = false;
                            }
                            _this.workNum = parseInt(_this.tableData.page.totalRows);
                            _this.pageInfo.totalPage = data.page.totalPages;
                        });
                }else if(_this.btnTheNumber==3){
                    this.getClosedList();
                }
            },
            timestampToTime: function(timestamp) {
                var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                var Y = date.getFullYear() + '-';
                var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                var D = date.getDate() + ' ';
                return Y+M+D;
            },
            teamworkEdit: function (id) {
                var _this = this;
                _this.btnStatus = 0;
                _this.isEdit = false;
                _this.editShow = true;
                Api.getTeamworkInfo.ajax({id: id})
                    .done(function(data){
                        // data = JSON.parse(data);
                        console.log(data);
                        _this.product = data;
                        if(_this.product.file==null){
                            _this.product.file = [];
                            _this.product.oldName = [];
                            // _this.product.file[0] = '';
                        }else {
                            if(_this.product.file.length>0){
                                _this.filesNumber = _this.product.file.length;
                            }
                        }
                        // if(_this.product.file.length==0){
                        //     _this.product.file = [];
                        // }
                        _this.product.designatedPersonName = _this.product.designatedPerson;
                        _this.product.operator = _this.product.operator_name;
                        _this.product.statusInfo = _this.product.status;
                        var len = _this.operatorList.length;
                        for(var n=0;n<len;n++){
                            if(_this.product.designatedPerson==_this.operatorList[n].name){
                                _this.product.designatedPerson = _this.operatorList[n].id;
                            }
                            if(_this.product.operator_name==_this.operatorList[n].name){
                                _this.product.operator_name = _this.operatorList[n].id;
                            }
                        }
                        var lens = _this.statusList.length;
                        for(var m=0;m<lens;m++){
                            if(_this.product.status==_this.statusList[m].develop_status){
                                _this.product.status = _this.statusList[m].id;
                            }
                        }
                        _this.products = _this.product;
                    });
            },
            teamworkDelete: function (num) {
                this.deleteShow = true;
                var pid = parseInt(this.tableData.result[num].id);
                this.deleteId.id = pid;
                // this.deleteNum.push(num);
                  // this.tableData.splice(num,1);
            },
            teamworksDelete: function () {
                if(this.deleteId.id){
                    this.deleteShow = true;
                }else {
                    alert("请选择想要删除的数据")
                }
            },
            doDelete: function () {
                var that = this;
                // that.deleteNum.forEach(function (t) {
                //     that.tableData.result.splice(t,1);
                // });
                Api.deleteTeamworkInfo.ajax(that.deleteId)
                    .done(function(data){
                        alert("删除成功");
                    });
                this.getList();
                that.deleteId = {};
                that.updateId = {};
                that.deleteNum = [];
                that.deleteShow = false;
            },
            closeDelete: function () {
                this.deleteId = {};
                this.updateId = {};
                this.deleteNum = [];
                this.deleteShow = false;
            },
            doEdit: function () {
                var _this = this;
                if(!_this.product.submitter){
                    return alert("请填写提交人");
                }else if(!_this.product.status){
                    return alert("请选择状态");
                }else if(!_this.product.demand_name){
                    return alert("请填写需求名称");
                }else if(!_this.product.describe){
                    return alert("请填写需求描述");
                }else if(!_this.product.designatedPerson){
                    return alert("请选择指派人");
                }else if(!_this.product.emergency){
                    return alert("请选择优先级");
                }else if(!_this.product.acceptancetime){
                    return alert("请选择预计验收时间");
                }else if(!_this.product.operator_name){
                    return alert("请选择操作人");
                }
                this.isEdit = false;
                this.editShow = false;
                console.log("后面就是");
                console.log(_this.product.file);
                console.log(_this.product);
                console.log("前面就是");
                if(_this.product.id){
                    Api.updateTeamworkInfo.ajax(_this.product)
                        .done(function(data){
                            alert("修改成功");
                        });
                }else {
                    Api.addTeamworkList.ajax(_this.product)
                        .done(function(data){
                            alert("创建成功");
                        });
                }
                this.product = {
                    file: [],
                    oldName: []
                };
                this.products = this.product;
                this.getList();
            },
            closeInfo: function () {
                this.isStatusShow = false;
                this.isPersonShow = false;
                this.isOperatorShow = false;

                this.isEdit = false;
                this.editShow = false;
                this.product = {
                    file: [],
                    oldName: []
                }
                this.products = {
                    file: [],
                    oldName: []
                }
            },
            btnEdit: function () {
                this.btnStatus = 1;
                this.isEdit = true;
            },
            productNew: function () {
                this.btnStatus = 2;
                this.isEdit = true;
                this.editShow = true;
                this.product.file = [];
                this.product.file[0] = '';
                this.product.oldName = [];
                this.product.oldName[0] = '';

                this.products = this.product;
            },
            getList: function () {
                // alert(222);
                var _this = this;
                var lens;
                Api.getTeamworkList.ajax({pages: _this.pageInfo.limit,pageNum: _this.pageInfo.page})
                    .done(function(data){
                        // data = JSON.parse(data);
                        console.log(data);
                        _this.tableData = data;
                        lens = _this.tableData.result.length;
                        for(var j=0;j<lens;j++){
                            _this.tableData.result[j].checked = false;
                        }
                        _this.workNum = parseInt(_this.tableData.page.totalRows);
                        _this.checkStatus[0].statusCount = _this.workNum;
                        _this.pageInfo.totalPage = data.page.totalPages;
                    });
            },
            getPeopleList: function () {
                var _this = this;
                Api.getOperatorList.ajax()
                    .done(function(data){
                        _this.operatorList = data;
                        for(var k=0;k<_this.operatorList.length;k++){
                            console.log(_this.operatorList[k]);
                            _this.checkOperator.push(_this.operatorList[k]);
                        }
                    });
            },
            getStatusList: function () {
                var _this = this;
                Api.getTeamworkStatus.ajax()
                    .done(function(data){
                        _this.statusList = data.result;
                        for(var a=0;a<_this.statusList.length;a++){
                            _this.checkStatus.push(_this.statusList[a]);
                        }
                    });
            },
            chooseBtn: function (n) {
                var _this = this;
                _this.btnClass = n;
                _this.btnStatus = 0;
                _this.btnTheNumber = n;
                if(n==0){
                    _this.isStatusBtnsShow = true;
                    this.getList();
                }else if(n==1){
                    _this.isStatusBtnsShow = false;
                    this.getClosedList();
                }
                _this.lookShow = false;
                _this.lookConNow = _this.lookCon[n];
            },
            statusBtn: function (n,id) {
                var _this = this;
                _this.btnStatus = n;
                _this.checkInfo = {
                    acceptancetimeStar: '',
                    acceptancetimeEnd: ''
                };
                var info = {};
                info.status = id;
                info.pages = _this.pageInfo.limit;
                console.log(info);
                Api.getTeamworkList.ajax(info)
                    .done(function(data){
                        // data = JSON.parse(data);
                        console.log(data);
                        _this.tableData = data;
                        _this.workNum = parseInt(data.page.totalRows);
                        _this.pageInfo.totalPage = data.page.totalPages;
                    });
            },
            pageShow: function (m) {
                var _this = this;
                _this.pageInfo.limit = m;
                _this.isPageShow = !_this.isPageShow;
                _this.getList();
            },
            statusShow: function (id,status) {
                var _this = this;
                _this.product.status = id;
                _this.product.statusInfo = status;
                _this.isStatusShow = false;
            },
            operatorShow: function (id,name) {
                var _this = this;
                _this.product.operator_name = id;
                _this.product.operator = name;
                _this.isOperatorShow = false;
            },
            personShow: function (id,name) {
                var _this = this;
                _this.product.designatedPerson = id;
                _this.product.designatedPersonName = name;
                _this.isPersonShow = !_this.isPersonShow;
            },
            emergencyShow: function (item) {
                var _this = this;
                _this.product.emergency = item;
                _this.isEmergencyShow = false;
            },
            changePageShow: function () {
                var _this = this;
                _this.isPageShow = !_this.isPageShow;
            },
            chooseStatus: function () {
                var _this = this;
                if(_this.isEdit){
                    _this.isStatusShow = !_this.isStatusShow;
                }
                _this.isPersonShow = false;
                _this.isOperatorShow = false;
                _this.isEmergencyShow = false;
            },
            choosePerson: function () {
                var _this = this;
                if(_this.isEdit){
                    _this.isPersonShow = !_this.isPersonShow;
                }
                _this.isStatusShow = false;
                _this.isOperatorShow = false;
                _this.isEmergencyShow = false;
            },
            chooseOperator: function () {
                var _this = this;
                if(_this.isEdit){
                    _this.isOperatorShow = !_this.isOperatorShow;
                }
                _this.isStatusShow = false;
                _this.isPersonShow = false;
                _this.isEmergencyShow = false;
            },
            chooseEmergency: function () {
                var _this = this;
                if(_this.isEdit){
                    _this.isEmergencyShow = !_this.isEmergencyShow;
                }
                _this.isStatusShow = false;
                _this.isPersonShow = false;
                _this.isOperatorShow = false;
            },
            prevPage: function () {
                var _this = this;
                if(_this.thePage==1){
                    return;
                }else {
                    _this.thePage-=1;
                    _this.pageInfo.page -= 1;
                }
                if(_this.btnTheNumber==0){
                    this.getList();
                }else if(_this.btnTheNumber==3){
                    this.getClosedList();
                }
                $(".ischecked").removeClass("is-checked");
                _this.deleteId = {};
                _this.updateId = {};
            },
            nextPage: function () {
                var _this = this;
                if(_this.thePage==_this.pageInfo.totalPage){
                    return;
                }else {
                    _this.thePage+=1;
                    _this.pageInfo.page += 1;
                }
                if(_this.btnTheNumber==0){
                    this.getList();
                }else if(_this.btnTheNumber==3){
                    this.getClosedList();
                }
                $(".ischecked").removeClass("is-checked");
                _this.deleteId = {};
                _this.updateId = {};
            },
            toThePage: function (item) {
                var _this = this;
                _this.thePage = item;
                _this.pageInfo.page = item;
                if(_this.btnTheNumber==0){
                    this.getList();
                }else if(_this.btnTheNumber==3){
                    this.getClosedList();
                }
                $(".ischecked").removeClass("is-checked");
                _this.deleteId = {};
                _this.updateId = {};
            },
            handleCheckAllChange: function(val) {
                var that = this;
                that.checkAll = !that.checkAll;
                var len = that.tableData.result.length;
                if(that.checkAll){
                    that.deleteNum = that.tableData.result.id;
                    var arr = that.tableData.result;
                    for(var i=0;i<len;i++){
                        var pid;
                        // pid = parseInt(that.tableData.result[i].id);
                        if(i==0){
                            that.deleteId = {id: that.tableData.result[i].id};
                        }
                        else {
                            pid = that.deleteId.id + ',' + that.tableData.result[i].id;
                            that.deleteId = {id: pid};
                        }
                    }
                    $(".ischecked").addClass("is-checked");
                }else {
                    $(".ischecked").removeClass("is-checked");
                    that.deleteId = {};
                }
                that.updateId = that.deleteId;
            },
            handleCheckedCitiesChange: function(id,index) {
                var that = this;
                if(that.checkAll){
                    that.checkAll = false;
                }
                var isChecked = that.tableData.result[index].checked;
                if($('.ischecked').eq(index).hasClass('is-checked')){
                    $('.ischecked').eq(index).removeClass('is-checked');
                    var array = [];
                    // alert(id);
                    array = that.deleteId.id.split(',');
                    var a = array.indexOf(id);
                    // alert('a='+a);
                    array.splice(a,1);
                    that.deleteId.id = array.join(',');
                }else {
                    if(that.deleteId.id){
                        that.deleteId.id = that.deleteId.id + ',' + id;
                    }else {
                        that.deleteId.id = id;
                    }
                    $('.ischecked').eq(index).addClass('is-checked');
                }
                this.isAllCheck();
                that.updateId = that.deleteId;
                // alert(index);
            },
            isAllCheck: function () {
                var _this = this;
                var array = [];
                // alert(id);
                array = _this.deleteId.id.split(',');
                var len = array.length;
                console.log(len);
                if(len==10){
                    _this.checkAll = true;
                }
            },
            preview: function(index){
                // alert(index);
                var _this = this;
                console.log(_this.product.file);

                var files = document.getElementsByClassName('giveFile')[index].files[0];
                console.log(files);
                if(files){
                    var formData = new FormData();
                    formData.append("file", files);
                    Api.getFileUpload.ajaxPromise(formData,{type: 'POST', processData: false,
                        contentType: false})
                        .done(function (data) {
                            _this.product.file[index] = data.file.file;
                            _this.product.oldName[index] = data.file.name;
                            console.log(_this.product);
                            // _this.product.file = _this.product.file;
                            // _this.product.oldName = _this.product.oldName;
                            // _this.product.file.sort();
                            // _this.product.oldName.sort();

                            _this.$set(_this.products.file, _this.product.file);
                            _this.$set(_this.products.oldName, _this.product.oldName);
                            // _this.$set(_this.products, _this.product.oldName);
                            // _this.$set(_this.products, index, _this.product[index]);
                            // _this.products =  [..._this.product];;
                        });
                }
            },
            downloadInfo: function (id,index) {
                Api.getDownload.ajax({id: id})
                    .done(function(data){
                        console.log(data[index]);
                        window.location.href = 'http://' + data[index];
                    });
            },
            updateStatus: function () {
                var _this = this;
                _this.isCheckStatus = !_this.isCheckStatus;
            },
            takeStatus: function (status,statusInfo,index) {
                if(index!=0){
                    this.updateId.status = status;
                    this.updateId.statusInfo = statusInfo;
                }else {
                    this.updateId.status = '';
                    this.updateId.statusInfo = '';
                }
                this.isCheckStatus = false;
            },
            updatePerson: function () {
                var _this = this;
                _this.isCheckPerson = !_this.isCheckPerson;
            },
            takePerson: function (designatedPerson,designatedPersonName,index) {
                if(index!=0){
                    this.updateId.designatedPerson = designatedPerson;
                    this.updateId.designatedPersonName = designatedPersonName;
                }else {
                    this.updateId.designatedPerson = '';
                    this.updateId.designatedPersonName = '';
                }
                this.isCheckPerson = false;
            },
            doUpdates: function () {
                var _this = this;
                Api.updateThose.ajax(_this.updateId)
                    .done(function(data){
                        $(".ischecked").removeClass("is-checked");
                        _this.deleteId = {};
                        _this.updateId = {};
                    });
                if(_this.btnTheNumber==0){
                    this.getList();
                }else if(_this.btnTheNumber==3){
                    this.getClosedList();
                }
            },
            doCloseThose: function () {
                var _this = this;
                Api.closeThose.ajax(_this.deleteId)
                    .done(function(data){
                        $(".ischecked").removeClass("is-checked");
                        _this.deleteId = {};
                        _this.updateId = {};
                    });
                if(_this.btnTheNumber==0){
                    this.getList();
                }else if(_this.btnTheNumber==3){
                    this.getClosedList();
                }
            },
            doCancelClosedThose: function () {
                var _this = this;
                Api.cancelClosedThose.ajax(_this.deleteId)
                    .done(function(data){
                        $(".ischecked").removeClass("is-checked");
                        _this.deleteId = {};
                        _this.updateId = {};
                    });
                if(_this.btnTheNumber==0){
                    this.getList();
                }else if(_this.btnTheNumber==3){
                    this.getClosedList();
                }
            }
        },
        template: tpl,
        props: {},
        components: {
            BsDateTimePicker: BsDateTimePicker,
            BsDateTimePickers: BsDateTimePickers
        },
        computed: {},
        mounted: function(){
            this.getStatusList();
            this.getPeopleList();
            this.getList();
        },
        filters: {
            dateFormat: function(str){
                return str ? moment(str).format('YYYY-MM-DD') : '';
            }
        }
    };
});