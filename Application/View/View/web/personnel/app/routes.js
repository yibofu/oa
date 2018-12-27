define([
    'tab-main/tab-main',

    'department/component/department-list',

    'staff/component/staff-con',
    'staff/staff-operation/staff-operation',

    'enum/component/enum-work-number',
    'enum/component/enum-position',
    'enum/rank/rank',
    'enum/recruit/recruit',
    'enum/company/company',
    'enum/education/education',
    'enum/social-security-place/social-security-place',
    'enum/social-security-account/social-security-account',

    'social-security/household-type/household-type',
    'social-security/social-security-program/social-security-program',
    'social-security/social-security-archives/social-security-archives',
    'social-security/social-security-bill/social-security-bill',
    'social-security/social-security-bill/social-security-bill-list/social-security-bill-list',
    'social-security/social-security-overpay/social-security-overpay',
    'social-security/social-security-department/social-security-department',
    'social-security/social-security-department/social-security-department-info/social-security-department-info',

    'power/role/role',
    // ,'demo/demo'
], function(
    TabMain,
    DepartmentList,
    StaffCon,
    StaffOperation,
    EnumWorkNumber,
    EnumPosition,
    Rank,
    Recruit,
    Company,
    Education,
    SocialSecurityPlace,
    SocialSecurityAccount,
    HouseholdType,
    SocialSecurityProgram,
    SocialSecurityArchives,
    SocialSecurityBill,
    SocialSecurityBillList,
    SocialSecurityOverpay,
    SocialSecurityDepartment,
    SocialSecurityDepartmentInfo,
    Role

){
    return [
        { path: '', redirect: '/department-list' },

        { path: '/tab-main', component: TabMain, name: 'tab-main' },

        { path: '/department-list', component: DepartmentList, name: '组织架构' },

        { path: '/staff-con', component: StaffCon, name: '员工档案' },
        { path: '/staff-operation', component: StaffOperation, name: '员工信息' },

        { path: '/enum-work-number', component: EnumWorkNumber, name: '工号设置' },
        { path: '/enum-position', component: EnumPosition, name: '职位设置' },
        { path: '/rank', component: Rank, name: '职级设置' },
        { path: '/recruit', component: Recruit, name: '招聘渠道设置' },
        { path: '/company', component: Company, name: '合同公司设置' },
        { path: '/education', component: Education, name: '学历设置' },
        { path: '/social-security-place', component: SocialSecurityPlace, name: '社保缴纳地' },
        { path: '/social-security-account', component: SocialSecurityAccount, name: '社保缴纳账户' },

        { path: '/household-type', component: HouseholdType, name: '户口性质' },
        { path: '/social-security-program', component: SocialSecurityProgram, name: '社保方案' },
        { path: '/social-security-archives', component: SocialSecurityArchives, name: '员工社保档案' },
        { path: '/social-security-bill', component: SocialSecurityBill, name: '社保台帐' },
        { path: '/social-security-bill-list', component: SocialSecurityBillList, name: '社保台帐明细' },
        { path: '/social-security-overpay', component: SocialSecurityOverpay, name: '社保补缴' },
        { path: '/social-security-department', component: SocialSecurityDepartment, name: '部门社保统计表' },
        { path: '/social-security-department-info', component: SocialSecurityDepartmentInfo, name: '部门社保明细' },

        { path: '/role', component: Role, name: '角色管理' },
    ];
});