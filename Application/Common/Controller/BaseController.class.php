<?php
namespace Common\Controller;
use Think\Controller;

class BaseController extends Controller{
    function formateTime($time=null, $formate='Y-m-d')
    {
        $time = is_null($time) ? time() : $time;
        return date($formate, $time);
    }

    function jsons($error,$result){
        $this->ajaxReturn(
            array('error'=>$error,
                'result'=>$result
            )
        );
    }

    //密码加密
    function password($password,$encrypt=''){
        $pwd = array();
        $pwd['encrypt'] = '';
        $pwd['password'] = md5(md5(trim($password)).$pwd['encrypt']);
        return $encrypt ? $pwd['password'] : $pwd;
    }
//    分页方法
//    function pages($count,$pages){
//        $page = new Page($count, $pages);
//        $totalPages = ceil($count/$pages);
//        $page->totalPages = $totalPages;
//        $pageNum = I("post.pageNum");
//        /*
//         * $pageNum是当前页数
//         * $pages是每页显示的总条数
//         */
//        if($pageNum){
//            $pageNum;
//        }else{
//            $pageNum = 1;
//        }
//        $offset = ($pageNum-1) * $pages;
//
//        return $arr = array(
//            "page"=>$page,
//            "pageNum"=>$pageNum,
//            "offset"=>$offset
//        );
//    }
    /*
     * $data是数据
     * $base是数据库
     */
    function adds($data=array(),$base){
        $num = count($data);
        for($i = 0; $i < $num; $i++){
            $data[$data[$i]] = $data[$i];
        }
//        $datas = D("$base")->create($data);
//        if ($datas) {
//            $result = D("$base")->add($datas);
//        }
//        if($result){
//            $error = 0;
//        }else{
//            $error = 1;
//        }
//        self::jsons($error,$result);
    }
}