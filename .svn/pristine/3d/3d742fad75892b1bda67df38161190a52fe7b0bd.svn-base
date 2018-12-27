<?php
namespace Bonus\Controller;
use Common\Controller\BaseController;
use Think\Page;
use Think\Upload;
class SpuController extends BaseController{
    //查看全部的方法
    public function getList(){
        $pages = I("pages");
        if(!$pages)  $pages = 1000;

        $model = D("model");
        $count = $model->query("select count(*) from design_spu");
        $count = $count[0][0];
        $page = new Page($count, $pages);
        $totalPages = ceil($count/$pages);
        $page->totalPages = $totalPages;

        $list =$model->query("select * from design_spu limit $page->firstRow, $page->listRows");
        $result = array(
            'page' => $page,
            'result' => $list
        );
        self::jsons($error=0,$result);
    }

    //增加工单的方法
    public function add(){

        $spu = D("Spu");
        $data = json_decode($_POST["data_json"], true);
        $result = $spu->add($data);
        self::jsons(0,$result);
    }
    public function mod(){

        $spu = D("Spu");
        $data = json_decode($_POST["data_json"], true);
        $result = $spu->save($data);
        self::jsons(0,$result);
    }
    public function get()
    {
        $spu = D("Spu");
        $data = $spu->where('id='+I('id'))->find();

        self::jsons(0,$data);
    }
    public function del()
    {
        $data = json_decode($_POST["data_json"], true);

        foreach ($data as $row)
        {
            $spu = D("Spu");
            $spu->where('id='+I('id'))->find();
            if($spu)
                $spu->delete();
        }
        self::jsons(0,$data);
    }
}