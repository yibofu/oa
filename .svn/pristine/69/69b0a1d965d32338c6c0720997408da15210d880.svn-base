define([
    'text!staff/component/staff-list.html',
    'staff/common/api',

    // 'department/component/department-list',
    'jquery',
    'css!staff/component/staff-list.css'

], function(
    tpl,
    Api,

    $
){

    return {
        template: tpl,
        data: function(){
            return {
                tableData: [],
                unumber: [],
                name: [],
                department: [],
                telephone: [],
                info: {
                    department_id: '',
                    status: '',
                    pages: '',
                    pageNum: ''
                },
                workNum: 0, //总条数
                pageInfo: {
                    limit: 10,//每页显示条数
                    page: 1,  //当前页
                    totalPage: 6, //总页数
                },
            };
        },
        components: {
            // DepartmentList: DepartmentList
        },
        computed: {
        },
        created: function () {
            var obj = this;
        },
        methods: {
            init: function(){
                var that = this;
                that.info.pages = that.pageInfo.limit;
                that.info.pageNum = that.pageInfo.page;
                Api.personneStatusInformationApi.ajax(that.info)
                    .done(function(data){
                        console.log(data);
                        that.workNum = parseInt(data.page.totalRows);
                        that.pageInfo.totalPage = data.page.totalPages;
                        that.pageInfo.page = data.pageNum;
                        if(data.result){
                            that.tableData = data.result;
                            var len =data.result.length;
                            for(var i=0;i<len;i++){
                                that.unumber[i] = {
                                    text: data.result[i].unumber,
                                    value: data.result[i].unumber
                                }
                                that.name[i] = {
                                    text: data.result[i].name,
                                    value: data.result[i].name
                                }
                                that.telephone[i] = {
                                    text: data.result[i].telephone,
                                    value: data.result[i].telephone
                                }
                            }
                            that.$set(that.tableData,this.tableData);
                            that.$set(that.unumber,this.unumber);
                            that.$set(that.name,this.name);
                            that.$set(that.telephone,this.telephone);
                        }else {
                            that.tableData = [];
                            that.unumber = [];
                            that.name = [];
                            that.department = [];
                            that.telephone = [];
                        }
                    });
            },
            filterUnumber: function(value, row) {
                return row.unumber === value;
            },
            filterName: function(value, row) {
                return row.name === value;
            },
            filterDepartment: function(value, row) {
                return row.department === value;
            },
            filterTelephone: function(value, row) {
                return row.telephone === value;
            },
            formatter: function(row, column) {
                return row.address;
            },
            filterTag: function(value, row) {
                return row.tag === value;
            },
            filterHandler: function(value, row, column) {
                const property = column['property'];
                return row[property] === value;
            },
            handleClick: function (info) {
                console.log(info);
                this.$router.push({path: '/staff-operation',query:{isAdd: 0,staffId: info.id}});

            },
            handleDeleteClick: function (info) {
                var that = this;
                console.log(info);
                Api.deleteInformationApi.ajax({id: info.id})
                    .done(function(data){
                        console.log(data);
                        that.init();

                    });
            },
            handleSizeChange: function (val) {//每页几条
                this.pageInfo.limit = val;
                this.pageInfo.page = 1;
                this.init();
            },
            handleCurrentChange: function (val) {//第几页
                this.pageInfo.page = val;
                this.init();
            },
            tableHeaderColor: function() {
                return 'background-color: #F7F6Fd;font-size: 14px;font-weight: bold;'
            },
        },
        watch: {
            'info.department_id': function () {
                this.init();
            },
            'info.status': function () {
                this.init();
            }
        },
        mounted: function(){
            this.init();
        }
    };
});