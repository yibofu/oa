<?php

namespace Manage\Controller;

use Common\Controller\BaseController;
use Think\Page;

header("content-type:text/html;charset=utf-8");

class AdminActionNamesController extends BaseController
{
    public function index()
    {

        $pages = I("pages");
        $adminActionNames = D("AdminActionNames");
        $count = $adminActionNames->field('id,action_name,create_time')->count();
        $page = new Page($count, $pages);
        $totalPages = ceil($count / $pages);
        $page->totalPages = $totalPages;
        $pageNum = I("post.pageNum");
        if ($pageNum) {
            $pageNum;
        } else {
            $pageNum = 1;
        }
        $offset = ($pageNum - 1) * $pages;

        $list = $adminActionNames->field('id,action_name,create_time')->limit($offset, $pages)->select();

        $result = array(
            'page' => $page,
            'pageNum' => $pageNum,
            'result' => $list
        );
        self::jsons($error = 0, $result);
    }

    //增加方法
    public function add()
    {
        if (IS_POST) {
            $data['action_name'] = I("post.action_name");
            $data['create_time'] = formateTime();
            $adminActionNames = D("AdminActionNames");
            $datas = $adminActionNames->create($data);
            if ($datas) {
                $result = $adminActionNames->add($datas);
                if ($result) {
                    $error = 0;
                } else {
                    $error = 1;
                }
            }
            echo self::jsons($error, $result);
        }
    }

    public function check()
    {
        $id = I("post.id");
        $adminActionNames = D("AdminActionNames");
        $result = $adminActionNames->field('id,action_name,create_name')->where("id=" . $id)->find();
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        echo self::jsons($error, $result);
    }

    public function update()
    {
        if (IS_POST) {
            $id = I("post.id");
            $data['action_name'] = I("post.action_name");
            $adminActionNames = D("AdminActionNames");
            $datas = $adminActionNames->create($data);
            $result = $adminActionNames->where("id = " . $id)->save($datas);
            if ($result) {
                $error = 0;
            } else {
                $error = 1;
            }
            echo self::jsons($error, $result);
        }
    }

//删除
public function delete()
{
    $id = I("post.id");
    $length = strlen($id);
    $adminActionNames = D("AdminActionNames");
    if ($length == 1) {
        $where = 'id=' . $id;
    } else {
        $id = array($id);
        $where = 'id in(' . implode(',', $id) . ')';
    }
    $result = $adminActionNames->where($where)->delete();
    if ($result) {
        $error = 0;
    } else {
        $error = 1;
    }
    self::jsons($error, $result);
}
}
