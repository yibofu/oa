define([
    'text!department/component/department-orgchart.html',
    'department/common/api',
    'jquery',
    'vendor/orgchart-master/dist/js/jquery.orgchart.min',
    'vendor/orgchart-master/dist/js/jquery.mockjax.min',

    'css!department/component/department-orgchart.css',
    'css!vendor/vue-orgchart/dist/style.min.css',
    'css!vendor/orgchart-master/src/css/jquery.orgchart.css'
], function(
    tpl,
    Api,
    $
){
    // var datascource;
    return {
        template: tpl,
        data: function(){
            return {
                treeData: [],
                departments: [],
                transfer: [{
                    id: '',
                    label: '',
                    pid: ''
                }],
            }
        },
        methods: {
            getData: function () {
                // datascource = this.data;
            },
            departmentsList: function () {//获取部门列表
                var that = this;
                Api.getDepartmentList.ajax()
                    .done(function(data){
                        // that.departments.push(data);
                        that.departments = data;
                        console.log(data);
                        that.changeTree(data);
                    });
            },
            changeTree: function (list) {//拼接部门树
                var that = this;
                var result = list.reduce(function(initArray,item){
                    if(initArray[item.pid]){
                        initArray[item.pid].push(item)
                    }else{
                        initArray[item.pid]=[item]
                    }
                    return initArray;
                },[])
                var arr = result;
                console.log(arr[0][0]);
                that.transfer[0] = arr[0][0];
                that.transfer[0].label = arr[0][0].department_name;
                that.transfer[0].children = [];
                arr.splice(0,1);
                var num = 1;
                for(var info in arr){
                    var infos = parseInt(info);
                    // console.log(arr[infos].length)
                    if(infos+num==that.transfer[0].id){
                        for(var i=0;i<arr[infos].length;i++){
                            that.transfer[0].children[i] = arr[infos][i];
                            that.transfer[0].children[i].label = arr[infos][i].department_name;
                            that.transfer[0].children[i].children = [];
                        }
                    }
                    for(var j=0;j<that.transfer[0].children.length;j++){
                        if(infos+num==that.transfer[0].children[j].id){
                            for(var k=0;k<arr[infos].length;k++){
                                that.transfer[0].children[j].children[k] = arr[infos][k];
                                that.transfer[0].children[j].children[k].label = arr[infos][k].department_name;
                                that.transfer[0].children[j].children[k].children = [];
                            }
                        }
                    }
                }
                that.treeData = that.transfer;
            },
        },
        mounted: function(){
            this.getData();
            this.departmentsList();
        },
    };
//     var datascource = {
//         'name': 'Lao Lao',
//         'title': 'general manager',
//         // 'relationship': 001,
//         'children': [
//             { 'name': 'Bo Miao', 'title': 'department manager'/*, 'relationship': 110 */},
//             { 'name': 'Su Miao', 'title': 'department manager', /*'relationship': 111,
// */      'children': [
//                 { 'name': 'Tie Hua', 'title': 'senior engineer'/*, 'relationship': 110*/ },
//                 { 'name': 'Hei Hei', 'title': 'senior engineer'/*, 'relationship': 110*/ }
//             ]
//             },
//             { 'name': 'Yu Jie', 'title': 'department manager'/*, 'relationship': 110*/ }
//         ]
//     };
//
//     $.mockjax({
//         url: '/orgchart/initdata',
//         responseTime: 1000,
//         contentType: 'application/json',
//         responseText: datascource
//     });
//
//     $('#chart-container').orgchart({
//         'data' : '/orgchart/initdata',
//         'nodeContent': 'title',
//         'toggleSiblingsResp': false,
//         'parentNodeSymbol': 'glyphicon glyphicon-th-large',
//     });
//
//     $("#chart-container").css({"background-image": "none"})
});