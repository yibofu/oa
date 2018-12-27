define([
    'text!teamwork/component/teamwork-list.html',
    'vue',
    'jquery',
    'dataTables',
    'api',
    'component/bs-date-picker.js',
    'moment',
    // 'ELEMENT',
    'https://unpkg.com/element-ui/lib/index.js',

    'css!/Application/Manage/View/common/base.css',
    'css!/Application/Manage/View/vendor/bootstrap/css/bootstrap-datetimepicker.min.css',
    'css!vendor/font-awesome/css/font-awesome.min.css',
    'css!teamwork/component/teamwork-list.css',
    'css!/Application/Manage/View/vendor/DataTables/media/css/jquery.dataTables.min.css',
    'css!https://unpkg.com/element-ui/lib/theme-chalk/index.css'
], function(
    tpl,
    Vue,$,
    dataTables,
    Api,
    BsDateTimePicker,
    moment

){
    return {
        data: function(){
            return {
                tableData: {},
                multipleSelection: [],
                editShow: false,
                product: {},
                isEdit: false,
                btnStatus: 0,
                deleteShow: false,
                deleteId: {},
                deleteNum: [],
                btnClass: 0,
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
                checkAll: false,
                isIndeterminate: true,
                operatorList: [],
                statusList: [],
                quick: false,
                quickShow: ['全部','一般','紧急','非常紧急'],
                checkInfo: {},
                checkOperator: [{id: null, name: '全部'}],
                checkStatus: [{id: null, name: '全部'}],
                openOper: false,
                openDes: false,
                isCheck: false,
            }
        },
        methods: {
            openQuick: function () {
                this.quick = !this.quick;
                this.openDes = false;
                this.openOper = false;
            },
            openDespel: function () {
                this.openDes = !this.openDes;
                this.quick = false;
                this.openOper = false;
            },
            openOperator: function () {
                this.openOper = !this.openOper;
                this.quick = false;
                this.openDes = false;
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
                }
                this.quick = false;
                this.openOper = false;
                this.openDes = false;
            },
            onCheck: function () {
                var _this = this;
                var info = {};
                info = _this.checkInfo;
                info.pages = _this.pageInfo.limit;
                console.log(info);
                Api.getTeamworkList.ajax(info)
                    .done(function(data){
                        // data = JSON.parse(data);
                        console.log(data);
                        _this.tableData = data;
                        lens = _this.tableData.result.length;
                        for(var j=0;j<lens;j++){
                            _this.tableData.result[j].checked = false;
                        }
                        _this.workNum = parseInt(_this.tableData.page.totalRows);
                        _this.pageInfo.totalPage = data.page.totalPages;
                    });
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
                that.deleteNum = [];
                that.deleteShow = false;
            },
            closeDelete: function () {
                this.deleteId = {};
                this.deleteNum = [];
                this.deleteShow = false;
            },
            doEdit: function () {
                var _this = this;
                // if(_this.product)
                this.isEdit = false;
                this.editShow = false;
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
                this.product = {};
                this.getList();
            },
            closeInfo: function () {
                this.isEdit = false;
                this.editShow = false;
                this.product = {};
            },
            btnEdit: function () {
                this.btnStatus = 1;
                this.isEdit = true;
            },
            productNew: function () {
                this.btnStatus = 2;
                this.isEdit = true;
                this.editShow = true;
            },
            getList: function () {
                // alert(222);
                var _this = this;
                var lens;
                Api.getTeamworkList.ajax({pages: _this.pageInfo.limit})
                    .done(function(data){
                        // data = JSON.parse(data);
                        console.log(data);
                        _this.tableData = data;
                        lens = _this.tableData.result.length;
                        for(var j=0;j<lens;j++){
                            _this.tableData.result[j].checked = false;
                        }
                        _this.workNum = parseInt(_this.tableData.page.totalRows);
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
                        _this.statusList = data;
                        for(var a=0;a<_this.statusList.length;a++){
                            _this.checkStatus.push(_this.statusList[a]);
                        }
                    });
            },
            chooseBtn: function (n) {
                var _this = this;
                _this.btnClass = n;
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
                _this.isStatusShow = !_this.isStatusShow;
            },
            operatorShow: function (id,name) {
                var _this = this;
                _this.product.operator_name = id;
                _this.product.operator = name;
                _this.isOperatorShow = !_this.isOperatorShow;
            },
            personShow: function (id,name) {
                var _this = this;
                _this.product.designatedPerson = id;
                _this.product.designatedPersonName = name;
                _this.isPersonShow = !_this.isPersonShow;
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
            },
            choosePerson: function () {
                var _this = this;
                if(_this.isEdit){
                    _this.isPersonShow = !_this.isPersonShow;
                }
            },
            chooseOperator: function () {
                var _this = this;
                if(_this.isEdit){
                    _this.isOperatorShow = !_this.isOperatorShow;
                }
            },
            prevPage: function () {
                var _this = this;
                if(_this.thePage==1){
                    return;
                }else {
                    _this.thePage-=1;
                    _this.pageInfo.page -= 1;
                }
            },
            nextPage: function () {
                var _this = this;
                if(_this.thePage==_this.pageInfo.totalPage){
                    return;
                }else {
                    _this.thePage+=1;
                    _this.pageInfo.page += 1;
                }
            },
            toThePage: function (item) {
                var _this = this;
                _this.thePage = item;
                _this.pageInfo.page = item;
            },
            handleCheckAllChange: function(val) {
                var that = this;
                that.checkAll = !that.checkAll;
                var len = that.tableData.result.length;
                if(that.checkAll){
                    // that.deleteNum = that.tableData.result.id;
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
                        that.tableData.result[i].checked = true;
                    }
                }else {
                    for(var i=0;i<len;i++){
                        that.tableData.result[i].checked = false;
                    }
                    that.deleteId = {};
                }
            },
            handleCheckedCitiesChange: function(id,index) {
                var that = this;
                if(that.checkAll){
                    that.checkAll = false;
                }
                that.isCheck = that.tableData.result[index].checked;
                if(that.isCheck){
                    that.tableData.result[index].checked = false;
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
                    that.tableData.result[index].checked = true;
                }
                // alert(index);
            }
        },
        template: tpl,
        props: {},
        components: {
            BsDateTimePicker: BsDateTimePicker,
        },
        computed: {},
        mounted: function(){
            this.getList();
            this.getPeopleList();
            this.getStatusList();
        },
        filters: {
            dateFormat: function(str){
                return str ? moment(str).format('YYYY-MM-DD') : '';
            }
        }
    };

});