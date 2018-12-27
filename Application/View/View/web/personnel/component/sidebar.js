define([
    'text!component/sidebar.html',
    // '/Application/View/View/web/personnel/app/app.js'
], function(
    tpl
){
    return {
        template: tpl,
        data: function(){
            return {
                // isAdmin: Auth.isAdmin(),
                menuList: [
                    {
                        route: {
                            name: '/department-list'
                        },
                        name: '组织架构',
                        path: '/department-list',
                        children: []
                    },
                    {
                        number: 1,
                        name: '员工管理',
                        children: [{
                            number: 2,
                            route: {
                                name: '/staff-con'
                            },
                            name: '员工档案',
                            path: '/staff-con',
                        },]
                    },
                    {
                        route: {
                            name: '/staff-con'
                        },
                        name: '考勤/假期管理',
                        path: '/staff-con',
                        children: []
                    },
                    {
                        route: {
                            name: '/staff-con'
                        },
                        name: '绩效管理',
                        path: '/staff-con',
                        children: []
                    },
                    {
                        route: {
                            name: '/staff-con'
                        },
                        name: '招聘管理',
                        path: '/staff-con',
                        children: []
                    },
                    {
                        number: 3,
                        name: '社保管理',
                        children: [{
                            route: {
                                name: '/household-type'
                            },
                            name: '户口性质',
                            path: '/household-type',
                        },{
                            route: {
                                name: '/social-security-program'
                            },
                            name: '社保方案',
                            path: '/social-security-program',
                        },{
                            route: {
                                name: '/social-security-archives'
                            },
                            name: '员工社保档案',
                            path: '/social-security-archives',
                        },{
                            route: {
                                name: '/social-security-bill'
                            },
                            name: '社保台帐',
                            path: '/social-security-bill',
                        },{
                            route: {
                                name: '/social-security-overpay'
                            },
                            name: '社保补缴',
                            path: '/social-security-overpay',
                        },{
                            route: {
                                name: '/social-security-department'
                            },
                            name: '部门社保统计',
                            path: '/social-security-department',
                        },]
                    },
                    {
                        number: 2,
                        name: '枚举值管理',
                        children: [{
                            route: {
                                name: '/enum-work-number'
                            },
                            name: '工号设置',
                            path: '/enum-work-number',
                        },{
                            route: {
                                name: '/enum-position'
                            },
                            name: '职位设置',
                            path: '/enum-position',
                        },{
                            route: {
                                name: '/rank'
                            },
                            name: '职级设置',
                            path: '/rank',
                        },{
                            route: {
                                name: '/recruit'
                            },
                            name: '招聘渠道设置',
                            path: '/recruit',
                        },{
                            route: {
                                name: '/company'
                            },
                            name: '合同公司设置',
                            path: '/company',
                        },{
                            route: {
                                name: '/education'
                            },
                            name: '学历设置',
                            path: '/education',
                        },
                        //     {
                        //     route: {
                        //         name: '/social-security-place'
                        //     },
                        //     name: '社保缴纳地',
                        //     path: '/social-security-place',
                        // },
                            {
                            route: {
                                name: '/social-security-account'
                            },
                            name: '社保缴纳账户',
                            path: '/social-security-account',
                        },]
                    },
                    {
                        number: 4,
                        name: '权限管理',
                        children: [{
                            route: {
                                name: '/role'
                            },
                            name: '角色管理',
                            path: '/household-type',
                        },]
                    },
                    // {
                    //     route: {
                    //         name: '/department-list'
                    //     },
                    //     name: '组织架构',
                    //     path: '/department-list',
                    //     children: []
                    // },
                ]
            };
        },
        methods: {
            handleOpen: function(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose: function(key, keyPath) {
                console.log(key, keyPath);
            }
        }
    };
});