define([
    'text!staff/component/staff-con.html',
    'staff/common/api',

    'staff/component/staff-list',
    'staff/staff-add/staff-add',
    'staff/staff-info/staff-info',
    'jquery',
    'css!staff/component/staff-con.css'
], function(
    tpl,
    Api,
    StaffList,
    StaffAdd,
    StaffInfo,
    $
){

    return {
        template: tpl,
        data: function(){
            return {
                btnText:'button',
                activeName: '3',
                staffPage: 0,
                departmentList: [],//部门列表
                departments: [],
                editId: '',
                all: '',//全部
                departure: '',//离职
                formal: '',//正式
                trial: '',//试用

            };
        },
        components: {
            StaffList: StaffList,
            StaffAdd: StaffAdd,
            StaffInfo: StaffInfo
        },
        computed: {
            sidebar: function() {
                // return this.$store.state.app.sidebar
            }
        },
        created: function () {
            var obj = this;


        },
        methods: {
            init: function () {
                var that = this;
                Api.personnelStatusApi.ajax()
                    .done(function(data){
                        console.log(data);
                        that.all = data.all;
                        that.departure = data.departure;
                        that.formal = data.formal;
                        that.trial = data.trial;
                    });
            },
            getDepartmentsList: function () {//获取部门列表
                var that = this;
                Api.getAllDepartmentList.ajax()
                    .done(function(data){
                        // that.departments.push(data);
                        that.departmentList = data;
                        console.log(data);
                    });
            },
            handleClick: function(tab, event) { //点击状态栏的回调
                var that = this;
                console.log(tab, event);
                if(that.$refs.lists.info.status!=tab.name){
                    if(tab.name=='3'){
                        that.$refs.listo.info.status = '';
                        that.$refs.lists.info.status = '';
                        that.$refs.listt.info.status = '';
                        that.$refs.listf.info.status = '';
                    }else {
                        that.$refs.listo.info.status = tab.name;
                        that.$refs.lists.info.status = tab.name;
                        that.$refs.listt.info.status = tab.name;
                        that.$refs.listf.info.status = tab.name;
                    }
                }
            },
            handleNodeClick: function (data) { //点击部门树的回调
                var that = this;
                console.log(data)
                if(that.$refs.lists.info.department_id!=data.id){
                    that.$refs.listo.info.department_id = data.id;
                    that.$refs.lists.info.department_id = data.id;
                    that.$refs.listt.info.department_id = data.id;
                    that.$refs.listf.info.department_id = data.id;
                    that.activeName = '3';
                    that.$refs.listo.info.status = '';
                    that.$refs.lists.info.status = '';
                    that.$refs.listt.info.status = '';
                    that.$refs.listf.info.status = '';
                }
                Api.personnelStatusApi.ajax({department_id: data.id})
                    .done(function(data){
                        console.log(data);
                        that.all = data.all;
                        that.departure = data.departure;
                        that.formal = data.formal;
                        that.trial = data.trial;
                    });
            },
            toAddStaff: function () {
                this.$router.push({path: '/staff-operation',query:{isAdd: 1}});
            }
        },
        watch: {
            // staffPage: function () {
            //     var that = this;
            //     if(that.staffPage==0){
            //         that.init();
            //     }
            // }
        },
        mounted: function(){
            this.init();
            this.getDepartmentsList();
        }
    };
});