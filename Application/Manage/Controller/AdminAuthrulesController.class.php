<?php

namespace Manage\Controller;

use Common\Controller\BaseController;
use Think\Page;

class AdminAuthrulesController extends BaseController
{
    public function index()
    {
        if (I("rulename")) {
            $map['rule_name'] = I("rulename");
        }
        if (I("authid")) {
            $map['auth_id'] = I("authid");
        }

        $rules = D("AdminAuthRules");
        $pages = I("pages");
        $count = $rules->table("oa_admin_auth_rules as a")->join("oa_admin_auths as b on b.id = a.auth_id")
            ->join("oa_admin_action_names as c on c.id = a.action_name")
            ->field('a.id,a.parent_id,a.auth_id,a.rule_name,a.remarks,a.module,a.controller,a.action,b.auth_name,c.action_name')
            ->where($map)->order('a.id asc')->count();
        $page = new Page($count, $pages);
        $totalPages = ceil($count/$pages);
        $page->totalPages = $totalPages;
        $pageNum = I("post.pageNum");
        if($pageNum){
            $pageNum;
        }else{
            $pageNum = 1;
        }
        $offset = ($pageNum-1) * $pages;
        $list = $rules->table("oa_admin_auth_rules as a")->join("oa_admin_auths as b on b.id = a.auth_id")
            ->join("oa_admin_action_names as c on c.id = a.action_name")
            ->field('a.id,a.parent_id,a.auth_id,a.rule_name,a.remarks,a.module,a.controller,a.action,b.auth_name,c.action_name')
            ->where($map)->order('a.id asc')->limit($offset, $pages)->select();
        $result = array(
            'page' => $page,
            'pageNum' => $pageNum,
            'result' => $list
        );

        if($list){
            $error = 0;
        }else{
            $error = 1;
        }
        self::jsons($error,$result);
    }

    //得到所有的权限规则名称
    public function getRuleName(){
        $adminAuthRules = D("AdminAuthRules");
        $result = $adminAuthRules->field('id,auth_id,parent_id,rule_name,module,controller,action')->select();
        if($result){
            $error = 0;
        }else{
            $error = 1;
        }
        echo self::jsons($error,$result);
    }

    //管理员权限规则
    public function add()
    {
        $authrules = D("admin_auth_rules");
        $data["auth_id"] = I("post.auth_id");
        $data["rule_name"] = I("post.rule_name");
        //下拉得到
        $data["action_name"] = I("post.action_name");
        //这个url是管理员增加新的页面功能的时候需要填写的访问路径（eg  /Manage/Login/login）
        $url = I("post.url");
        $path = explode('/', $url);
        $data["module"] = $path[1];
        $data["controller"] = $path[2];
        $data["action"] = $path[3];

        //判断是否是列表方法，如果是的话就直接增加，如果不是得话就截取出module和controller来判断是属于哪一个下边的方法
        if(intval($data["action_name"])  == 1){
            $data["parent_id"] = 0;
        }else{
            $where = array(
                "module" => $data["module"],
                "controller" => $data["controller"]
            );
            $arr = $authrules->field("id,module,controller,action")->where($where)->find();
            $parentid = $arr["id"];
            $data["parent_id"] = $parentid;
        }
        $data["remarks"] = I("post.remarks");
        $data['create_time'] = formateTime();
        $datas = $authrules->create($data);
        $result = $authrules->add($datas);
        if($result){
            $error = 0;
        }else{
            $error = 1;
        }
        self::jsons($error,$result);
    }

    //得到所有的权限名称
    public function getAuthName(){
        $auths = D("admin_auths");
        $result = $auths->field('id,auth_name')->select();
        if($result){
            $error = 0;
        }else{
            $error = 1;
        }
        self::jsons($error,$result);
    }

    public function check()
    {
        $id = I("post.id");
        if ($id) {
            $rules = D("admin_auth_rules");
            $list = $rules->table("oa_admin_auth_rules as a")->join("oa_admin_action_names as b on b.id = a.action_name")
                ->field('a.id,a.parent_id,a.auth_id,a.rule_name,a.remarks,a.module,a.controller,a.action,b.action_name')->where("a.id=".$id)
                ->find();
            $data["module"] = $list["module"];
            $data['controller'] = $list['controller'];
            $data['action'] = $list['action'];
            $url = implode("/", $data);
        }
        $result = array(
            'ruleName' => $list,
            'url' => $url
        );
        if($result["ruleName"]){
            $error = 0;
        }else{
            $error = 1;
        }
        self::jsons($error,$result);
    }

    public function update()
    {
        $authrules = D("admin_auth_rules");
        $id = I("post.id");
        $data["action_name"] = I("post.action_name");
        $data["auth_id"] = I("post.authname");
        $data["rule_name"] = I("post.rulename");
        $url = I("post.url");
        $path = explode('/', $url);
        $data["module"] = $path[0];
        $data["controller"] = $path[1];
        $data["action"] = $path[2];

        if($data["action_name"]  == 1){
            $data["parent_id"] = 0;
        }else{
            $where = array(
                "module" => $data["module"],
                "controller" => $data["controller"]
            );
            $arr = $authrules->field("id,module,controller,action")->where($where)->find();
            $parentid = $arr["id"];
            $data["parent_id"] = $parentid;
        }

        $data["remarks"] = I("post.remarks");

        $datas = $authrules->create($data);
        if ($datas) {
            $result = $authrules->where('id = ' . $id)->save($datas);
        }
        if($result){
            $error = 0;
        }else{
            $error = 1;
        }
        echo self::jsons($error,$result);
    }

    public function delete()
    {

        $id = I("post.id");
        $length = strlen($id);
        $authrules = D("admin_auth_rules");
        if($length == 1){
            $where = 'id='.$id;
        }else{
            $id = array($id);
            $where = 'id in('.implode(',',$id).')';
        }
        $result=$authrules->where($where)->delete();
        if($result){
            $error = 0;
        }else{
            $error = 1;
        }
        self::jsons($error,$result);
    }
}
