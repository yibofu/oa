<?php

namespace Manage\Controller;

use Common\Controller\BaseController;
use Think\Page;

class AdminAuthsController extends BaseController
{

    public function index()
    {
        if (I("post.authname")) {
            $map['auth_name'] = I('post.authname');
        }
        $auth = D("AdminAuths");
        $count = $auth->where($map)->order('id asc')->count();
        $pages = I("pages");
        $page = new Page($count, $pages);
        $totalPages = ceil($count/$pages);
        $page->totalPages = $totalPages;
        $pageNum = I("post.pageNum");
        /*
         * $pageNum是当前页数
         * $pages是每页显示的总条数
         */
        if($pageNum){
            $pageNum;
        }else{
            $pageNum = 1;
        }
        $offset = ($pageNum-1) * $pages;
        $list = $auth->field('id,auth_name,remarks')->where($map)->order('id asc')->limit($offset, $pages)->select();

        $result = array(
            'page' => $page,
            'pageNum' => $pageNum,
            'result' => $list
        );

        self::jsons($error=0,$result);
    }

    //管理员权限表
    public function add()
    {
        $id = session("admin_id");
        $data['auth_name'] = I("post.authname");
        $data['remarks'] = I("post.remarks");
        $data['create_time'] = formateTime();
        $auths = D("admin_auths");
        $datas = $auths->create($data);
        if ($datas) {
            $result = $auths->add($datas);
            $admins = D("admins");
            $res = $admins->field('role_id')->find();
            $roleid = $res["role_id"];
            $authid = $result;
            $mapping = D("admin_role_auth_mappings");
            $daa = $mapping->create();
            $daa["role_id"] = $roleid;
            $daa["auth_id"] = $authid;
            $daa["create_time"] = formateTime();
            $result = $mapping->add($daa);
            if($result){
                $error = 0;
            }else{
                $error = 1;
            }
            self::jsons($error,$result);
        }
    }

    public function check()
    {
        $id = I("post.id");
        if ($id) {
            $auth = D("admin_auths");
            $result = $auth->field('id,auth_name,remarks')->where("id = " . $id)->find();
        }
        if($result){
            $error = 0;
        }else{
            $error = 1;
        }
        self::jsons($error,$result);
    }

    //管理员权限表修改
    public function update()
    {
        $id = I("post.id");
        $data['auth_name'] = I("post.authname");
        $data['remarks'] = I("post.remarks");
        $auths = D("admin_auths");
        $datas = $auths->create($data);
        if ($datas) {
            $result = $auths->where('id = ' . $id)->save($datas);
        }
        if($result){
            $error = 0;
        }else{
            $error = 1;
        }
        self::jsons($error,$result);
    }

    //管理员权限删除
    public function delete(){
        $id = I("post.id");
        $length = strlen($id);
        $auths = D("admin_auths");
        if($length == 1){
            $where = 'id='.$id;
        }else{
            $id = array($id);
            $where = 'id in('.implode(',',$id).')';
        }
        $result=$auths->where($where)->delete();
        if($result){
            $authrule = D("AdminAuthRules");
            $authrule->where($where)->delete();
        }
        if($result){
            $error = 0;
        }else{
            $error = 1;
        }
        self::jsons($error,$result);
    }
}
