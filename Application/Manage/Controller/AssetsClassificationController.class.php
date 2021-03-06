<?php

namespace Manage\Controller;

use Common\Controller\BaseController;
use Think\Page;

class AssetsClassificationController extends BaseController
{
    //固定资产分类
    public function index()
    {
        $pages = I("pages");
        $assetsClassification = D("AssetsClassification");
        $count = $assetsClassification->table("oa_assets_classification as a")->join("left join oa_assets_classification as b on a.pid=b.id")
            ->join("oa_depreciation as c on c.id=a.depreciation_id")
            ->field("a.id,b.asset_class_name as pname,a.asset_class_name,a.durable_years,c.name as depreciationName,a.salvage_value,c.rate_depreciation,c.depreciation")
            ->count();

        $page = new Page($count, $pages);
        $totalPages = ceil($count / $pages);
        $page->totalPages = $totalPages;
        $pageNum = I("post.pageNum");
        /*
         * $pageNum是当前页数
         * $pages是每页显示的总条数
         */
        if ($pageNum) {
            $pageNum;
        } else {
            $pageNum = 1;
        }
        $offset = ($pageNum - 1) * $pages;
        $list = $assetsClassification->table("oa_assets_classification as a")->join("left join oa_assets_classification as b on a.pid=b.id")
            ->join("oa_depreciation as c on c.id=a.depreciation_id")
            ->field("a.id,b.asset_class_name as pname,a.asset_class_name,a.durable_years,c.name as depreciationName,a.salvage_value,c.rate_depreciation,c.depreciation")
            ->limit($offset, $pages)->select();
        $result = array(
            'page' => $page,
            'pageNum' => $pageNum,
            'result' => $list
        );
        self::jsons($error = 0, $result);
    }

    //显示所有设备名称
    public function showAssetClassName(){
        $assetsClassification = D("AssetsClassification");
        $result = $assetsClassification->field("id,asset_class_name")->select();
        if($result || $result==null){
            $error = 0;
        }else{
            $error = 1;
        }
        self::jsons($error,$result);
    }
    //显示所有计算公式
    public function showSalvageValue(){
        $depreciation = D("Depreciation");
        $result = $depreciation->field("id,name,rate_depreciation,depreciation")->select();
        if($result || $result==null){
            $error = 0;
        }else{
            $error = 1;
        }
        self::jsons($error,$result);
    }
    //增加公式
    public function addDepreciation(){
        $data["name"] = I("post.name");
        $data["rate_depreciation"] = I("post.rate_depreciation");
        $data["depreciation"] = I("post.depreciation");
        $depreciation = D("Depreciation");
        $datas = $depreciation->create($data);
        if($datas){
            $result = $depreciation->add($datas);
        }
        if($result){
            $error = 0;
        }else{
            $error = 1;
        }
        self::jsons($error,$result);
    }
    //修改公式
    public function updateDepreciation(){
        $id = I("post.id");
        $data["name"] = I("post.name");
        $data["rate_depreciation"] = I("post.rate_depreciation");
        $data["depreciation"] = I("post.depreciation");
        $depreciation = D("Depreciation");
        $datas = $depreciation->create($data);
        if($datas){
            $result = $depreciation->where("id=".$id)->save($datas);
        }
        if($result){
            $error = 0;
        }else{
            $error = 1;
        }
        self::jsons($error,$result);
    }

    //删除公式
    public function deleteDepreciation(){
        $id = I("post.id");
        $length = strlen($id);
        $depreciation = D("Depreciation");
        if ($length == 1) {
            $where = 'id=' . $id;
        } else {
            $id = array($id);
            $where = 'id in(' . implode(',', $id) . ')';
        }
        $result = $depreciation->where($where)->delete();
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //增加资产分类的方法
    public function addAssetsClassification()
    {
        //接收上级分类的id，如果为空就是0
        $data['pid'] = I("post.pid");
        if($data["pid"] == ""){
            $data["pid"] = 0;
        }
        $data['asset_class_name'] = I("post.asset_class_name");
        $data['durable_years'] = I("post.durable_years");
        //折旧计算公式表的Id
        $data['depreciation_id'] = I("post.depreciation_id");
        $data['salvage_value'] = I("post.salvage_value");
        $assetsClassification = D("AssetsClassification");
        $datas = $assetsClassification->create($data);
        if ($datas) {
            $result = $assetsClassification->add($datas);
        }
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //上传文件接口
    public function upload()
    {
        $upload = new \Think\Upload();
        $upload->maxSize = 3145728;
        $upload->exts = array('jpg', 'gif', 'png', 'jpeg', 'xlsx','xls', 'txt', 'doc', 'docx');// 设置附件上传类型
        $upload->rootPath = './Public/Uploads/';
        $upload->saveName = array('uniqid', mt_rand(1,999999).'_'.md5(uniqid()));
        $upload->subName =  array('date','Ymd');
        $info = $upload->upload();
        if (!$info) {
            $this->error($upload->getError());
        } else {
            $data = array();
            foreach ($info as $key => $file) {
                $data[$key]["file"] = "/Public/Uploads/" . $file['savepath'] . $file['savename'];
                $data[$key]["name"] = $file["name"];
            }
        }
        if ($data) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $data);
    }

    //选中一条查看的方法
    public function check()
    {
        $id = I("post.id");
        $assetsClassification = D("AssetsClassification");
        $result = $assetsClassification->table("oa_assets_classification as a")->join("left join oa_assets_classification as b on a.pid=b.id")
            ->join("oa_depreciation as c on c.id=a.depreciation_id")
            ->field("a.id,a.pid,b.asset_class_name as pname,a.asset_class_name,a.durable_years,c.name as depreciationName,a.salvage_value,a.depreciation_id,
            c.rate_depreciation,c.depreciation")->where("a.id=".$id)->find();
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //修改数据的方法
    public function update()
    {
        $id = I("post.id");
        $data['pid'] = I("post.pid");
        if($data["pid"] == ""){
            $data["pid"] = 0;
        }
        $data['asset_class_name'] = I("post.asset_class_name");
        $data['durable_years'] = I("post.durable_years");
        //折旧计算公式表的Id
        $data['depreciation_id'] = I("post.depreciation_id");
        $data['salvage_value'] = I("post.salvage_value");
        $assetsClassification = D("AssetsClassification");
        $datas = $assetsClassification->create($data);
        if ($datas) {
            $result = $assetsClassification->where("id = " . $id)->save($datas);
        }
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //删除方法
    public function delete()
    {
        $id = I("post.id");
        $length = strlen($id);
        $assetsClassification = D("AssetsClassification");
        if ($length == 1) {
            $where = 'id=' . $id;
        } else {
            $id = array($id);
            $where = 'id in(' . implode(',', $id) . ')';
        }
        $result = $assetsClassification->where($where)->delete();
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //显示位置
    public function showLocation(){
        $location = D("Location");
        $result = $location->field('id,name,is_use')->select();
        if($result || $result==null){
            $error = 0;
        }else{
            $error = 1;
        }
        self::jsons($error,$result);
    }
    //增加位置
    public function addLocation(){
        $data["name"] = I("post.name");
        $location = D("Location");
        $datas = $location->create($data);
        if($datas){
            $result = $location->add($datas);
        }
        if($result){
            $error = 0;
        }else{
            $error = 1;
        }
        self::jsons($error,$result);
    }
    //修改位置
    public function updateLocation(){
        $id = I("post.id");
        $data["name"] = I("post.name");
        $location = D("Location");
        $datas = $location->create($data);
        if($datas){
            $result = $location->where("id = ".$id)->save($datas);
        }
        if($result){
            $error = 0;
        }else{
            $error = 1;
        }
        self::jsons($error,$result);
    }
    //删除位置
    public function deleteLocation(){
        $id = I("post.id");
        $length = strlen($id);
        $location = D("Location");
        if ($length == 1) {
            $where = 'id=' . $id;
        } else {
            $id = array($id);
            $where = 'id in(' . implode(',', $id) . ')';
        }
        $result = $location->where($where." and is_use!='1'")->delete();
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }
}