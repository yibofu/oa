<?php

namespace Manage\Controller;

use Common\Controller\BaseController;
use Think\Page;
use Think\Upload;

class BasicInformationController extends BaseController
{
    //显示基本的信息
    public function index()
    {
        $departmentId = I("post.department_id");
        $pages = I("pages");
        $basicInformation = D("BasicInformation");
        if ($departmentId == "") {
            $count = $basicInformation->table("oa_basic_information as a")->join("oa_organizational_structure as b on b.id=a.department_id")
                ->field("a.id,a.name,a.unumber,b.department_name as department,a.telephone,a.workEmail")->count();
        } else {
            $count = $basicInformation->table("oa_basic_information as a")->join("oa_organizational_structure as b on b.id=a.department_id")
                ->field("a.id,a.name,a.unumber,b.department_name as department,a.telephone,a.workEmail")->where("department_id=" . $departmentId)->count();
        }
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
        if ($departmentId == "") {
            $list = $basicInformation->table("oa_basic_information as a")->join("oa_organizational_structure as b on b.id=a.department_id")
                ->field("a.id,a.name,a.unumber,b.department_name as department,a.telephone,a.workEmail")->limit($offset, $pages)->select();
        } else {
            $list = $basicInformation->table("oa_basic_information as a")->join("oa_organizational_structure as b on b.id=a.department_id")
                ->field("a.id,a.name,a.unumber,b.department_name as department,a.telephone,a.workEmail")->where("department_id=" . $departmentId)
                ->limit($offset, $pages)->select();
        }
        $result = array(
            'page' => $page,
            'pageNum' => $pageNum,
            'result' => $list
        );
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //删除信息
    public function deleteInformation()
    {

        $id = I("post.id");
        $personnelInformation = D("PersonnelInformation");
        $contract = $personnelInformation->field("id,contract_id")->where("bid=" . $id)->find();
        $contract_id = $contract["contract_id"];

        $socialParameterInformation = D("SocialParameterInformation");
        $existing = $socialParameterInformation->field('bid')->where("bid=".$id)->select();
        if($existing){
            self::jsons($error=0,$result="人员已经形成社保台账,不能删除");
        }else{
            $length = strlen($id);
            if ($length == 1) {
                $where = 'id=' . $id;
            } else {
                $id = array($id);
                $contract_id = array($contract_id);
                $where = 'id in(' . implode(',', $id) . ')';
                $whereb = 'bid in(' . implode(',', $id) . ')';
                $wherec = 'id in(' . implode(',', $contract_id) . ')';
            }
            $basicInformation = D("BasicInformation");
            $list = $basicInformation->where($where)->delete();
            if ($list) {
                $personnelInformation = D("PersonnelInformation");
                $con = $personnelInformation->where($whereb)->delete();
            }
            if ($con) {
                $socialSecurityInformation = D("SocialSecurityInformation");
                $arr = $socialSecurityInformation->where($whereb)->delete();
                //删除员工的时候要也要删除他的员工社保档案
                $socialArchives = D("SocialArchives");
                $socialArchives->where($whereb)->delete();
            }
            if ($arr) {
                $contract = D("Contract");
                $condition = $contract->where($wherec)->delete();
            }
            if ($condition) {
                $bankInformation = D("BankInformation");
                $result = $bankInformation->where($whereb)->delete();
            }
            if ($result) {
                $error = 0;
            } else {
                $error = 1;
            }
            self::jsons($error, $result);
        }
    }

    public function check()
    {
        $id = I("post.id");
        $basicInformation = D("BasicInformation");
        $result = $basicInformation->table("oa_basic_information as a")->join("left join oa_organizational_structure as b on b.id=a.department_id")
            ->join("left join oa_personnel_information as c on c.bid=a.id")->join("left join oa_education as d on d.id=c.education_id")->join("oa_contract as p on p.id=c.contract_id")
            ->join("left join oa_card as e on e.id=c.cardType_id")->join("left join oa_rank as f on f.id=c.rank_id")->join("left join oa_position as g on g.id=c.position_id")
            ->join("left join oa_source as h on h.id=c.source_id")->join("left join oa_company as i on i.id=p.company_id")
            ->join("left join oa_contract_type as j on j.id=p.contractType_id")
            ->join("left join oa_leave_type as k on k.id=p.leaveType_id")->join("left join oa_category as l on l.id=a.category_id")
            ->join("left join oa_social_security_information as m on m.bid=a.id")
            ->join("left join oa_bank_information as o on o.bid=a.id")->join("left join oa_payaccount as r on r.id=m.payAccount")
            ->field("a.id,a.name,a.uname,a.unumber,a.sex,a.leader,a.workEmail,a.telephone,a.weixin,a.ownEmail,a.birthday,a.constellation,a.qq,a.category_id,
                    l.name as category,a.national,a.married,a.native,a.photo,d.name as education,c.school,c.hobby,e.name as cardType,c.cardNumber,
                    f.name as rand,g.name as position,c.position_id,c.coreMembers,h.name as source,c.source_id,c.referees,c.hiredate,c.correctionDate,c.homeAddress,c.education_id,
                    c.cardType_id,c.rank_id,c.address,c.contactPerson,c.contactPersonPhone,c.file,c.payType,c.integral,i.name as company,j.name as contractType,p.contractStart,
                    p.signedYears,p.contractEnd,p.isRenewal_id,p.leaveDate,k.name as leaveType,p.leaveReason,c.status,c.lengthService,c.oldName,p.contractType_id,p.company_id,
                    a.department_id,b.department_name as department,m.householdType,m.payLand,m.payBase,m.foudBase,m.medical,m.pension,p.leaveType_id,
                    m.unemployment,m.fund,m.medicalTwo,m.pensionTwo, m.unemploymentTwo,m.hurted,m.birthed,m.fundTwo,o.bankCardNumber,o.openBank,
                    o.accountTitle,o.isDefault,c.lengthService,c.contract_id,m.socialStarting,m.fundStarting,r.name as payAccount")->where("a.id=" . $id)->find();

//        $payAccount = D("Payaccount");
//        $list = $payAccount->field("id,name")->select();
//        foreach ($list as $key => $value) {
//            if ($value["id"] == $result["payAccount"]) {
//                $result["payAccount"] = $value["name"];
//            }
//        }

        if($result['sex']){
            $result['sex'] == 0 ? '女' : '男';
        }
        if ($result['birthday']) {
            $result['birthday'] = date("Y-m-d", $result["birthday"]);
        } else {
            $result['birthday'] = null;
        }
        if ($result['hiredate']) {
            $result['hiredate'] = date("Y-m-d", $result["hiredate"]);
        } else {
            $result['hiredate'] = null;
        }
        if ($result['contractStart']) {
            $result['contractStart'] = date("Y-m-d", $result["contractStart"]);
        } else {
            $result['contractStart'] = null;
        }
        if ($result['contractEnd']) {
            $result['contractEnd'] = date("Y-m-d", $result["contractEnd"]);
        } else {
            $result['contractEnd'] = null;
        }
        if ($result['leaveDate']) {
            $result['leaveDate'] = date("Y-m-d", $result["leaveDate"]);
        } else {
            $result['leaveDate'] = null;
        }
        if ($result['correctionDate']) {
            $result['correctionDate'] = date("Y-m-d", $result["correctionDate"]);
        } else {
            $result['correctionDate'] = null;
        }

        if ($result['socialStarting']) {
            $result['socialStarting'] = date("Y-m", $result["socialStarting"]);
        } else {
            $result['socialStarting'] = null;
        }
        if ($result['fundStarting']) {
            $result['fundStarting'] = date("Y-m", $result["fundStarting"]);
        } else {
            $result['fundStarting'] = null;
        }

        $result["openBank"] = explode(',', $result["openBank"]);
        $result["bankCardNumber"] = explode(',', $result["bankCardNumber"]);
        $result["accountTitle"] = explode(',', $result["accountTitle"]);
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //显示员工状态
    public function personnelStatus()
    {
        $basicInformation = D("BasicInformation");
        $departmentId = I("post.department_id");
        if ($departmentId != "") {
            $organizationalStructure = D("OrganizationalStructure");
            $where['pidTwo'] = array('like', '%' . $departmentId . '%');
            $con = $organizationalStructure->field("id,pid,department_name,pidTwo")->where($where)->select();
            foreach ($con as $key => $value) {
                $arr[] = $value["id"];
            }
        }
        $arrs = implode(",", $arr);
        if ($departmentId) {
            //试用
            $trial = $basicInformation->table("oa_basic_information as a")->join("oa_personnel_information as b on b.bid=a.id")
                ->join("oa_organizational_structure as c on c.id=a.department_id")->field('a.department_id,b.id,b.cardType_id,b.status')
                ->where("a.department_id in (" . $arrs . ")" . " and b.status='4' and a.department_id != 0")->count();
            //正式
            $formal = $basicInformation->table("oa_basic_information as a")->join("oa_personnel_information as b on b.bid=a.id")
                ->join("oa_organizational_structure as c on c.id=a.department_id")->field('a.department_id,b.id,b.cardType_id,b.status')
                ->where("a.department_id in (" . $arrs . ")" . " and b.status='1' and a.department_id != 0")->count();
            //离职
            $departure = $basicInformation->table("oa_basic_information as a")->join("oa_personnel_information as b on b.bid=a.id")
                ->join("oa_organizational_structure as c on c.id=a.department_id")->field('a.department_id,b.id,b.cardType_id,b.status')
                ->where("a.department_id in (" . $arrs . ")" . " and b.status='2' and a.department_id != 0")->count();
            //兼职
            $partTime = $basicInformation->table("oa_basic_information as a")->join("oa_personnel_information as b on b.bid=a.id")
                ->join("oa_organizational_structure as c on c.id=a.department_id")->field('a.department_id,b.id,b.cardType_id,b.status')
                ->where("a.department_id in (" . $arrs . ")" . " and b.status='5' and a.department_id != 0")->count();
            //临时工
            $temporaryWorkers = $basicInformation->table("oa_basic_information as a")->join("oa_personnel_information as b on b.bid=a.id")
                ->join("oa_organizational_structure as c on c.id=a.department_id")->field('a.department_id,b.id,b.cardType_id,b.status')
                ->where("a.department_id in (" . $arrs . ")" . " and b.status='6' and a.department_id != 0")->count();
            //实习
            $internship = $basicInformation->table("oa_basic_information as a")->join("oa_personnel_information as b on b.bid=a.id")
                ->join("oa_organizational_structure as c on c.id=a.department_id")->field('a.department_id,b.id,b.cardType_id,b.status')
                ->where("a.department_id in (" . $arrs . ")" . " and b.status='7' and a.department_id != 0")->count();
            //其他
            $other = $basicInformation->table("oa_basic_information as a")->join("oa_personnel_information as b on b.bid=a.id")
                ->join("oa_organizational_structure as c on c.id=a.department_id")->field('a.department_id,b.id,b.cardType_id,b.status')
                ->where("a.department_id in (" . $arrs . ")" . " and b.status='8' and a.department_id != 0")->count();

        } else {
            $trial = $basicInformation->table("oa_basic_information as a")->join("oa_personnel_information as b on b.bid=a.id")
                ->join("oa_organizational_structure as c on c.id=a.department_id")->field('a.department_id,b.id,b.cardType_id,b.status')
                ->where("b.status='4' and a.department_id != 0")->count();
            $formal = $basicInformation->table("oa_basic_information as a")->join("oa_personnel_information as b on b.bid=a.id")
                ->join("oa_organizational_structure as c on c.id=a.department_id")->field('a.department_id,b.id,b.cardType_id,b.status')
                ->where("b.status='1' and a.department_id != 0")->count();
            $departure = $basicInformation->table("oa_basic_information as a")->join("oa_personnel_information as b on b.bid=a.id")
                ->join("oa_organizational_structure as c on c.id=a.department_id")->field('a.department_id,b.id,b.cardType_id,b.status')
                ->where("b.status='2' and a.department_id != 0")->count();
            $partTime = $basicInformation->table("oa_basic_information as a")->join("oa_personnel_information as b on b.bid=a.id")
                ->join("oa_organizational_structure as c on c.id=a.department_id")->field('a.department_id,b.id,b.cardType_id,b.status')
                ->where("b.status='5' and a.department_id != 0")->count();
            $temporaryWorkers = $basicInformation->table("oa_basic_information as a")->join("oa_personnel_information as b on b.bid=a.id")
                ->join("oa_organizational_structure as c on c.id=a.department_id")->field('a.department_id,b.id,b.cardType_id,b.status')
                ->where("b.status='6' and a.department_id != 0")->count();
            $internship = $basicInformation->table("oa_basic_information as a")->join("oa_personnel_information as b on b.bid=a.id")
                ->join("oa_organizational_structure as c on c.id=a.department_id")->field('a.department_id,b.id,b.cardType_id,b.status')
                ->where("b.status='7' and a.department_id != 0")->count();
            $other = $basicInformation->table("oa_basic_information as a")->join("oa_personnel_information as b on b.bid=a.id")
                ->join("oa_organizational_structure as c on c.id=a.department_id")->field('a.department_id,b.id,b.cardType_id,b.status')
                ->where("b.status='8' and a.department_id != 0")->count();
        }
        $all = $formal + $trial+$partTime+$temporaryWorkers+$internship+$other;
        $allCount = $all+$departure;
        $result = array(
            "all" => $all,
            "formal" => $formal,
            "trial" => $trial,
            "departure" => $departure,
            "partTime"=>$partTime,
            "temporaryWorkers"=>$temporaryWorkers,
            "internship"=>$internship,
            "other"=>$other,
            "allCount"=>$allCount
        );
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //点击显示不同部门的员工的状态和信息
    public function personneStatusInformation()
    {
        //姓名
        if (I("name")) {
            $map['a.name'] = array('like', '%' . I('name') . '%');
        }
        //证件号
        if (I("unumber")) {
            $map['a.unumber'] = array('like', '%' . I('unumber') . '%');
        }


        //部门id
        $departmentId = I("post.department_id");
        $organizationalStructure = D("OrganizationalStructure");
        if ($departmentId != "") {
            $where['pidTwo'] = array('like', '%' . $departmentId . '%');
            $con = $organizationalStructure->field("id,pid,department_name,pidTwo")->where($where)->select();
            foreach ($con as $key => $value) {
                $arr[] = $value["id"];
            }
        }
        $arrs = implode(",", $arr);
        //状态id
        $status = I("post.status");
        $pages = I("pages");

        $basicInformation = D("BasicInformation");

        if ($status && $departmentId) {
            $map["a.department_id"] = array("IN", $arrs);
            if(I("post.status") == '3'){
                $map['c.status'] = array('neq', '2');
            }else{
                $map['c.status'] = I("post.status");
            }
            $count = $basicInformation->table("oa_basic_information as a")
                ->join("oa_organizational_structure as b on b.id=a.department_id")
                ->join("oa_personnel_information as c on c.bid=a.id")
                ->field("a.id,a.name,a.unumber,b.department_name as department,a.telephone,a.workEmail,c.status,c.lengthService,a.department_id")
                ->where($map)->count();
        }

        if ($status && $departmentId == "") {
            if(I("post.status") == '3'){
                $map['c.status'] = array('neq', '2');
            }else{
                $map['c.status'] = I("post.status");
            }
            $count = $basicInformation->table("oa_basic_information as a")->join("oa_organizational_structure as b on b.id=a.department_id")
                ->join("oa_personnel_information as c on c.bid=a.id")
                ->field("a.id,a.name,a.unumber,b.department_name as department,a.telephone,a.workEmail,c.status,c.lengthService,a.department_id")
                ->where($map)->count();
        }
        if ($status == "" && $departmentId) {
            $map["a.department_id"] = array("IN", $arrs);
//            $map['c.status'] = array('neq', '2');
            $count = $basicInformation->table("oa_basic_information as a")->join("oa_organizational_structure as b on b.id=a.department_id")
                ->join("oa_personnel_information as c on c.bid=a.id")
                ->field("a.id,a.name,a.unumber,b.department_name as department,a.telephone,a.workEmail,c.status,c.lengthService,a.department_id")
                ->where($map)->count();
        }
        if ($status == "" && $departmentId == "") {
//            $map['c.status'] = array('neq', '2');
            $count = $basicInformation->table("oa_basic_information as a")->join("oa_organizational_structure as b on b.id=a.department_id")
                ->join("oa_personnel_information as c on c.bid=a.id")
                ->field("a.id,a.name,a.unumber,b.department_name as department,a.telephone,a.workEmail,c.status,c.lengthService,a.department_id")
                ->where($map)
                ->count();
        }
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
        if ($status && $departmentId) {
            $map["a.department_id"] = array("IN", $arrs);
            if(I("post.status") == '3'){
                $map['c.status'] = array('neq', '2');
            }else{
                $map['c.status'] = I("post.status");
            }
            $list = $basicInformation->table("oa_basic_information as a")
                ->join("oa_organizational_structure as b on b.id=a.department_id")
                ->join("oa_personnel_information as c on c.bid=a.id")
                ->field("a.id,a.name,a.unumber,b.department_name as department,a.telephone,b.pid,a.workEmail,c.status,c.lengthService,a.department_id")
                ->where($map)->limit($offset, $pages)->select();
        }
        if ($status && $departmentId == "") {
            if(I("post.status") == '3'){
                $map['c.status'] = array('neq', '2');
            }else{
                $map['c.status'] = I("post.status");
            }
            $list = $basicInformation->table("oa_basic_information as a")->join("oa_organizational_structure as b on b.id=a.department_id")
                ->join("oa_personnel_information as c on c.bid=a.id")
                ->field("a.id,a.name,a.unumber,b.department_name as department,a.telephone,a.workEmail,c.status,c.lengthService,a.department_id")
                ->where($map)->limit($offset, $pages)->select();
        }
        if ($status == "" && $departmentId) {
            $map["a.department_id"] = array("IN", $arrs);
//            $map['c.status'] = array('neq', '2');
            $list = $basicInformation->table("oa_basic_information as a")
                ->join("oa_organizational_structure as b on b.id=a.department_id")
                ->join("oa_personnel_information as c on c.bid=a.id")
                ->field("a.id,a.name,a.unumber,b.department_name as department,a.telephone,b.pid,a.workEmail,c.status,c.lengthService,a.department_id")
                ->where($map)->limit($offset, $pages)->select();

        }
        if ($status == "" && $departmentId == "") {
//            $map['c.status'] = array('neq', '2');
            $list = $basicInformation->table("oa_basic_information as a")
                ->join("oa_organizational_structure as b on b.id=a.department_id")
                ->join("oa_personnel_information as c on c.bid=a.id")
                ->field("a.id,a.name,a.unumber,b.department_name as department,a.telephone,a.workEmail,c.status,c.lengthService,a.department_id")
                ->where($map)
                ->limit($offset, $pages)->select();
        }
        $result = array(
            'page' => $page,
            'pageNum' => $pageNum,
            'result' => $list
        );
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //员工信息导入
    public function importPersonneStatusInformation()
    {
        $upload = new \Think\Upload();
        $upload->maxSize = 0;
        $upload->exts = array();// 设置附件上传类型
        $upload->rootPath = './Public/Uploads/personInformation/';
        $upload->saveName = time() . rand(10000, 99999);
        $info = $upload->upload();
        if (!$info) {
            $this->error($upload->getError());
        } else {
            $url = "./Public/Uploads/personInformation/" . $info[0]['savepath'] . $info[0]['savename'];
        }
        if (!$url) {
            //文件不存在
            $error = 2;
        }
        $finename = $url;
        $type = pathinfo($finename);
        $type = strtolower($type["extension"]);
        $type = $type === 'csv' ? $type : 'Excel2007';
        Vendor('PHPExcel.PHPExcel');
        $objReader = \PHPExcel_IOFactory::createReader($type);
        $objPHPExcel = $objReader->load($finename);
        $sheet = $objPHPExcel->getSheet(0);
        // 取得总行数
        $highestRow = $sheet->getHighestRow();
        // 取得总列数
        $highestColumn = $sheet->getHighestColumn();

        //实例化需要的数据表
        //基础信息表
        $basicInformation = D("BasicInformation");
        //人事信息表
        $personnelInformation = D("PersonnelInformation");
        //社保信息表
        $socialSecurityInformation = D("SocialSecurityInformation");
        //银行信息
        $bankInformation = D("BankInformation");
        //部门表
        $organizationalStructure = D("OrganizationalStructure");
        //职级表
        $rank = D("Rank");
        //职级表
        $position = D("Position");
        //合同表
        $contract = D("Contract");
        //公司表
        $company = D("Company");
        //循环读取excel文件,读取一条,插入一条
        $data = array();
        for ($row = 2; $row <= $highestRow; $row++) {
            $rowData = $sheet->rangeToArray('A' . $row . ':' . $highestColumn . $row, NULL, TRUE, FALSE);
            //这里得到的rowData都是一行的数据，得到数据后自行处理，我们这里只打出来看看效果
            $rowData[0][20] = strtotime(gmdate("Y-m-d H:i:s", \PHPExcel_Shared_Date::ExcelToPHP($row[0][20])));
            $rowData[0][21] = strtotime(gmdate("Y-m-d H:i:s", \PHPExcel_Shared_Date::ExcelToPHP($row[0][21])));
            $rowData[0][22] = strtotime(gmdate("Y-m-d H:i:s", \PHPExcel_Shared_Date::ExcelToPHP($row[0][22])));
            $rowData[0][25] = strtotime(gmdate("Y-m-d H:i:s", \PHPExcel_Shared_Date::ExcelToPHP($row[0][25])));
            $rowData[0][27] = strtotime(gmdate("Y-m-d H:i:s", \PHPExcel_Shared_Date::ExcelToPHP($row[0][27])));
            $rowData[0][43] = strtotime(gmdate("Y-m-d H:i:s", \PHPExcel_Shared_Date::ExcelToPHP($row[0][43])));
            $rowData[0][45] = strtotime(gmdate("Y-m-d H:i:s", \PHPExcel_Shared_Date::ExcelToPHP($row[0][45])));
//            var_dump($rowData);
            //增加基础信息
            $bas["unumber"] = $rowData[0]['0'];
            $bas["name"] = $rowData[0]['1'];
            $bas["uname"] = $rowData[0]['2'];
            $department = $rowData[0]['3'];
            $departmentName = $organizationalStructure->field("id,department_name")->where("department_name='{$department}'")->find();
//            echo $organizationalStructure->getLastsql();
            $bas["department_id"] = $departmentName["id"];
            $bas["sex"] = $rowData[0]['4'];
            $bas["native"] = $rowData[0]['5'];

            $bas["birthday"] = $rowData[0]['6'];
            $bas["constellation"] = $rowData[0]['7'];
            $bas["national"] = $rowData[0]['8'];
            $bas["telephone"] = $rowData[0]['9'];
            $bas["married"] = $rowData[0]['10'];
            $bas["category_id"] = $rowData[0]['12'];
            $bas["leader"] = $rowData[0]['15'];

            $bas["workEmail"] = $rowData[0]['28'];
            $bas["weixin"] = $rowData[0]['29'];
            $bas["qq"] = $rowData[0]['30'];
            $bas["ownEmail"] = $rowData[0]['31'];
            $baes = $basicInformation->create($bas);
            if ($baes) {
                $basId = $basicInformation->add($baes);
            }
//            var_dump($basId);
//           echo $basicInformation->getLastsql();die;
            //增加合同信息
            $cont["leaveDate"] = $rowData[0]["22"];
            $companyName = $rowData[0]["23"];
            $companyIds = $company->field("id,name")->where("name=" . $companyName)->find();
            $cont["company_id"] = $companyIds["id"];
            $cont["contractType_id"] = $rowData[0]["24"];
            $cont["contractStart"] = $rowData[0]["25"];
            $cont["signedYears"] = $rowData[0]["26"];
            $cont["contractEnd"] = $rowData[0]["27"];
            $conts = $contract->create($cont);
            if ($conts) {
                $contract_id = $contract->add($conts);
            }
            //增加人事信息
            $per["bid"] = $basId;
            $per["hobby"] = $rowData[0]['11'];
            $positionName = $rowData[0]['13'];
            $positionIds = $position->field("id,name")->where("name=" . $positionName)->find();
            $per["position_id"] = $positionIds["id"];
            $rankName = $rowData[0]['14'];
            $rankIds = $position->field("id,name")->where("name=" . $rankName)->find();
            $per["rank_id"] = $rankIds["id"];
            $per["coreMembers"] = $rowData[0]["16"];
            $per["payType"] = $rowData[0]["17"];
            $per["cardType_id"] = $rowData[0]["18"];
            $per["cardNumber"] = $rowData[0]["19"];
            $per["hiredate"] = $rowData[0]["20"];
            $per["correctionDate"] = $rowData[0]["21"];
            $per["homeAddress"] = $rowData[0]["32"];
            $per["contactPerson"] = $rowData[0]["33"];
            $per["contactPersonPhone"] = $rowData[0]["34"];
            $per["address"] = $rowData[0]["35"];
            $per["education_id"] = $rowData[0]["36"];
            $per["school"] = $rowData[0]["37"];
            $per["source_id"] = $rowData[0]["38"];
            $per["referees"] = $rowData[0]["39"];
            $per["contract_id"] = $contract_id;
            $pers = $personnelInformation->create($per);
            if ($pers) {
                $personnelInformation->add($pers);
            }

            //增加社保信息
            $soc["payLand"] = $rowData[0]["40"];
            $soc["householdType"] = $rowData[0]["41"];
            $soc["payBase"] = $rowData[0]["42"];
            $soc["socialStarting"] = $rowData[0]["43"];
            $soc["foudBase"] = $rowData[0]["44"];
            $soc["fundStarting"] = $rowData[0]["45"];
            $soc["payAccount"] = $rowData[0]["46"];
            $soc["bid"] = $basId;
            $socs = $socialSecurityInformation->create($soc);
            if ($socs) {
                $socialSecurityInformation->add($socs);
            }

            //增加银行信息
            $ban["bankCardNumber"] = $rowData[0]["47"];
            $ban["openBank"] = $rowData[0]["48"];
            $ban["accountTitle"] = $rowData[0]["49"];
            $ban["bid"] = $basId;
            $bans = $bankInformation->create($ban);
            if ($bans) {
                $result = $bankInformation->add($bans);
            }

            if ($result) {
                $error = 0;
            } else {
                $error = 0;
            }
        }
        echo self::jsons($error, $result);
    }

    //员工信息导出
    public function exportPersonneStatusInformation()
    {
        $basicInformation = D("BasicInformation");
        $result = $basicInformation->table("oa_basic_information as a")->join("left join oa_organizational_structure as b on b.id=a.department_id")
            ->join("left join oa_personnel_information as c on c.bid=a.id")->join("left join oa_education as d on d.id=c.education_id")->join("oa_contract as p on p.id=c.contract_id")
            ->join("left join oa_card as e on e.id=c.cardType_id")->join("left join oa_rank as f on f.id=c.rank_id")->join("left join oa_position as g on g.id=c.position_id")
            ->join("left join oa_source as h on h.id=c.source_id")->join("left join oa_company as i on i.id=p.company_id")
            ->join("left join oa_contract_type as j on j.id=p.contractType_id")
            ->join("left join oa_leave_type as k on k.id=p.leaveType_id")->join("left join oa_category as l on l.id=a.category_id")
            ->join("left join oa_social_security_information as m on m.bid=a.id")
            ->join("left join oa_bank_information as o on o.bid=a.id")->join("left join oa_payaccount as r on r.id=m.payAccount")
            ->field("a.id,a.name,a.uname,a.unumber,a.sex,a.leader,a.workEmail,a.telephone,a.weixin,a.ownEmail,a.birthday,a.constellation,a.qq,a.category_id,
                    l.name as category,a.national,a.married,a.native,a.photo,d.name as education,c.school,c.hobby,e.name as cardType,c.cardNumber,
                    f.name as rand,g.name as position,c.coreMembers,h.name as source,c.referees,c.hiredate,c.correctionDate,c.homeAddress,c.education_id,
                    c.cardType_id,c.rank_id,c.address,c.contactPerson,c.contactPersonPhone,c.file,c.payType,c.integral,i.name as company,j.name as contractType,p.contractStart,
                    p.signedYears,p.contractEnd,p.isRenewal_id,p.leaveDate,k.name as leaveType,p.leaveReason,c.status,c.lengthService,c.oldName,p.contractType_id,p.company_id,
                    a.department_id,b.department_name as department,m.householdType,m.payLand,m.payBase,m.foudBase,m.medical,m.pension,
                    m.unemployment,m.fund,m.medicalTwo,m.pensionTwo, m.unemploymentTwo,m.hurted,m.birthed,m.fundTwo,o.bankCardNumber,o.openBank,
                    o.accountTitle,o.isDefault,c.lengthService,c.contract_id,m.socialStarting,m.fundStarting,r.name as payAccount")->select();
        if ($result) {
            $field = array(
                'A' => array('unumber', '工号'),
                'B' => array('name', '姓名'),
                'C' => array('uname', '昵称'),
                'D' => array('department_name', '部门'),
                'E' => array('sex', '性别'),
                'F' => array('native', '籍贯'),
                'G' => array(date("Y-m-d H:i:s", 'birthday'), '出生日期'),
                'H' => array('constellation', '星座'),
                'I' => array('national', '民族'),
                'J' => array('telephone', '手机号码'),
                'K' => array('married', '婚姻状况'),
                'L' => array('hobby', '兴趣爱好'),
                'M' => array('category_id', '人员类别'),
                'N' => array('position', '职位'),
                'O' => array('rand', '职级'),
                'P' => array('leader', '导师'),
                'Q' => array('coreMembers', '是否核心'),
                'R' => array('payType', '上下发薪'),
                'S' => array('cardType_id', '证件类型'),
                'T' => array('cardNumber', '证件号码'),
                'U' => array(date("Y-m-d H:i:s", 'hiredate'), '入职日期'),
                'V' => array('correctionDate', '转正日期'),
                'W' => array('leaveDate', '离职日期'),
                'X' => array('company', '合同公司'),
                'Y' => array('leaveType_id', '合同类型'),
                'Z' => array(date("Y-m-d H:i:s", 'contractStart'), '合同起始日'),
                'AA' => array('signedYears', '签订年限'),
                'AB' => array(date("Y-m-d H:i:s", 'contractEnd'), '合同终止日'),
                'AC' => array('workEmail', '工作邮箱'),
                'AD' => array('weixin', '微信号'),
                'AE' => array('qq', 'QQ号'),
                'AF' => array('ownEmail', '个人邮箱'),
                'AG' => array('homeAddress', '家庭住址'),
                'AH' => array('contactPerson', '紧急联系人'),
                'AI' => array('contactPersonPhone', '紧急联系人电话'),
                'AJ' => array('address', '现居住地'),
                'AK' => array('education_id', '学历'),
                'AL' => array('school', '毕业院校'),
                'AM' => array('source_id', '招聘来源'),
                'AN' => array('referees', '推荐人'),
                'AO' => array('payLand', '社保缴纳地'),
                'AP' => array('householdType', '户口性质'),
                'AQ' => array('payBase', '社保基数'),
                'AR' => array(date("Y-m-d H:i:s", 'socialStarting'), '社保起始缴纳月'),
                'AS' => array('foudBase', '公积金基数'),
                'AT' => array(date("Y-m-d H:i:s", 'fundStarting'), '公积金起始缴纳月'),
                'AU' => array('payAccount', '缴纳账户'),
                'AV' => array('bankCardNumber', '银行卡号'),
                'AW' => array('openBank', '开户行'),
                'AX' => array('accountTitle', '账户名称'),

            );
            phpExcelList($field, $result, '人员信息表' . date('Y-m-d'));
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //基础信息
    public function Basic()
    {
        $id = I("post.id");
        $basicInformation = D("BasicInformation");
        $list = $basicInformation->table("oa_basic_information as a")->join("oa_organizational_structure as b on b.id=a.department_id")
            ->join("oa_category as d on d.id=a.category_id")
            ->field("a.id,a.name,a.uname,a.unumber,a.sex,b.department_name as departmentName,a.leader,d.name as category,a.workEmail,a.telephone,a.weixin,a.ownEmail,a.birthday,a.constellation,a.qq,a.national,a.married,a.native,a.photo")
            ->where("id=" . $id)->find();
        $list['sex'] = $list['sex'] == 0 ? '女' : '男';
        $list['photo'] = $_SERVER['SERVER_NAME'] . $list['photo'];
        $list['birthday'] = date("Y-m-d", $list["birthday"]);
        //查出所有的id，页面点击下一页的时候显示下一个人的信息
        $next = $basicInformation->field("id,name")->select();
        $result = array(
            'result' => $list,
            'next' => $next
        );
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //增加基础信息
    public function addBasic()
    {
        $data['name'] = I("post.name");
        $data['uname'] = I("post.uname");
        $data['sex'] = I("post.sex");
        //查询出工号规则
        $workingRules = D("WorkingRules");
        $condition = $workingRules->field("id,digits,startingValue,is_auto")->select();
        if ($condition) {
            foreach ($condition as $k => $v) {
                $arr["digits"] = $v["digits"];
                $arr["startingValue"] = $v["startingValue"];
                $arr["is_auto"] = $v["is_auto"];
            }
            //查询出以经存在的工号，并且取出最大值
            $basicInformation = D("BasicInformation");
            $maxNumber = $basicInformation->field("id,unumber")->order("cast(unumber as signed)" . "desc")->select();
            if ($maxNumber[0]["unumber"]) {
                $maxNum = $maxNumber[0]["unumber"];
            } else {
                $maxNum = $arr["startingValue"];
            }
            if ($arr["is_auto"] == "2" && $maxNumber[0]["unumber"]) {
                $unumber['unumber'] = $maxNum + 1;
                $data['unumber'] = I("post.unumber");
            } elseif ($arr["is_auto"] == "2" && !$maxNumber[0]["unumber"]) {
                $unumber['unumber'] = $maxNum;
                $data['unumber'] = I("post.unumber");
            } else {
                $data['unumber'] = I("post.unumber");
            }
        }
        //获取的
        $data['department_id'] = I("post.department_id");
        $data['leader'] = I("post.leader");
        //获取的是ID
        $data['category_id'] = I("post.category_id");
        $data['workEmail'] = I("post.workEmail");
        $data['telephone'] = I("post.telephone");
        $data['weixin'] = I("post.weixin");
        $data['ownEmail'] = I("post.ownEmail");
        $data['birthday'] = strtotime(I("post.birthday"));
        $data['constellation'] = I("post.constellation");
        $data['qq'] = I("post.qq");
        $data['national'] = I("post.national");
        $data['married'] = I("post.married");
        $data['native'] = I("post.native");
        $data['photo'] = I("post.photo");

        $datas = $basicInformation->create($data);
        if ($datas) {
            $list = $basicInformation->add($datas);
        }
        $result = array(
            "result" => $list,
            "unumber" => $unumber,
            "workingRules" => $arr
        );
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //上传照片接口
    public function uploadPhoto()
    {
        $upload = new \Think\Upload();
        $upload->maxSize = 3145728;
        $upload->exts = array('jpg', 'gif', 'png', 'jpeg');// 设置附件上传类型
        $upload->rootPath = './Public/Uploads/photo/';
        $upload->saveName = array('uniqid', mt_rand(1, 999999) . '_' . md5(uniqid()));
        $upload->subName = array('date', 'Ymd');
        $info = $upload->upload();
        if (!$info) {
            $this->error($upload->getError());
        } else {
            $data["file"] = "/Public/Uploads/photo/" . $info[0]['savepath'] . $info[0]['savename'];
        }
        if ($data) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $data);
    }

    //修改基础信息
    public function updateBasic()
    {
        $id = I("post.id");
        $data['name'] = I("post.name");
        $data['uname'] = I("post.uname");
        $data['unumber'] = I("post.unumber");
        $data['sex'] = I("post.sex");
        //获取的
        $data['department_id'] = I("post.department_id");
        //获取的是Id
//        $data['posts_id'] = I("post.posts_id");
        $data['leader'] = I("post.leader");
        //获取的是ID
        $data['category_id'] = I("post.category_id");
        $data['workEmail'] = I("post.workEmail");
        $data['telephone'] = I("post.telephone");
        $data['weixin'] = I("post.weixin");
        $data['ownEmail'] = I("post.ownEmail");
        $data['birthday'] = strtotime(I("post.birthday"));
        $data['constellation'] = I("post.constellation");
        $data['qq'] = I("post.qq");
        $data['national'] = I("post.national");
        $data['married'] = I("post.married");
        $data['native'] = I("post.native");
        $data['photo'] = I("post.photo");
        $basicInformation = D("BasicInformation");
        $datas = $basicInformation->create($data);
        if ($datas) {
            $result = $basicInformation->where("id = " . $id)->save($datas);
        }

        self::jsons($error = 0, $result);
    }

    //下拉框显示人员类别
    public function category()
    {
        $category = D("Category");
        $result = $category->field('id,name')->select();
        if ($result || $result == "") {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //增加人员类别
    public function addCategory()
    {
        $data["name"] = I("post.name");
        $category = D("Category");
        $datas = $category->create($data);
        if ($datas) {
            $result = $category->add($datas);
        }
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //修改人员类别
    public function updateCategory()
    {
        $id = I("post.id");
        $data["name"] = I("post.name");
        $category = D("Category");
        $datas = $category->create($data);
        if ($datas) {
            $result = $category->where("id = " . $id)->save($datas);
        }
        if ($result || $result == "") {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);

    }

    //删除人员类别
    public function deleteCategory()
    {
        $id = I("post.id");
        $length = strlen($id);
        $category = D("Category");
        if ($length == 1) {
            $where = 'id=' . $id;
        } else {
            $id = array($id);
            $where = 'id in(' . implode(',', $id) . ')';
        }
        $result = $category->where($where)->delete();
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //显示人事信息数据
    public function personnel()
    {
        $id = I("post.id");
        $personnelInformation = D("PersonnelInformation");
        $list = $personnelInformation->table("oa_personnel_information as a")->join("oa_education as b on b.id=a.education_id")
            ->join("oa_contract as i on i.pid=a.id")
            ->join("oa_card as c on c.id=a.cardType_id")->join("oa_rank as d on d.id=a.rank_id")
            ->join("oa_position as e on e.id=a.position_id")->join("oa_source as f on f.id=a.source_id")
            ->join("oa_contract_renewal as g on g.bid=a.id")->join("oa_leave_type as h on h.id=a.leaveType_id")
            ->field("a.id,a.bid,b.name as educationName,a.school,a.hobby,c.name as cardName,a.cardNumber,d.name as rankName,
            e.name as positionNamw,a.coreMembers,f.name as sourceNamw,a.hiredate,a.correctionDate,a.homeAddress,a.address,
            a.contactPerson,a.contactPersonPhone,a.file,a.payType,a.integral,a.discount,a.contractStart,a.signedYears,a.contractEnd,
            a.isRenewal_id,h.name as leaveTypeName,a.leaveReason,a.referees,a.status,a.lengthService")
            ->where("bid=" . $id)->find();

        //返回是否续签的字段，0为否，1为是，如果为1就显示续签的时间
        $isRenewal = $list["isRenewal_id"];
        if ($list['hiredate']) {
            $list['hiredate'] = date('Y-m-d', $list['hiredate']);
        }
        if ($list['correctionDate']) {
            $list['correctionDate'] = date('Y-m-d', $list['correctionDate']);
        }
        if ($list['contractStart']) {
            $list['contractStart'] = date('Y-m-d', $list['contractStart']);
        }
        if ($list['contractEnd']) {
            $list['contractEnd'] = date('Y-m-d', $list['contractEnd']);
        }
        if ($list['leaveDate']) {
            $list['leaveDate'] = date('Y-m-d', $list['leaveDate']);
        }

        $result = array(
            'isRenewal' => $isRenewal,
            'result' => $list
        );
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //增加人事信息
    public function addPersonnel()
    {
        //传递过来id，来保存是属于谁的人事信息
        $data['bid'] = I("post.id");
        //保存学历id，链接学历表
        $data['education_id'] = I("post.education_id");
        $data['school'] = I("post.school");
        $data['hobby'] = I("post.hobby");
        //获取的是Id
        $data['cardType_id'] = I("post.cardType_id");
        $data['cardNumber'] = I("post.cardNumber");


        //链接职级表
        $data['rank_id'] = I("post.rank_id");
        //链接职位表
        $data['position_id'] = I("post.position_id");
        $data['coreMembers'] = I("post.coreMembers");
        //招聘来源
        $data['source_id'] = I("post.source_id");
        $data['referees'] = I("post.referees");
        //入职日期
        $data['hiredate'] = strtotime(I("post.hiredate"));
        //转正日期
        $data['correctionDate'] = strtotime(I("post.correctionDate"));
        $data['homeAddress'] = I("post.homeAddress");
        $data['address'] = I("post.address");
        $data['contactPerson'] = I("post.contactPerson");
        $data['contactPersonPhone'] = I("post.contactPersonPhone");
        $data['file'] = I("post.file");
        $data['payType'] = I("post.payType");
        $data['integral'] = I("post.integral");

        //增加到合同表里
        $arr['company_id'] = I("post.company_id");
        $arr["contractType_id"] = I("post.contractType_id");
        $arr['contractStart'] = strtotime(I("post.contractStart"));
        $arr['signedYears'] = I("post.signedYears");
        $arr['contractEnd'] = strtotime(I("post.contractEnd"));
        $arr['isRenewal_id'] = I("post.isRenewal_id");
//        var_dump($data);die;

        //离职日期
        $arr['leaveDate'] = strtotime(I("post.leaveDate"));
        $arr['leaveType_id'] = I("post.leaveType_id");
        $arr['leaveReason'] = I("post.leaveReason");
        $contract = D("Contract");
        $arrs = $contract->create($arr);
        if ($arrs) {
            $contract_id = $contract->add($arrs);
        }
        $data['contract_id'] = $contract_id;
        $data['discount'] = I("post.discount");
        $data['oldName'] = I("post.oldName");
//        if($data["leaveDate"] == ""){
//            if($data['hiredate']<$data['correctionDate']){
//                $data["status"] = '4';
//            }
//            if($data['correctionDate']){
//                $data["status"] = '1';
//            }
//        }else{
//            $data["status"] = '2';
//        }
        $data["leaveDate"] = $arr['leaveDate'];
        if ($data["leaveDate"]) {
            $data["status"] = '2';
        } else {
            if ($data['correctionDate']) {
                $data["status"] = '1';
            } else {
                $data["status"] = '4';
            }
        }
        //工龄
        $data["lengthService"] = round((time() - $data['hiredate']) / 31536000, 2);
        $personnelInformation = D("PersonnelInformation");
        $datas = $personnelInformation->create($data);
        if ($datas) {
            $result = $personnelInformation->add($datas);
        }
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //修改人事信息
    public function updatePersonnel()
    {
        //传递过来id，来保存是属于谁的人事信息
        $data['bid'] = I("post.id");
        //传递过来合同id
        $contractId = I("post.contract_id");
        //保存学历id，链接学历表
        $data['education_id'] = I("post.education_id");
        $data['school'] = I("post.school");
        $data['hobby'] = I("post.hobby");
        //获取的是Id
        $data['cardType_id'] = I("post.cardType_id");
        $data['cardNumber'] = I("post.cardNumber");

        //链接职级表
        $data['rank_id'] = I("post.rank_id");
        //链接职位表
        $data['position_id'] = I("post.position_id");
        $data['coreMembers'] = I("post.coreMembers");
        //招聘来源
        $data['source_id'] = I("post.source_id");
        $data['referees'] = I("post.referees");
        $data['hiredate'] = strtotime(I("post.hiredate"));
        $data['correctionDate'] = strtotime(I("post.correctionDate"));
        $data['homeAddress'] = I("post.homeAddress");
        $data['address'] = I("post.address");
        $data['contactPerson'] = I("post.contactPerson");
        $data['contactPersonPhone'] = I("post.contactPersonPhone");
        $data['file'] = I("post.file");
        $data['payType'] = I("post.payType");
        $data['integral'] = I("post.integral");
        //增加到合同表里
        $arr['company_id'] = I("post.company_id");
        $arr["contractType_id"] = I("post.contractType_id");
        $arr['contractStart'] = strtotime(I("post.contractStart"));
        $arr['signedYears'] = I("post.signedYears");
        $arr['contractEnd'] = strtotime(I("post.contractEnd"));
        $arr['isRenewal_id'] = I("post.isRenewal_id");
        //离职日期
        $arr['leaveDate'] = strtotime(I("post.leaveDate"));
        $arr['leaveType_id'] = I("post.leaveType_id");
        $arr['leaveReason'] = I("post.leaveReason");
        $contract = D("Contract");
        $arrs = $contract->create($arr);
        if ($arrs) {
            $contract->where("id=" . $contractId)->save($arrs);
        }

        $data['discount'] = I("post.discount");

        if ($data["leaveDate"] == "") {
            if ($data['hiredate'] < $data['correctionDate']) {
                $data["status"] = '4';
            }
            if ($data['correctionDate']) {
                $data["status"] = '1';
            }
        } else {
            $data["status"] = '2';
        }
        //工龄
        $data["lengthService"] = round((time() - $data['hiredate']) / 31536000, 2);
        $personnelInformation = D("PersonnelInformation");
        $datas = $personnelInformation->create($data);
        if ($datas) {
            $result = $personnelInformation->where("bid = " . $data['bid'])->save($datas);
        }
//        if ($result) {
//            $error = 0;
//        } else {
//            $error = 1;
//        }
        self::jsons($error = 0, $result);
    }

    //下拉选择学历
    public function education()
    {
        $education = D("Education");
        $result = $education->field("id,name")->select();
        if ($result || $result == "") {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //增加学历
    public function addEducation()
    {
        $data["name"] = I("post.name");
        $education = D("Education");
        $datas = $education->create($data);
        if ($datas) {
            $result = $education->add($datas);
        }
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //修改学历
    public function updateEducation()
    {
        $id = I("post.id");
        $data["name"] = I("post.name");
        $education = D("Education");
        $datas = $education->create($data);
        if ($datas) {
            $result = $education->where("id = " . $id)->save($datas);
        }
        if ($result || $result == "") {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);

    }

    //删除学历
    public function deleteEducation()
    {
        $id = I("post.id");
        $length = strlen($id);
        $education = D("Education");
        if ($length == 1) {
            $where = 'id=' . $id;
        } else {
            $id = array($id);
            $where = 'id in(' . implode(',', $id) . ')';
        }
        $result = $education->where($where)->delete();
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //下拉选择证件
    public function card()
    {
        $cardType = D("Card");
        $result = $cardType->field("id,name")->select();
        if ($result || $result == "") {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }


    //下拉选择合同类型
    public function contractType()
    {
        $contractType = D("ContractType");
        $result = $contractType->field("id,name")->select();
        if ($result || $result == "") {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //增加证件
    public function addCard()
    {
        $data["name"] = I("post.name");
        $cardType = D("Card");
        $datas = $cardType->create($data);
        if ($datas) {
            $result = $cardType->add($datas);
        }
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //修改证件
    public function updateCard()
    {
        $id = I("post.id");
        $data["name"] = I("post.name");
        $cardType = D("Card");
        $datas = $cardType->create($data);
        if ($datas) {
            $result = $cardType->where("id = " . $id)->save($datas);
        }
        if ($result || $result == "") {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);

    }

    //删除证件
    public function deleteCard()
    {
        $id = I("post.id");
        $length = strlen($id);
        $cardType = D("Card");
        if ($length == 1) {
            $where = 'id=' . $id;
        } else {
            $id = array($id);
            $where = 'id in(' . implode(',', $id) . ')';
        }
        $result = $cardType->where($where)->delete();
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //下拉选择职级
    public function rank()
    {
        $rank = D("Rank");
        $result = $rank->field("id,name")->select();
        if ($result || $result == "") {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //增加职级
    public function addRank()
    {
        $data["name"] = I("post.name");
        $rank = D("Rank");
        $datas = $rank->create($data);
        if ($datas) {
            $result = $rank->add($datas);
        }
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //修改职级
    public function updateRank()
    {
        $id = I("post.id");
        $data["name"] = I("post.name");
        $rank = D("Rank");
        $datas = $rank->create($data);
        if ($datas) {
            $result = $rank->where("id = " . $id)->save($datas);
        }
        if ($result || $result == "") {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //删除职级
    public function deleteRank()
    {
        $id = I("post.id");
        $length = strlen($id);
        $rank = D("Rank");
        $existing = $rank->field("id")->where("id=".$id)->find();
        $personnelInformation = D("PersonnelInformation");
        $existingPersonnel = $personnelInformation->field('rank_id')->where("rank_id=".$existing["id"])->select();
        if($existingPersonnel){
            self::jsons($error=0,$result="已被引用的职级不能删除");
        }else{
            if ($length == 1) {
                $where = 'id=' . $id;
            } else {
                $id = array($id);
                $where = 'id in(' . implode(',', $id) . ')';
            }
            $result = $rank->where($where)->delete();
            if ($result) {
                $error = 0;
            } else {
                $error = 1;
            }
            self::jsons($error, $result);
        }
    }

    //下拉选择职位
    public function position()
    {
        $position = D("Position");
        $result = $position->table("oa_position as a")->join("oa_organizational_structure as b on b.id=a.oid")->field("a.id,a.name,a.oid,a.is_director,b.department_name")->select();
        foreach ($result as &$val) {
            $val['is_director'] = $result['is_director'] == 1 ? '是' : '否';
        }
        if ($result || $result == "") {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //增加职位
    public function addPosition()
    {
        $data["name"] = I("post.name");
        $data["oid"] = I("post.oid");
        $data["is_director"] = I("post.is_director");
        $position = D("Position");
        $datas = $position->create($data);
        if ($datas) {
            $result = $position->add($datas);
        }
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //修改职位
    public function updatePosition()
    {
        $id = I("post.id");
        $data["name"] = I("post.name");
        $data["oid"] = I("post.oid");
        $data["is_director"] = I("post.is_director");
        $position = D("Position");
        $datas = $position->create($data);
        if ($datas) {
            $result = $position->where("id = " . $id)->save($datas);
        }
        if ($result || $result == "") {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);

    }

    //删除职位
    public function deletePosition()
    {
        $id = I("post.id");
        $length = strlen($id);
        $position = D("Position");
        $existing = $position->field("id")->where("id=".$id)->find();
        $personnelInformation = D("PersonnelInformation");
        $existingPersonnel = $personnelInformation->field('position_id')->where("position_id=".$existing["id"])->select();
        if($existingPersonnel){
            self::jsons($error=0,$result="已被引用的职位不能删除");
        }else{
            if ($length == 1) {
                $where = 'id=' . $id;
            } else {
                $id = array($id);
                $where = 'id in(' . implode(',', $id) . ')';
            }
            $result = $position->where($where)->delete();
            if ($result) {
                $error = 0;
            } else {
                $error = 1;
            }
            self::jsons($error, $result);
        }
    }

    //下来选择招聘来源
    public function source()
    {
        $source = D("Source");
        $result = $source->field("id,name")->select();
        if ($result || $result == "") {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //增加招聘来源
    public function addSource()
    {
        $data["name"] = I("post.name");
        $source = D("Source");
        $datas = $source->create($data);
        if ($datas) {
            $result = $source->add($datas);
        }
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //修改招聘来源
    public function updateSource()
    {
        $id = I("post.id");
        $data["name"] = I("post.name");
        $source = D("Source");
        $datas = $source->create($data);
        if ($datas) {
            $result = $source->where("id = " . $id)->save($datas);
        }
        if ($result || $result == "") {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);

    }

    //删除招聘来源
    public function deleteSource()
    {
        $id = I("post.id");
        $length = strlen($id);
        $source = D("Source");
        if ($length == 1) {
            $where = 'id=' . $id;
        } else {
            $id = array($id);
            $where = 'id in(' . implode(',', $id) . ')';
        }
        $result = $source->where($where)->delete();
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //下拉选择离职类别
    public function leave()
    {
        $leave = D("LeaveType");
        $result = $leave->field("id,name")->select();
        if ($result || $result == "") {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //增加人员类别
    public function addLeave()
    {
        $data["name"] = I("post.name");
        $leave = D("LeaveType");
        $datas = $leave->create($data);
        if ($datas) {
            $result = $leave->add($datas);
        }
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //修改人员类别
    public function updateLeave()
    {
        $id = I("post.id");
        $data["name"] = I("post.name");
        $leave = D("LeaveType");
        $datas = $leave->create($data);
        if ($datas) {
            $result = $leave->where("id = " . $id)->save($datas);
        }
        if ($result || $result == "") {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);

    }

    //删除人员类别
    public function deleteLeave()
    {
        $id = I("post.id");
        $length = strlen($id);
        $leave = D("LeaveType");
        if ($length == 1) {
            $where = 'id=' . $id;
        } else {
            $id = array($id);
            $where = 'id in(' . implode(',', $id) . ')';
        }
        $result = $leave->where($where)->delete();
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //10.工号规则设置
    public function workingSet()
    {
        //位数
        $data["digits"] = I("post.digits");
        //起始值
        $data["startingValue"] = I("post.startingValue");
        //是否自动生成
        $data["is_auto"] = I("post.is_auto");
        $workingRules = D("WorkingRules");
        $datas = $workingRules->create($data);
        if ($datas) {
            $result = $workingRules->add($datas);

        }
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //显示户口性质
    public function householdType()
    {
        $payland = D("Payland");
        $result = $payland->field("id,city,householdType")->select();
        if ($result || $result == "") {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //增加户口性质
    public function addHouseholdType()
    {
        //显示省市，前台插件拼接成省市字符串传递过来
        $data["city"] = I("post.city");
        $data["householdType"] = I("post.householdType");
        $payland = D("Payland");
        $list = $payland->field("id,city,householdType")->select();
        foreach ($list as $key => $value) {
            $arr["city"] = $value["city"];
            $arr["householdType"] = $value["householdType"];
            if ($data["city"] == $arr["city"] && $data["householdType"] == $arr["householdType"]) {
                self::jsons($error = 2, $result = "您增加的城市和户口类型已经存在");
            }
        }
        $datas = $payland->create($data);
        if ($datas) {
            $result = $payland->add($datas);
        }
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //修改户口性质
    public function updateHouseholdType()
    {
        $id = I("post.id");
        $data["city"] = I("post.city");
        $data["householdType"] = I("post.householdType");
        $payland = D("Payland");
        $datas = $payland->create($data);
        if ($datas) {
            $result = $payland->where("id=" . $id)->save($datas);
        }
        if ($result || $result == "") {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //删除户口性质
    public function deleteHouseholdType()
    {
        $id = I("post.id");
        $length = strlen($id);
        $payland = D("Payland");
        $existing = $payland->field('id,city,householdType')->where("id=".$id)->find();
        $socialSecurityPlan = D("SocialSecurityPlan");
        $existingPlan = $socialSecurityPlan->field('city,householdType')->where("city='{$existing["city"]}' and householdType='{$existing["householdType"]}'")->select();
        if($existingPlan){
            self::jsons($error=0,$result="已被使用的户口性质不能删除");
        }else{
            if ($length == 1) {
                $where = 'id=' . $id;
            } else {
                $id = array($id);
                $where = 'id in(' . implode(',', $id) . ')';
            }
            $result = $payland->where($where)->delete();
            if ($result) {
                $error = 0;
            } else {
                $error = 1;
            }
            self::jsons($error, $result);
        }
    }

    //显示方案
    public function socialSecurityPlan()
    {
        $socialSecurityPlan = D("SocialSecurityPlan");
        $result = $socialSecurityPlan->field("id,city,householdType,medicalBase,medicalRatio,pensionBase,pensionRatio,hurtedBase,
                    hurtedRatio,unemploymentBase,unemploymentRatio,birthedBase,birthedRatio,medicalRatioTwo,pensionRatioTwo,
                    hurtedRatioTwo,unemploymentRatioTwo,birthedRatioTwo,foudBase,foudRatio,foudRatioTwo,largeMedicalBase,largeMedicalRatio,
                    largeMedicalRatioTwo,effectiveDate,expiryDate,is_use,highestfoud,pensionHighestBase,hurtedHighestBase,unemploymentHighestBase,
                    birthedHighestBase,medicalHighestBase,largeMedicalHighestBase,medicalFixedFee,medicalFixedFeeTwo,pensionFixedFee,pensionFixedFeeTwo,
                    hurtedFixedFee,hurtedFixedFeeTwo,unemploymentFixedFee,unemploymentFixedFeeTwo,birthedFixedFee,birthedFixedFeeTwo,foudBaseFixedFee,
                    foudBaseFixedFeeTwo,largeMedicalFixedFee,largeMedicalFixedFeeTwo")->select();
        foreach ($result as &$val) {
            $val['effectiveDate'] = date('Y-m-d', $val['effectiveDate']);
            if ($val["expiryDate"] != null) {
                $val['expiryDate'] = date('Y-m-d', $val['expiryDate']);
            }
        }
        if ($result || $result == "") {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //社保城市级联
    public function cityLink()
    {
        $city = I("post.city");
        if ($city) {
            $payland = D("Payland");
            $result = $payland->field("id,city,householdType")->where("city='{$city}'")->select();
            if ($result || $result == "") {
                $error = 0;
            } else {
                $error = 1;
            }
        }
        self::jsons($error, $result);
    }

    //新增数据的时候判断缴纳地和户口类型是否已经存在
    public function cityIsExist()
    {
        $id = I("post.id");
        if (!$id) {
            $data["city"] = I("post.city");//缴纳地
            $data["householdType"] = I("post.householdType");//户口性质
            if (I("post.effectiveDate")) {
                $data["effectiveDate"] = strtotime(I("post.effectiveDate"));//生效日期
                if ($data["effectiveDate"] < strtotime(date("Y-m-d", time()))) {
                    $result = array("errors" => 2, "result" => "生效日期不能小于当前日期");
                }
            } else {
                $data["effectiveDate"] = null;
            }
            $socialSecurityPlan = D("SocialSecurityPlan");
            $list = $socialSecurityPlan->field("id,city,householdType,effectiveDate,expiryDate,is_use,num")->select();
            if ($list) {
                foreach ($list as $key => $value) {
                    $arr["city"] = $value["city"];
                    $arr["householdType"] = $value["householdType"];
                    $arr["effectiveDate"] = $value["effectiveDate"];
                    $arr["expiryDate"] = $value["expiryDate"];
                    if ($data["city"] == $arr["city"] && $data["householdType"] == $arr["householdType"]) {
                        $result = array("errors" => 3, "result" => "缴纳地下的这个类型的户口已经存在,确定还要新增么？");
                        //新增数据的时候如果城市和类型已经同时存在的有数据，就判断存在的数据的失效时间，如果失效时间为空的话，就是新加数据的生效时间的前一天
                        if ($arr["expiryDate"] == "0" && $data["effectiveDate"] > $arr["effectiveDate"]) {
                            $idata["expiryDate"] = date("Y-m-d", $data["effectiveDate"] - 3600 * 24);
                        } else {
                            $idata["expiryDate"] = null;
                        }
                        //如果新增数据的生效日期比已存在的数据的生效日期要小的话，那么新增数据的失效日期就是已存在的数据的生效的前一天
                        if ($data["effectiveDate"] < $arr["effectiveDate"]) {
                            $idata["expiryDate"] = date("Y-m-d", $arr["effectiveDate"] - 3600 * 24);
                        } else {
                            $idata["expiryDate"] = null;
                        }
                    }
                }
            }
        } else {
            if (I("post.effectiveDate")) {
                $data["effectiveDate"] = strtotime(I("post.effectiveDate"));//生效日期
                if ($data["effectiveDate"] < time()) {
                    $result = array("errors" => 2, "result" => "生效日期不能小于当前日期");
                }
            } else {
                $data["effectiveDate"] = null;
            }
            $socialSecurityPlan = D("SocialSecurityPlan");
            $list = $socialSecurityPlan->field("id,city,householdType,effectiveDate,expiryDate,is_use,num")->select();
            foreach ($list as $key => $value) {
                $arr["effectiveDate"] = $value["effectiveDate"];
                $arr["expiryDate"] = $value["expiryDate"];
                //修改数据的时候如果城市和类型已经同时存在的有数据，就判断存在的数据的失效时间，如果失效时间为空的话，就是新加数据的生效时间的前一天
                if ($arr["expiryDate"] == "0" && $data["effectiveDate"] > $arr["effectiveDate"]) {
                    $udata["expiryDate"] = date("Y-m-d", $data["effectiveDate"] - 3600 * 24);
                } else {
                    $udata["expiryDate"] = null;
                }
                //修改新增数据的生效日期比已存在的数据的生效日期要小的话，那么新增数据的失效日期就是已存在的数据的生效的前一天
                if ($data["effectiveDate"] < $arr["effectiveDate"]) {
                    $udata["expiryDate"] = date("Y-m-d", $arr["effectiveDate"] - 3600 * 24);
                } else {
                    $udata["expiryDate"] = null;
                }
            }
        }
        $result = array(
            "result" => $result,
            "city" => $data["city"],
            "householdType" => $data["householdType"],
            "effectiveDate" => date("Y-m-d", $data["effectiveDate"]),
            "iexpiryDate" => $idata["expiryDate"],
            "uexpiryDate" => $udata["expiryDate"]
        );
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //4.2增加社保方案
    public function addSocialSecurityPlan()
    {
        $data["city"] = I("post.city");//缴纳地
        $data["householdType"] = I("post.householdType");//户口性质
        $data["effectiveDate"] = strtotime(I("post.effectiveDate"));//生效日期

        $data["medicalBase"] = I("post.medicalBase");//医疗基数
        $data["medicalRatio"] = I("post.medicalRatio");//医疗比例（个人）
        $data["pensionBase"] = I("post.pensionBase");//养老基数
        $data["pensionRatio"] = I("post.pensionRatio");//养老比例（个人）
        $data["hurtedBase"] = I("post.hurtedBase");//工伤基数
        $data["hurtedRatio"] = I("post.hurtedRatio");//工伤比例（个人）
        $data["unemploymentBase"] = I("post.unemploymentBase");//失业基数
        $data["unemploymentRatio"] = I("post.unemploymentRatio");//失业比例（个人）
        $data["birthedBase"] = I("post.birthedBase");//生育基数
        $data["birthedRatio"] = I("post.birthedRatio");//生育比例（个人）
        $data["medicalRatioTwo"] = I("post.medicalRatioTwo");//医疗比例（公司）
        $data["pensionRatioTwo"] = I("post.pensionRatioTwo");//养老比例（公司）
        $data["hurtedRatioTwo"] = I("post.hurtedRatioTwo");//工伤比例（公司）
        $data["unemploymentRatioTwo"] = I("post.unemploymentRatioTwo");//失业比例（公司）
        $data["birthedRatioTwo"] = I("post.birthedRatioTwo");//生育比例（公司）
        $data["foudBase"] = I("post.foudBase");//公积金基数
        $data["foudRatio"] = I("post.foudRatio");//公积金比例
        $data["foudRatioTwo"] = I("post.foudRatioTwo");//公积金比例
        $data["largeMedicalBase"] = I("post.largeMedicalBase");//大额医疗基数
        $data["largeMedicalRatio"] = I("post.largeMedicalRatio");//大额医疗比例
        $data["largeMedicalRatioTwo"] = I("post.largeMedicalRatioTwo");//大额医疗比例

        $data["medicalFixedFee"] = I("post.medicalFixedFee");//医疗固定费用（个人）
        $data["medicalFixedFeeTwo"] = I("post.medicalFixedFeeTwo");//固定医疗费用（公司）
        $data["pensionFixedFee"] = I("post.pensionFixedFee");//固定养老费用（个人）
        $data["pensionFixedFeeTwo"] = I("post.pensionFixedFeeTwo");//固定养老费用（公司）
        $data["hurtedFixedFee"] = I("post.hurtedFixedFee");//固定工伤费用（个人）
        $data["hurtedFixedFeeTwo"] = I("post.hurtedFixedFeeTwo");//固定工伤费用（公司）
        $data["unemploymentFixedFee"] = I("post.unemploymentFixedFee");//固定失业费用（个人）
        $data["unemploymentFixedFeeTwo"] = I("post.unemploymentFixedFeeTwo");//固定失业费用（公司）
        $data["birthedFixedFee"] = I("post.birthedFixedFee");//固定生育费用（个人）
        $data["birthedFixedFeeTwo"] = I("post.birthedFixedFeeTwo");//固定生育费用（公司）
        $data["foudBaseFixedFee"] = I("post.foudBaseFixedFee");//固定公积金费用（个人）
        $data["foudBaseFixedFeeTwo"] = I("post.foudBaseFixedFeeTwo");//固定公积金费用（公司）
        $data["largeMedicalFixedFee"] = I("post.largeMedicalFixedFee");//大额医疗费用（个人）
        $data["largeMedicalFixedFeeTwo"] = I("post.largeMedicalFixedFeeTwo");//大额医疗费用（公司）

        $data["pensionHighestBase"] = I("post.pensionHighestBase");//养老最高基数
        $data["hurtedHighestBase"] = I("post.hurtedHighestBase");//最高工伤基数
        $data["unemploymentHighestBase"] = I("post.unemploymentHighestBase");//最高失业基数
        $data["birthedHighestBase"] = I("post.birthedHighestBase");//最高生育基数
        $data["medicalHighestBase"] = I("post.medicalHighestBase");//最高医疗基数
        $data["largeMedicalHighestBase"] = I("post.largeMedicalHighestBase");//最高大额医疗基数

        $data["highestBase"] = I("post.highestBase");//最高基数
        $data["highestfoud"] = I("post.highestfoud");//最高公积金

        $socialSecurityPlan = D("SocialSecurityPlan");


        //接收失效日期
        if (I("post.iexpiryDate")) {
            $udata["expiryDate"] = strtotime(I("post.iexpiryDate"));//失效日期
            $udatas = $socialSecurityPlan->create($udata);
            $socialSecurityPlan->where("city='{$data["city"]}' and householdType='{$data["householdType"]}' and expiryDate is null")
                ->save($udatas);
        }
        $data["num"] += 1;
        $datas = $socialSecurityPlan->create($data);
        if ($datas) {
            $result = $socialSecurityPlan->add($datas);
        }
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //4.2修改社保方案（原来的数据不做修改，就是新增加一条）
    public function updateSocialSecurityPlan()
    {
        $id = I("post.id");
        $data["city"] = I("post.city");//缴纳地
        $data["householdType"] = I("post.householdType");//户口性质
        $data["effectiveDate"] = strtotime(I("post.effectiveDate"));//生效日期
        $data["expiryDate"] = strtotime(I("post.expiryDate"));//失效日期


        $data["medicalBase"] = I("post.medicalBase");//医疗基数
        $data["medicalRatio"] = I("post.medicalRatio");//医疗比例（个人）
        $data["pensionBase"] = I("post.pensionBase");//养老基数
        $data["pensionRatio"] = I("post.pensionRatio");//养老比例（个人）
        $data["hurtedBase"] = I("post.hurtedBase");//工伤基数
        $data["hurtedRatio"] = I("post.hurtedRatio");//工伤比例（个人）
        $data["unemploymentBase"] = I("post.unemploymentBase");//失业基数
        $data["unemploymentRatio"] = I("post.unemploymentRatio");//失业比例（个人）
        $data["birthedBase"] = I("post.birthedBase");//生育基数
        $data["birthedRatio"] = I("post.birthedRatio");//生育比例（个人）
        $data["medicalRatioTwo"] = I("post.medicalRatioTwo");//医疗比例（公司）
        $data["pensionRatioTwo"] = I("post.pensionRatioTwo");//养老比例（公司）
        $data["hurtedRatioTwo"] = I("post.hurtedRatioTwo");//工伤比例（公司）
        $data["unemploymentRatioTwo"] = I("post.unemploymentRatioTwo");//失业比例（公司）
        $data["birthedRatioTwo"] = I("post.birthedRatioTwo");//生育比例（公司）


        $data["medicalFixedFee"] = I("post.medicalFixedFee");//医疗固定费用（个人）
        $data["medicalFixedFeeTwo"] = I("post.medicalFixedFeeTwo");//固定医疗费用（公司）
        $data["pensionFixedFee"] = I("post.pensionFixedFee");//固定养老费用（个人）
        $data["pensionFixedFeeTwo"] = I("post.pensionFixedFeeTwo");//固定养老费用（公司）
        $data["hurtedFixedFee"] = I("post.hurtedFixedFee");//固定工伤费用（个人）
        $data["hurtedFixedFeeTwo"] = I("post.hurtedFixedFeeTwo");//固定工伤费用（公司）
        $data["unemploymentFixedFee"] = I("post.unemploymentFixedFee");//固定失业费用（个人）
        $data["unemploymentFixedFeeTwo"] = I("post.unemploymentFixedFeeTwo");//固定失业费用（公司）
        $data["birthedFixedFee"] = I("post.birthedFixedFee");//固定生育费用（个人）
        $data["birthedFixedFeeTwo"] = I("post.birthedFixedFeeTwo");//固定生育费用（公司）
        $data["foudBaseFixedFee"] = I("post.foudBaseFixedFee");//固定公积金费用（个人）
        $data["foudBaseFixedFeeTwo"] = I("post.foudBaseFixedFeeTwo");//固定公积金费用（公司）
        $data["largeMedicalFixedFee"] = I("post.largeMedicalFixedFee");//大额医疗费用（个人）
        $data["largeMedicalFixedFeeTwo"] = I("post.largeMedicalFixedFeeTwo");//大额医疗费用（公司）

        $data["foudBase"] = I("post.foudBase");//公积金基数
        $data["foudRatio"] = I("post.foudRatio");//公积金比例
        $data["foudRatioTwo"] = I("post.foudRatioTwo");//公积金比例
        $data["largeMedicalBase"] = I("post.largeMedicalBase");//大额医疗基数
        $data["largeMedicalRatio"] = I("post.largeMedicalRatio");//大额医疗比例
        $data["largeMedicalRatioTwo"] = I("post.largeMedicalRatioTwo");//大额医疗比例
        $data["highestBase"] = I("post.highestBase");//最高基数
        $data["highestfoud"] = I("post.highestfoud");//最高公积金


        $data["pensionHighestBase"] = I("post.pensionHighestBase");//养老最高基数
        $data["hurtedHighestBase"] = I("post.hurtedHighestBase");//最高工伤基数
        $data["unemploymentHighestBase"] = I("post.unemploymentHighestBase");//最高失业基数
        $data["birthedHighestBase"] = I("post.birthedHighestBase");//最高生育基数
        $data["medicalHighestBase"] = I("post.medicalHighestBase");//最高医疗基数
        $data["largeMedicalHighestBase"] = I("post.largeMedicalHighestBase");//最高大额医疗基数
        $socialSecurityPlan = D("SocialSecurityPlan");
        $datas = $socialSecurityPlan->create($data);
        if ($datas) {
            $result = $socialSecurityPlan->add($datas);
            if ($result) {
                $error = 0;
            } else {
                $error = 1;
            }
        }
        self::jsons($error, $result);
    }

    //删除社保方案
    public function deleteSocialSecurityPlan()
    {
        $id = I("post.id");
        $length = strlen($id);
        $socialSecurityPlan = D("SocialSecurityPlan");
        $existing = $socialSecurityPlan->field('city,householdType')->where("id=".$id)->find();
        $socialParameterInformation = D("SocialParameterInformation");
        $existingParameter = $socialParameterInformation->field('payLand,householdType')->where("payLand='{$existing["city"]}' and householdType='{$existing["householdType"]}'")->select();
        $socialPaymentInformation = D("socialPaymentInformation");
        $existingPayment = $socialPaymentInformation->field('payLand,householdType')->where("payLand='{$existing["city"]}' and householdType='{$existing["householdType"]}'")->select();
        if($existingParameter || $existingPayment){
            self::jsons($error=0,$result="已被引用的社保方案不能删除");
        }else{
            if ($length == 1) {
                $where = 'id=' . $id;
            } else {
                $id = array($id);
                $where = 'id in(' . implode(',', $id) . ')';
            }
            $result = $socialSecurityPlan->where($where . " and is_use != '1'")->delete();
            if ($result) {
                $error = 0;
            } else {
                $error = 1;
            }
            self::jsons($error, $result);
        }

    }

    //显示社保信息
    public function socialSecurityInformation()
    {
        $id = I("post.id");
        $socialSecurityInformation = D("SocialSecurityInformation");
        $result = $socialSecurityInformation->field("id,bid,householdType,payLand,payBase,foudBase,medical,pension,unemployment,fund,medicalTwo,pensionTwo,unemploymentTwo,hurted,
            birthed,fundTwo,payAccount,socialStarting,fundStarting")
            ->where("bid=" . $id)->find();
        $result["socialStarting"] = date("Y-m", $result["socialStarting"]);
        $result["fundStarting"] = date("Y-m", $result["fundStarting"]);
        if ($result || $result == "") {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //增加社保信息
    public function addSocialSecurityInformation()
    {
        $data['householdType'] = I("post.householdType");
        $data['payLand'] = I("post.payLand");
        $data['payAccount'] = I("post.payAccount");
        $data['payBase'] = I("post.payBase");//社保基数
        $data['foudBase'] = I("post.foudBase");//公积金基数
        $data['socialStarting'] = strtotime(I("post.socialStarting"));
        $data['fundStarting'] = strtotime(I("post.fundStarting"));

        $data['socialEndTime'] = strtotime(I("post.socialEndTime"));
        $data['fundEndTime'] = strtotime(I("post.fundEndTime"));

        $socialSecurityPlan = D("SocialSecurityPlan");
        $list = $socialSecurityPlan->field("id,city,householdType,medicalBase,medicalRatio,pensionBase,pensionRatio,hurtedBase,
                    hurtedRatio,unemploymentBase,unemploymentRatio,birthedBase,birthedRatio,medicalRatioTwo,pensionRatioTwo,
                    hurtedRatioTwo,unemploymentRatioTwo,birthedRatioTwo,foudBase,foudRatio,foudRatioTwo,largeMedicalBase,largeMedicalRatio,
                    largeMedicalRatioTwo,effectiveDate,expiryDate,is_use,highestfoud,pensionHighestBase,hurtedHighestBase,unemploymentHighestBase,
                    birthedHighestBase,medicalHighestBase,largeMedicalHighestBase,medicalFixedFee,medicalFixedFeeTwo,pensionFixedFee,pensionFixedFeeTwo,
                    hurtedFixedFee,hurtedFixedFeeTwo,unemploymentFixedFee,unemploymentFixedFeeTwo,birthedFixedFee,birthedFixedFeeTwo,foudBaseFixedFee,
                    foudBaseFixedFeeTwo,largeMedicalFixedFee,largeMedicalFixedFeeTwo")
            ->where("city='{$data['payLand']}' and householdType='{$data['householdType']}' and expiryDate is null")->find();
        //医疗基数和社保基数对比，谁大用谁
        if ($list["medicalBase"] > $data['payBase']) {
            //用大的值乘以比例数
            $data["medical"] = round((($list["medicalBase"] * $list["medicalRatio"] + $list["medicalBase"] * $list["largeMedicalRatio"]) / 100) + $list["medicalFixedFee"] + $list["largeMedicalFixedFee"], 2);//个人
            $data["medicalTwo"] = round((($list["medicalBase"] * $list["medicalRatioTwo"] + $list["medicalBase"] * $list["largeMedicalRatioTwo"]) / 100) + $list["medicalFixedFeeTwo"] + $list["largeMedicalFixedFeeTwo"], 2);//公司
            $data["is_use"] = "1";

            //把使用的基数存到数据库里
            $data["useMedical"] = $data["medical"];
            $data["useMedicalTwo"] = $data["medicalTwo"];
        } else {
            if ($data['payBase'] < $list["medicalHighestBase"]) {
                $data["medical"] = round((($data['payBase'] * $list["medicalRatio"] + $data['payBase'] * $list["largeMedicalRatio"]) / 100) + $list["medicalFixedFee"] + $list["largeMedicalFixedFee"], 2);//个人
                $data["medicalTwo"] = round((($data['payBase'] * $list["medicalRatioTwo"] + $data['payBase'] * $list["largeMedicalRatioTwo"]) / 100) + $list["medicalFixedFeeTwo"] + $list["largeMedicalFixedFeeTwo"], 2);//公司
                $data["is_use"] = "1";
                $data["useMedical"] = $data["medical"];
                $data["useMedicalTwo"] = $data["medicalTwo"];
                $data["is_use"] = "1";
            } else {
                $data["medical"] = round((($list['medicalHighestBase'] * $list["medicalRatio"] + $list['medicalHighestBase'] * $list["largeMedicalRatio"]) / 100) + $list["medicalFixedFee"] + $list["largeMedicalFixedFee"], 2);//个人
                $data["medicalTwo"] = round((($list['medicalHighestBase'] * $list["medicalRatioTwo"] + $list['medicalHighestBase'] * $list["largeMedicalRatioTwo"]) / 100) + $list["medicalFixedFeeTwo"] + $list["largeMedicalFixedFeeTwo"], 2);//公司
                $data["is_use"] = "1";
                $data["useMedical"] = $data["medical"];
                $data["useMedicalTwo"] = $data["medicalTwo"];
                $data["is_use"] = "1";
            }

        }
        //养老基数
        if ($list["pensionBase"] > $data['payBase']) {
            $data["pension"] = round(($list["pensionBase"] * $list["pensionRatio"] / 100) + $list["pensionFixedFee"], 2);
            $data["pensionTwo"] = round($list["pensionBase"] * $list["pensionRatioTwo"] / 100 + $list["pensionFixedFeeTwo"], 2);
            $data["usePension"] = $data["pension"];
            $data["usePensionTwo"] = $data["pensionTwo"];
        } else {
            if ($data["payBase"] < $list["pensionHighestBase"]) {
                $data["pension"] = round($data["payBase"] * $list["pensionRatio"] / 100 + $list["pensionFixedFee"], 2);
                $data["pensionTwo"] = round($data["payBase"] * $list["pensionRatioTwo"] / 100 + $list["pensionFixedFeeTwo"], 2);
                $data["usePension"] = $data["pension"];
                $data["usePensionTwo"] = $data["pensionTwo"];
            } else {
                $data["pension"] = round($list["pensionHighestBase"] * $list["pensionRatio"] / 100 + $list["pensionFixedFee"], 2);
                $data["pensionTwo"] = round($list["pensionHighestBase"] * $list["pensionRatioTwo"] / 100 + $list["pensionFixedFeeTwo"], 2);
                $data["usePension"] = $data["pension"];
                $data["usePensionTwo"] = $data["pensionTwo"];
            }

        }
        //失业基数
        if ($list["unemploymentBase"] > $data["payBase"]) {
            $data["unemployment"] = round($list["unemploymentBase"] * $list["unemploymentRatio"] / 100 + $list["unemploymentFixedFee"], 2);
            $data["unemploymentTwo"] = round($list["unemploymentBase"] * $list["unemploymentRatioTwo"] / 100 + $list["unemploymentFixedFeeTwo"], 2);
            $data["useUnemployment"] = $data["unemployment"];
            $data["useUnemploymentTwo"] = $data["unemploymentTwo"];
        } else {
            if ($data["payBase"] < $list["unemploymentHighestBase"]) {
                $data["unemployment"] = round($data["payBase"] * $list["unemploymentRatio"] / 100 + $list["unemploymentFixedFee"], 2);
                $data["unemploymentTwo"] = round($data["payBase"] * $list["unemploymentRatioTwo"] / 100 + $list["unemploymentFixedFeeTwo"], 2);
                $data["useUnemployment"] = $data["unemployment"];
                $data["useUnemploymentTwo"] = $data["unemploymentTwo"];
            } else {
                $data["unemployment"] = round($list["unemploymentHighestBase"] * $list["unemploymentRatio"] / 100 + $list["unemploymentFixedFee"], 2);
                $data["unemploymentTwo"] = round($list["unemploymentHighestBase"] * $list["unemploymentRatioTwo"] / 100 + $list["unemploymentFixedFeeTwo"], 2);
                $data["useUnemployment"] = $data["unemployment"];
                $data["useUnemploymentTwo"] = $data["unemploymentTwo"];
            }

        }
        //公积金基数
        if ($list["foudBase"] > $data["foudBase"]) {
            $data["fund"] = round($list["foudBase"] * $list["foudRatio"] / 100 + $list["foudBaseFixedFee"], 2);
            $data["fundTwo"] = round($list["foudBase"] * $list["foudRatioTwo"] / 100 + $list["foudBaseFixedFeeTwo"], 2);
            $data["useFund"] = $data["fund"];
            $data["useFundTwo"] = $data["fundTwo"];
        } else {
            if ($data["foudBase"] < $list["highestfoud"]) {
                $data["fund"] = round($data["foudBase"] * $list["foudRatio"] / 100 + $list["foudBaseFixedFee"], 2);
                $data["fundTwo"] = round($data["foudBase"] * $list["foudRatioTwo"] / 100 + $list["foudBaseFixedFeeTwo"], 2);
                $data["useFund"] = $data["fund"];
                $data["useFundTwo"] = $data["fundTwo"];
            } else {
                $data["fund"] = round($list["highestfoud"] * $list["foudRatio"] / 100 + $list["foudBaseFixedFee"], 2);
                $data["fundTwo"] = round($list["highestfoud"] * $list["foudRatioTwo"] / 100 + $list["foudBaseFixedFeeTwo"], 2);
                $data["useFund"] = $data["fund"];
                $data["useFundTwo"] = $data["fundTwo"];
            }

        }
        //工伤
        if ($list["hurtedBase"] > $data["payBase"]) {
            $data["hurted"] = round($list["hurtedBase"] * $list["hurtedRatio"] / 100 + $list["hurtedFixedFee"], 2);
            $data["hurtedTwo"] = round($list["hurtedBase"] * $list["hurtedRatioTwo"] / 100 + $list["hurtedFixedFeeTwo"], 2);
            $data["useHurted"] = $data["hurted"];
            $data["useHurtedTwo"] = $data["hurtedTwo"];
        } else {
            if ($data["payBase"] < $list["hurtedHighestBase"]) {
                $data["hurted"] = round($data["payBase"] * $list["hurtedRatio"] / 100 + $list["hurtedFixedFee"], 2);
                $data["hurtedTwo"] = round($data["payBase"] * $list["hurtedRatioTwo"] / 100 + $list["hurtedFixedFeeTwo"], 2);
                $data["useHurted"] = $data["hurted"];
                $data["useHurtedTwo"] = $data["hurtedTwo"];
            } else {
                $data["hurted"] = round($list["hurtedHighestBase"] * $list["hurtedRatio"] / 100 + $list["hurtedFixedFee"], 2);
                $data["hurtedTwo"] = round($list["hurtedHighestBase"] * $list["hurtedRatioTwo"] / 100 + $list["hurtedFixedFeeTwo"], 2);
                $data["useHurted"] = $data["hurted"];
                $data["useHurtedTwo"] = $data["hurtedTwo"];
            }

        }
        //生育
        if ($list["birthedBase"] > $data["payBase"]) {
            $data["birthed"] = round($list["birthedBase"] * $list["birthedRatio"] / 100 + $list["birthedFixedFee"], 2);
            $data["birthedTwo"] = round($list["birthedBase"] * $list["birthedRatioTwo"] / 100 + $list["birthedFixedFeeTwo"], 2);
            $data["useBirthed"] = $data["birthed"];
            $data["useBirthedTwo"] = $data["birthedTwo"];
        } else {
            if ($data["payBase"] < $list["birthedHighestBase"]) {
                $data["birthed"] = round($data["payBase"] * $list["birthedRatio"] / 100 + $list["birthedFixedFee"], 2);
                $data["birthedTwo"] = round($data["payBase"] * $list["birthedRatioTwo"] / 100 + $list["birthedFixedFeeTwo"], 2);
                $data["useBirthed"] = $data["birthed"];
                $data["useBirthedTwo"] = $data["birthedTwo"];
            } else {
                $data["birthed"] = round($list["birthedHighestBase"] * $list["birthedRatio"] / 100 + $list["birthedFixedFee"], 2);
                $data["birthedTwo"] = round($list["birthedHighestBase"] * $list["birthedRatioTwo"] / 100 + $list["birthedFixedFeeTwo"], 2);
                $data["useBirthed"] = $data["birthed"];
                $data["useBirthedTwo"] = $data["birthedTwo"];
            }

        }
        $data["usePlanId"] = $list["id"];
        if ($data) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $data);
    }

    //增加社保信息
    public function addSocialSecurityInformationTwo()
    {
        $data['bid'] = I("post.id");
        $data['householdType'] = I("post.householdType");
        $data['payLand'] = I("post.payLand");
        $data['payAccount'] = I("post.payAccount");
        $data['payBase'] = I("post.payBase");//社保基数
        $data['foudBase'] = I("post.foudBase");//公积金基数

        $data['socialStarting'] = I("post.socialStarting");//社保起始月
        $data['fundStarting'] = I("post.fundStarting");//公积金起始月

        $data['medical'] = I("post.medical");
        $data['pension'] = I("post.pension");
        $data['unemployment'] = I("post.unemployment");
        $data['fund'] = I("post.fund");
        $data['medicalTwo'] = I("post.medicalTwo");
        $data['pensionTwo'] = I("post.pensionTwo");
        $data['unemploymentTwo'] = I("post.unemploymentTwo");
        $data['hurted'] = I("post.hurtedTwo");
        $data['birthed'] = I("post.birthedTwo");
        $data['fundTwo'] = I("post.fundTwo");
        $data["usePlanId"] = I("post.usePlanId");
        $data['socialStarting'] = strtotime(I("post.socialStarting"));
        $data['fundStarting'] = strtotime(I("post.fundStarting"));
        $socialSecurityInformation = D("SocialSecurityInformation");
        $datas = $socialSecurityInformation->create($data);
        if ($datas) {
            $result = $socialSecurityInformation->where("bid = " . $data["bid"])->add($datas);
            if ($result) {
                $error = 0;
            } else {
                $error = 1;
            }
        }
        self::jsons($error, $result);
    }

    public function updateSocialSecurityInformationTwo()
    {
        $data['bid'] = I("post.id");
        $data['householdType'] = I("post.householdType");
        $data['payLand'] = I("post.payLand");
        $data['payAccount'] = I("post.payAccount");
        $data['payBase'] = I("post.payBase");//社保基数
        $data['foudBase'] = I("post.foudBase");//公积金基数
        $data['socialStarting'] = I("post.socialStarting");//社保起始月
        $data['fundStarting'] = I("post.fundStarting");//公积金起始月
        $data['medical'] = I("post.medical");
        $data['pension'] = I("post.pension");
        $data['unemployment'] = I("post.unemployment");
        $data['fund'] = I("post.fund");
        $data['medicalTwo'] = I("post.medicalTwo");
        $data['pensionTwo'] = I("post.pensionTwo");
        $data['unemploymentTwo'] = I("post.unemploymentTwo");
        $data['hurted'] = I("post.hurtedTwo");
        $data['birthed'] = I("post.birthedTwo");
        $data['fundTwo'] = I("post.fundTwo");

        $data['socialStarting'] = strtotime(I("post.socialStarting"));
        $data['fundStarting'] = strtotime(I("post.fundStarting"));
        $socialSecurityInformation = D("SocialSecurityInformation");
        $datas = $socialSecurityInformation->create($data);
        if ($datas) {
            $result = $socialSecurityInformation->where("bid = " . $data['bid'])->save($datas);
        }
        self::jsons($error = 0, $result);
    }

    //下拉显示户口信息
    public function household()
    {
        $household = D("HouseholdType");
        $result = $household->field("id,name")->select();
        if ($result || $result == "") {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //增加户口类型
    public function addHousehold()
    {
        $data["name"] = I("post.name");
        $household = D("HouseholdType");
        $datas = $household->create($data);
        if ($datas) {
            $result = $household->add($datas);
        }
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //修改户口类型
    public function updateHousehold()
    {
        $id = I("post.id");
        $data["name"] = I("post.name");
        $household = D("HouseholdType");
        $datas = $household->create($data);
        if ($datas) {
            $result = $household->where("id = " . $id)->save($datas);
        }
        if ($result || $result == "") {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);

    }

    //删除户口类型
    public function deleteHousehold()
    {
        $id = I("post.id");
        $length = strlen($id);
        $household = D("HouseholdType");
        if ($length == 1) {
            $where = 'id=' . $id;
        } else {
            $id = array($id);
            $where = 'id in(' . implode(',', $id) . ')';
        }
        $result = $household->where($where)->delete();
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //下拉选择社保缴纳账户
    public function payAccount()
    {
        $payAccount = D("Payaccount");
        $result = $payAccount->field("id,name")->select();
        if ($result || $result == "") {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //增加社保缴纳账户
    public function addPayAccount()
    {
        $data["name"] = I("post.name");
        $payAccount = D("Payaccount");
        $datas = $payAccount->create($data);
        if ($datas) {
            $result = $payAccount->add($datas);
        }
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //修改社保缴纳账户
    public function updatePayAccount()
    {
        $id = I("post.id");
        $data["name"] = I("post.name");
        $payAccount = D("Payaccount");
        $datas = $payAccount->create($data);
        if ($datas) {
            $result = $payAccount->where("id = " . $id)->save($datas);
        }
        if ($result || $result == "") {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //删除社保缴纳账户
    public function deletePayAccount()
    {
        $id = I("post.id");
        $length = strlen($id);
        $payAccount = D("Payaccount");
        $existing = $payAccount->field("id,name")->where("id=".$id)->find();
        $socialSecurityInformation = D("SocialSecurityInformation");
        $existingSecurity = $socialSecurityInformation->field("id,payAccount")->where("payAccount=".$existing["name"])->select();
        if($existingSecurity){
            self::jsons($error=0,$result="被引用的缴纳账户不能被删除");
        }else{
            if ($length == 1) {
                $where = 'id=' . $id;
            } else {
                $id = array($id);
                $where = 'id in(' . implode(',', $id) . ')';
            }
            $result = $payAccount->where($where)->delete();
            if ($result) {
                $error = 0;
            } else {
                $error = 1;
            }
            self::jsons($error, $result);
        }
    }

    //显示银行信息
    public function BankInformation()
    {
        $id = I("post.id");
        $bankInformation = D("BankInformation");
        $result = $bankInformation->field("id,openBank,bankCardNumber,accountTitle,isDefault")
            ->where("bid=" . $id)->find();
        $result["openBank"] = explode(',', $result["openBank"]);
        $result["bankCardNumber"] = explode(',', $result["bankCardNumber"]);
        $result["accountTitle"] = explode(',', $result["accountTitle"]);
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //增加银行卡信息
    public function addBankInformation()
    {
        $data["bid"] = I("post.id");
        if (I("post.bankCardNumber")) {
            $bankCardNumber = implode(',', I("post.bankCardNumber"));
        }
        if (I("post.openBank")) {
            $openBank = implode(',', I("post.openBank"));
        }
        if (I("post.accountTitle")) {
            $accountTitle = implode(',', I("post.accountTitle"));
        }
        $data["bankCardNumber"] = $bankCardNumber;
        $data["openBank"] = $openBank;
        $data["accountTitle"] = $accountTitle;
        $data["isDefault"] = I("post.isDefault");
        $bankInformation = D("BankInformation");
        $datas = $bankInformation->create($data);
        if ($datas) {
            $result = $bankInformation->add($datas);
        }
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //修改银行卡信息
    public function updateBankInformation()
    {
        $id = I("post.id");
        if (I("post.bankCardNumber")) {
            $bankCardNumber = implode(',', I("post.bankCardNumber"));
        }
        if (I("post.openBank")) {
            $openBank = implode(',', I("post.openBank"));
        }
        if (I("post.accountTitle")) {
            $accountTitle = implode(',', I("post.accountTitle"));
        }
        $data["bankCardNumber"] = $bankCardNumber;
        $data["openBank"] = $openBank;
        $data["accountTitle"] = $accountTitle;
        $data["isDefault"] = I("post.isDefault");
        $bankInformation = D("BankInformation");
        $datas = $bankInformation->create($data);
        if ($datas) {
            $result = $bankInformation->where("pid=" . $id)->save($datas);
        }
//        if($result){
//            $error = 0;
//        }else{
//            $error = 1;
//        }
        self::jsons($error = 0, $result);
    }

    //显示考勤信息
    public function attendanceInformation()
    {
        $id = I("post.id");
        $attendanceInformation = D("AttendanceInformation");
        $result = $attendanceInformation->table("oa_attendance_information as a")->join("oa_attendance as b on b.id = a.attendanceSystem")
            ->join("oa_shift as c on c.id=a.shift")
            ->field("a.id,a.bid,b.name as attendanceSystem,b.content,c.name as shift,c.content,a.restDayPlan")
            ->where("bid=" . $id)->find();
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }


    //增加考勤信息
    public function addAttendanceInformation()
    {
        $data['bid'] = I("post.id");
        $data['attendanceSystem'] = I("post.attendanceSystem");
        $data['shift'] = I("post.shift");
        $data['restDayPlan'] = I("post.restDayPlan");
        $attendanceInformation = D("AttendanceInformation");
        $datas = $attendanceInformation->create($data);
        if ($datas) {
            $result = $attendanceInformation->where("bid = " . $data["bid"])->save($datas);
        }
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //修改考勤信息
    public function updateAttendanceInformation()
    {
        $data['bid'] = I("post.id");
        $data['attendanceSystem'] = I("post.attendanceSystem");
        $data['shift'] = I("post.shift");;
        $data['restDayPlan'] = I("post.restDayPlan");
        $attendanceInformation = D("AttendanceInformation");
        $datas = $attendanceInformation->create($data);
        if ($datas) {
            $result = $attendanceInformation->where("bid = " . $data["bid"])->save($datas);
        }
//        if ($result) {
//            $error = 0;
//        } else {
//            $error = 1;
//        }
        self::jsons($error = 0, $result);
    }

    //上传简历方法
    public function uploadResume()
    {
        $upload = new \Think\Upload();
        $upload->maxSize = 3145728;
        $upload->exts = array('jpg', 'png', 'doc', 'docx', 'pdf');// 设置附件上传类型
        $upload->rootPath = './Public/Uploads/resume/';
        $upload->saveName = array('uniqid', mt_rand(1, 999999) . '_' . md5(uniqid()));
        $upload->subName = array('date', 'Ymd');
        $info = $upload->upload();
        if (!$info) {
            $this->error($upload->getError());
        } else {
            $data["file"] = "/Public/Uploads/resume/" . $info[0]['savepath'] . $info[0]['savename'];
            $data["oldName"] = $info[0]["name"];
        }
        if ($data) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $data);
    }

    //公司信息
    public function company()
    {
        $company = D("Company");
        $result = $company->field("id,name")->select();
        if ($result || $result == "") {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //增加公司信息
    public function addCompany()
    {
        $data["name"] = I("post.name");
        $company = D("Company");
        $datas = $company->create($data);
        if ($datas) {
            $result = $company->add($datas);
        }
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);

    }

    //修改公司信息
    public function updateCompany()
    {
        $id = I("post.id");
        $data["name"] = I("post.name");
        $company = D("Company");
        $datas = $company->create($data);
        if ($datas) {
            $result = $company->where("id = " . $id)->save($datas);
        }
        if ($result || $result == "") {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //删除公司信息
    public function deleteCompany()
    {
        $id = I("post.id");
        $length = strlen($id);
        $company = D("Company");
        if ($length == 1) {
            $where = 'id=' . $id;
        } else {
            $id = array($id);
            $where = 'id in(' . implode(',', $id) . ')';
        }
        $result = $company->where($where)->delete();
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //4.3员工社保档案列表
    public function socialFiles()
    {
        //社保起始月查询
        $starSocialStarTime = strtotime(I("starSocialStarTime"));

        $starSocialEndTime = strtotime(I("starSocialEndTime"));

        if ($starSocialStarTime != '' && $starSocialEndTime != '') {
            $map['socialStarting'] = array('between', "$starSocialStarTime,$starSocialEndTime");
        }
        //社保结束月查询
        $endSocialStarTime = strtotime(I("endSocialStarTime"));

        $endSocialEndTime = strtotime(I("endSocialEndTime"));

        if ($endSocialStarTime != '' && $endSocialEndTime != '') {
            $map['socialEndTime'] = array('between', "$endSocialStarTime,$endSocialEndTime");
        }
        //公积金起始月
        $starFundStarTime = strtotime(I("starFundStarTime"));

        $starFundEndTime = strtotime(I("starFundEndTime"));

        if ($starFundStarTime != '' && $starFundEndTime != '') {
            $map['fundStarting'] = array('between', "$starFundStarTime,$starFundEndTime");
        }
        //公积金结束月
        $endFundStarTime = strtotime(I("endFundStarTime"));

        $endFundEndTime = strtotime(I("endFundEndTime"));

        if ($endFundStarTime != '' && $endFundEndTime != '') {
            $map['fundEndTime'] = array('between', "$endFundStarTime,$endFundEndTime");
        }
        //工号
        if (I("unumber")) {
            $map['unumber'] = array('like', '%' . I('unumber') . '%');
        }
        //姓名
        if (I("name")) {
            $map['name'] = array('like', '%' . I('name') . '%');
        }
        //证件号
        if (I("cardNumber")) {
            $map['cardNumber'] = array('like', '%' . I('cardNumber') . '%');
        }
        //部门
        if (I("department_id")) {
            $map['department_id'] = I("department_id");
        }
        //社保缴纳地
        if (I("payLand")) {
            $map['payLand'] = I("payLand");
        }
        //户口性质
        if (I("householdType")) {
            $map['householdType'] = I("householdType");
        }
        //公积金基数
        if (I("foudBase")) {
            $map['foudBase'] = I("foudBase");
        }
        //社保基数
        if (I("payBase")) {
            $map['payBase'] = I("payBase");
        }
        $basicInformation = D("BasicInformation");

        //查出来的数据存储到员工社保档案临时表里
        $arr = $basicInformation->table("oa_basic_information as a")->join("oa_personnel_information as b on b.bid=a.id")
            ->join("oa_organizational_structure as d on d.id=a.department_id")
            ->join("oa_social_security_information as e on e.bid=a.id")->join("oa_payaccount as f on f.id=e.payAccount")
            ->field("a.id,a.name,a.unumber,a.department_id,b.status,b.cardNumber,d.department_name,e.payLand,e.householdType,
                   e.payBase,e.socialStarting,e.foudBase,e.fundStarting,e.payAccount,e.socialEndTime,e.fundEndTime,
                   f.name as payAccountName")->select();
//        echo $basicInformation->getLastsql();
        $socialArchives = D("SocialArchives");
        $condition = $socialArchives->field("id,bid")->select();
        foreach ($arr as $ka => $va) {
            $li[] = $va["id"];

        }
//        var_dump($condition);
        $res = $socialArchives->field('id,bid')->where(array('bid' => array('IN', $li)))->select();
//        var_dump($res);
        if ($res) {
            foreach ($res as $v) {
                $res[] = $v['bid'];
            }
            $aa = array_diff($li, $res);
            foreach ($arr as $k => $v) {
                if (!in_array($v['id'], $aa)) {
                    unset($arr[$k]);
                }
            }
//            var_dump($aa);
//            var_dump($arr);
            foreach ($arr as $key => $value) {
                $data["bid"] = $value["id"];
                $data["name"] = $value["name"];
                $data["unumber"] = $value["unumber"];
                $data["department"] = $value["department_name"];
                $data["department_id"] = $value["department_id"];
                $data["payLand"] = $value["payLand"];
                $data["householdType"] = $value["householdType"];
                $data["payBase"] = $value["payBase"];
                $data["socialStarTime"] = $value["socialStarting"];
                $data["fundBase"] = $value["foudBase"];
                $data["fundStarTime"] = $value["fundStarting"];
                $data["payAccount"] = $value["payAccountName"];
                $data["cardNum"] = $value["cardNumber"];
                $data["status"] = $value["status"];
                $data["socialEndTime"] = $value["socialEndTime"];
                $data["fundEndTime"] = $value["fundEndTime"];
                $data["payAccount_id"] = $value["payAccount"];
                $datas = $socialArchives->create($data);
                if ($datas) {
                    $socialArchives->add($datas);
                }
            }
        } else {
            foreach ($arr as $ka => $va) {
                $data["bid"] = $va["id"];
                $data["name"] = $va["name"];
                $data["unumber"] = $va["unumber"];
                $data["department"] = $va["department_name"];
                $data["department_id"] = $va["department_id"];
                $data["payLand"] = $va["payLand"];
                $data["householdType"] = $va["householdType"];
                $data["payBase"] = $va["payBase"];
                $data["socialStarTime"] = $va["socialStarting"];
                $data["fundBase"] = $va["foudBase"];
                $data["fundStarTime"] = $va["fundStarting"];
                $data["payAccount"] = $va["payAccountName"];
                $data["cardNum"] = $va["cardNumber"];
                $data["status"] = $va["status"];
                $data["socialEndTime"] = $va["socialEndTime"];
                $data["fundEndTime"] = $va["fundEndTime"];
                $data["payAccount_id"] = $va["payAccount"];
                $datas = $socialArchives->create($data);
                if ($datas) {
                    $socialArchives->add($datas);
                }
            }

        }
        $pages = I("pages");
        if (I("post.status") == '2') {
            $map['status'] = '2';
            $count = $socialArchives->field('id,bid,unumber,name,cardNum,department,payLand,householdType,payBase,socialStarTime,
            socialEndTime,fundBase,fundStarTime,fundEndTime,payAccount,status')->where($map)->count();
        } else {
            $map['status'] = array('neq', '2');
            $count = $socialArchives->field('id,bid,unumber,name,cardNum,department,payLand,householdType,payBase,socialStarTime,
            socialEndTime,fundBase,fundStarTime,fundEndTime,payAccount,status')->where($map)->count();
        }
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
        if (I("post.status") == '2') {
            $map['status'] = '2';
            $lists = $socialArchives->field('id,bid,unumber,name,cardNum,department,payLand,householdType,payBase,socialStarTime,
            socialEndTime,fundBase,fundStarTime,fundEndTime,payAccount,status,department_id')->where($map)->limit($offset, $pages)->select();
        } else {
            $map['status'] = array('neq', '2');
            $lists = $socialArchives->field('id,bid,unumber,name,cardNum,department,payLand,householdType,payBase,socialStarTime,
            socialEndTime,fundBase,fundStarTime,fundEndTime,payAccount,status,department_id')->where($map)->limit($offset, $pages)->select();
        }

        foreach ($lists as &$val) {
            if ($val['socialStarTime'] == 0) {
                $val['socialStarTime'] = null;
            } else {
                $val['socialStarTime'] = date('Y-m', $val['socialStarTime']);
            }
            if ($val['socialEndTime'] == 0) {
                $val['socialEndTime'] = null;
            } else {
                $val['socialEndTime'] = date('Y-m', $val['socialEndTime']);
            }
            if ($val['fundStarTime'] == 0) {
                $val['fundStarTime'] = null;
            } else {
                $val['fundStarTime'] = date('Y-m', $val['fundStarTime']);
            }
            if ($val['fundEndTime'] == 0) {
                $val['fundEndTime'] = null;
            } else {
                $val['fundEndTime'] = date('Y-m', $val['fundEndTime']);
            }
        }
        $result = array(
            'page' => $page,
            'pageNum' => $pageNum,
            'result' => $lists
        );
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //4.3点击状态显示员工社保档案列表
    public function clickStatusSocialFiles()
    {
        //接收状态
        $status = I("post.status");
        $pages = I("pages");
        $socialArchives = D("SocialArchives");
        if ($status == '2') {
            $count = $socialArchives->field('id,bid,unumber,name,cardNum,department,payLand,householdType,payBase,socialStarTime,
            socialEndTime,fundBase,fundStarTime,fundEndTime,payAccount,status')->where("status='2'")->count();
        } else {
            $count = $socialArchives->field('id,bid,unumber,name,cardNum,department,payLand,householdType,payBase,socialStarTime,
            socialEndTime,fundBase,fundStarTime,fundEndTime,payAccount,status')->where("status !='2'")->count();
        }
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
        if ($status == '2') {

            $list = $socialArchives->field('id,bid,unumber,name,cardNum,department,payLand,householdType,payBase,socialStarTime,
            socialEndTime,fundBase,fundStarTime,fundEndTime,payAccount,status')->where("status='2'")->limit($offset, $pages)->select();
        } else {
            $list = $socialArchives->field('id,bid,unumber,name,cardNum,department,payLand,householdType,payBase,socialStarTime,
            socialEndTime,fundBase,fundStarTime,fundEndTime,payAccount,status')->where("status !='2'")->limit($offset, $pages)->select();
        }
        foreach ($list as &$val) {
            if ($val['socialStarTime'] == 0) {
                $val['socialStarTime'] = null;
            } else {
                $val['socialStarTime'] = date('Y-m', $val['socialStarTime']);
            }
            if ($val['fundStarTime'] == 0) {
                $val['fundStarTime'] = null;
            } else {
                $val['fundStarTime'] = date('Y-m', $val['fundStarTime']);
            }
            if ($val['socialEndTime'] == 0) {
                $val['socialEndTime'] = null;
            } else {
                $val['socialEndTime'] = date('Y-m', $val['socialEndTime']);
            }
            if ($val['fundEndTime'] == 0) {
                $val['fundEndTime'] = null;
            } else {
                $val['fundEndTime'] = date('Y-m', $val['fundEndTime']);
            }
        }
        $result = array(
            'page' => $page,
            'pageNum' => $pageNum,
            'result' => $list
        );

        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //4.3点击查看员工社保档案列表
    public function checkSocialFiles()
    {
        $bid = I("post.bid");
        $socialArchives = D("SocialArchives");
        $result = $socialArchives->field('id,bid,unumber,name,cardNum,department,payLand,householdType,payBase,socialStarTime,
            socialEndTime,fundBase,fundStarTime,fundEndTime,payAccount,status')->where("bid=" . $bid)->find();
        if ($result['socialStarTime']) {
            $result['socialStarTime'] = date('Y-m-d', $result['socialStarTime']);
        } else {
            $result['socialStarTime'] = null;
        }
        if ($result['socialEndTime']) {
            $result['socialEndTime'] = date('Y-m-d', $result['socialEndTime']);

        } else {
            $result['socialEndTime'] = null;
        }
        if ($result['fundStarTime']) {
            $result['fundStarTime'] = date('Y-m-d', $result['fundStarTime']);

        } else {
            $result['fundStarTime'] = null;
        }
        if ($result['fundEndTime']) {
            $result['fundEndTime'] = date('Y-m-d', $result['fundEndTime']);

        } else {
            $result['fundEndTime'] = null;
        }
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //4.3修改员工社保档案列表
    public function updateSocialFiles()
    {
        $id = I("post.id");
        $socialArchives = D("SocialArchives");
        $data["bid"] = I("post.bid");
        $data["unumber"] = I("post.unumber");
        $data["name"] = I("post.name");
        $data["cardNum"] = I("post.cardNum");
        $data["department"] = I("post.department");

        $data["payLand"] = I("post.payLand");
        $data["householdType"] = I("post.householdType");
        $data["payBase"] = I("post.payBase");
        $data["socialStarTime"] = strtotime(I("post.socialStarTime"));
        $data["fundBase"] = I("post.fundBase");
        $data["fundStarTime"] = strtotime(I("post.fundStarTime"));
        $data["payAccount"] = I("post.payAccount");
        $data["status"] = I("post.status");
        $data["socialEndTime"] = strtotime(I("post.socialEndTime"));
        $data["fundEndTime"] = strtotime(I("post.fundEndTime"));
        if ($data["socialEndTime"] == 0) {
            $data["socialEndTime"] = '';
        }
        if (!$data["fundEndTime"] == 0) {
            $data["fundEndTime"] = '';
        }
        $arr["socialEndTime"] = strtotime(I("post.socialStarTime"), "-1 month");
        $arr["fundEndTime"] = strtotime(I("post.fundStarTime"), "-1 month");
        $arrs = $socialArchives->create($arr);
        if ($arrs) {
            $socialArchives->where("id=" . $id)->save($arrs);
        }
        $datas = $socialArchives->create($data);
        if ($datas) {
            $result = $socialArchives->add($datas);
        }
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //4.3信息导入
    public function uploadSocialFiles()
    {
        $upload = new \Think\Upload();
        $upload->maxSize = 3145728;
        $upload->exts = array();// 设置附件上传类型
        $upload->rootPath = './Public/Uploads/socialFiles/';
        $upload->saveName = time() . rand(10000, 99999);
        $info = $upload->upload();
        if (!$info) {
            $this->error($upload->getError());
        } else {
            $url = "./Public/Uploads/socialFiles/" . $info[0]['savepath'] . $info[0]['savename'];
        }
        if (!$url) {
            //文件不存在
            $error = 2;
        }
        $basicInformation = D("BasicInformation");
        $socialArchives = D("SocialArchives");
        $list = $socialArchives->field("id,bid,unumber,name,cardNum,department,payLand,householdType,payBase,socialStarTime,
            socialEndTime,fundBase,fundStarTime,fundEndTime,payAccount,status,department_id")->select();
        foreach ($list as $key => $value) {
            $fName[] = $value["department_name"];
        }
        $finename = $url;
        $type = pathinfo($finename);
        $type = strtolower($type["extension"]);
        $type = $type === 'csv' ? $type : 'Excel2007';
        Vendor('PHPExcel.PHPExcel');
        $objReader = \PHPExcel_IOFactory::createReader($type);
        $objPHPExcel = $objReader->load($finename);
        $sheet = $objPHPExcel->getSheet(0);
        // 取得总行数
        $highestRow = $sheet->getHighestRow();
        // 取得总列数
        $highestColumn = $sheet->getHighestColumn();
        //循环读取excel文件,读取一条,插入一条
        $data = array();
        for ($row = 2; $row <= $highestRow; $row++) {
            $rowData = $sheet->rangeToArray('A' . $row . ':' . $highestColumn . $row, NULL, TRUE, FALSE);
            //这里得到的rowData都是一行的数据，得到数据后自行处理，我们这里只打出来看看效果
            $rowData[0][8] = strtotime(gmdate("Y-m-d H:i:s", \PHPExcel_Shared_Date::ExcelToPHP($row[0][8])));
            $rowData[0][9] = strtotime(gmdate("Y-m-d H:i:s", \PHPExcel_Shared_Date::ExcelToPHP($row[0][9])));
            $rowData[0][11] = strtotime(gmdate("Y-m-d H:i:s", \PHPExcel_Shared_Date::ExcelToPHP($row[0][11])));
            $rowData[0][12] = strtotime(gmdate("Y-m-d H:i:s", \PHPExcel_Shared_Date::ExcelToPHP($row[0][12])));
            if ($rowData[0][14] == "正式") {
                $rowData[0]['status'] = '1';
            }
            if ($rowData[0][14] == "离职") {
                $rowData[0]['status'] = '2';
            }
            if ($rowData[0][14] == "试用") {
                $rowData[0]['status'] = '4';
            }
            $parentId = $basicInformation->field("id,name,unumber,department_id")->where("name=" . "'" . $rowData[0][2] . "'")->find();
            $rowData[0]['bid'] = $parentId["id"];
            $rowData[0]['department_id'] = $parentId["department_id"];
            $con["bid"] = $rowData[0]['bid'];
            $con["unumber"] = $rowData[0]['1'];
            $con["name"] = $rowData[0]['2'];
            $con["cardNum"] = $rowData[0]["3"];
            $con["department"] = $rowData[0]["4"];
            $con["payLand"] = $rowData[0]["5"];
            $con["householdType"] = $rowData[0]["6"];
            $con["payBase"] = $rowData[0]["7"];
            $con["socialStarTime"] = $rowData[0]["8"];
            $con["socialEndTime"] = $rowData[0]["9"];
            $con["fundBase"] = $rowData[0]["10"];
            $con["fundStarTime"] = $rowData[0]["11"];
            $con["fundEndTime"] = $rowData[0]["12"];
            $con["payAccount"] = $rowData[0]["13"];
            $con["status"] = $rowData[0]["status"];
            $con["department_id"] = $rowData[0]["department_id"];
            $datas = $socialArchives->create($con);
            if ($datas) {
                $result = $socialArchives->add($datas);
            }
            if ($result) {
                $error = 0;
            } else {
                $error = 0;
            }
        }
        echo self::jsons($error, $result);
    }

    //4.3信息导出
    public function exportSocialFiles()
    {
        $socialArchives = D("SocialArchives");
        $result = $socialArchives->field("id,bid,unumber,name,cardNum,department,payLand,householdType,payBase,socialStarTime,socialEndTime,
                fundBase,fundStarTime,fundEndTime,payAccount,payAccount_id,status,department_id")->select();
        if ($result) {
            $field = array(
                'A' => array('unumber', '工号'),
                'B' => array('name', '姓名'),
                'C' => array('cardNum', '证件号'),
                'D' => array('department', '部门'),
                'E' => array('payLand', '社保缴纳地'),
                'F' => array('householdType', '户口性质'),
                'G' => array('payBase', '社保基数'),
                'H' => array('socialStarTime', '社保起始月'),
                'I' => array('socialEndTime', '社保最后缴纳月'),
                'J' => array('fundBase', '公积金基数'),
                'K' => array('fundStarTime', '公积金起始月'),
                'L' => array('fundEndTime', '公积金最后缴纳月'),
                'M' => array('payAccount', '缴纳账户'),
            );
            phpExcelList($field, $result, '员工社保档案' . date('Y-m-d'));
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //4.4增加社保台账
    public function addSocialParameter()
    {
        $con["parameterTime"] = strtotime(I("post.parameterTime"));
        $con["type"] = I("post.type");
        $socialSecurityPlan = D("SocialSecurityPlan");
        $socialParameterInformation = D("SocialParameterInformation");

        if ($con["type"] == '1') {
            $socialArchives = D("SocialArchives");
            //先取出来社保缴纳起始月和最后缴纳月
            $li = $socialArchives->field("id,bid,unumber,name,cardNum,department,payLand,householdType,payBase,
                department,socialStarTime,socialEndTime,fundBase,fundStarTime,fundEndTime,payAccount,status,department_id,payAccount_id")
                ->select();
            foreach ($li as $k => $v) {
                $st["socialStarTime"] = $v["socialStarTime"];
                $st["socialEndTime"] = $v["socialEndTime"];
                if ($st["socialEndTime"]) {
                    $arr = $socialArchives->field("id,bid,unumber,name,cardNum,department,payLand,householdType,payBase,
                        department,socialStarTime,socialEndTime,fundBase,fundStarTime,fundEndTime,payAccount,status,department_id,payAccount_id")
                        ->where("{$con['parameterTime']}>=socialStarTime and {$con['parameterTime']}=<socialEndTime and socialEndTime is null and fundEndTime is null")->select();
                } else {
                    $arr = $socialArchives->field("id,bid,unumber,name,cardNum,department,payLand,householdType,payBase,
                        department,socialStarTime,socialEndTime,fundBase,fundStarTime,fundEndTime,payAccount,status,department_id,payAccount_id")
                        ->where("{$con['parameterTime']}>=socialStarTime and socialEndTime is null and fundEndTime is null")->select();
                }
            }
            foreach ($arr as $key => $value) {
                $id = $value["id"];
                $data['payLand'] = $value["payLand"];
                $data['unumber'] = $value["unumber"];
                $data['name'] = $value["name"];
                $data['cardNum'] = $value["cardNum"];
                $data['department'] = $value["department"];
                $data['socialStarTime'] = $value["socialStarTime"];
                $data['socialEndTime'] = $value["socialEndTime"];
                $data['fundBase'] = $value["fundBase"];
                $data['fundStarTime'] = $value["fundStarTime"];
                $data['fundEndTime'] = $value["fundEndTime"];
                $data['payAccount'] = $value["payAccount"];
                $data['status'] = $value["status"];
                $data['householdType'] = $value["householdType"];
                $data['payBase'] = $value["payBase"];
                $data['medicalPayBase'] = $value["payBase"];
                $data['pensionPayBase'] = $value["payBase"];
                $data['unemploymentPayBase'] = $value["payBase"];
                $data['hurtedPayBase'] = $value["payBase"];
                $data['birthedPayBase'] = $value["payBase"];
                $data['foudBase'] = $value["fundBase"];
                $data['department_id'] = $value["department_id"];
                $data['payAccount_id'] = $value["payAccount_id"];
                $data['time'] = $con["parameterTime"];
                $data['bid'] = $value["bid"];
                $data['socialStarTime'] = $value["socialStarTime"];
                $data['socialEndTime'] = $value["socialEndTime"];

                $list = $socialSecurityPlan->field("id,city,householdType,medicalBase,medicalRatio,pensionBase,pensionRatio,hurtedBase,
                    hurtedRatio,unemploymentBase,unemploymentRatio,birthedBase,birthedRatio,medicalRatioTwo,pensionRatioTwo,
                    hurtedRatioTwo,unemploymentRatioTwo,birthedRatioTwo,foudBase,foudRatio,foudRatioTwo,largeMedicalBase,largeMedicalRatio,
                    largeMedicalRatioTwo,effectiveDate,expiryDate,is_use,highestfoud,pensionHighestBase,hurtedHighestBase,unemploymentHighestBase,
                    birthedHighestBase,medicalHighestBase,largeMedicalHighestBase,medicalFixedFee,medicalFixedFeeTwo,pensionFixedFee,pensionFixedFeeTwo,
                    hurtedFixedFee,hurtedFixedFeeTwo,unemploymentFixedFee,unemploymentFixedFeeTwo,birthedFixedFee,birthedFixedFeeTwo,foudBaseFixedFee,
                    foudBaseFixedFeeTwo,largeMedicalFixedFee,largeMedicalFixedFeeTwo")
                    ->where("city='{$data['payLand']}' and householdType='{$data['householdType']}' and expiryDate is null")->find();
                $data["medicalRatio"] = $list["medicalRatio"];
                $data["medicalFixedFee"] = $list["medicalFixedFee"] + $list["largeMedicalFixedFee"];
                $data["medicalRatioTwo"] = $list["medicalRatioTwo"] + $list["largeMedicalRatioTwo"];//公司大额医疗比例是医疗比例+大额比例
                $data["pensionRatio"] = $list["pensionRatio"];
                $data["pensionRatioTwo"] = $list["pensionRatioTwo"];
                $data["unemploymentRatio"] = $list["unemploymentRatio"];
                $data["unemploymentRatioTwo"] = $list["unemploymentRatioTwo"];
                $data["hurtedRatioTwo"] = $list["hurtedRatioTwo"];
                $data["birthedRatioTwo"] = $list["birthedRatioTwo"];
                $data["foudRatio"] = $list["foudRatio"];
                $data["foudRatioTwo"] = $list["foudRatioTwo"];
                //医疗基数和社保基数对比，谁大用谁
                if ($list["medicalBase"] > $data['payBase']) {
                    //用大的值乘以比例数
                    $data["medical"] = round((($list["medicalBase"] * $list["medicalRatio"] + $list["medicalBase"] * $list["largeMedicalRatio"]) / 100) + $list["medicalFixedFee"] + $list["largeMedicalFixedFee"], 2);//个人
                    $data["medicalTwo"] = round((($list["medicalBase"] * $list["medicalRatioTwo"] + $list["medicalBase"] * $list["largeMedicalRatioTwo"]) / 100) + $list["medicalFixedFeeTwo"] + $list["largeMedicalFixedFeeTwo"], 2);//公司
                    $data["is_use"] = "1";

                    //把使用的基数存到数据库里
                    $data["medicalSelfMoney"] = $data["medical"];
                    $data["medicalCompanyMoney"] = $data["medicalTwo"];
                    $data["medicalCount"] = $data["medicalSelfMoney"] + $data["medicalCompanyMoney"];
                } else {
                    if ($data['payBase'] < $list["medicalHighestBase"]) {
                        $data["medical"] = round((($data['payBase'] * $list["medicalRatio"] + $data['payBase'] * $list["largeMedicalRatio"]) / 100) + $list["medicalFixedFee"] + $list["largeMedicalFixedFee"], 2);//个人
                        $data["medicalTwo"] = round((($data['payBase'] * $list["medicalRatioTwo"] + $data['payBase'] * $list["largeMedicalRatioTwo"]) / 100) + $list["medicalFixedFeeTwo"] + $list["largeMedicalFixedFeeTwo"], 2);//公司
                        $data["is_use"] = "1";
                        $data["medicalSelfMoney"] = $data["medical"];
                        $data["medicalCompanyMoney"] = $data["medicalTwo"];
                        $data["medicalCount"] = $data["medicalSelfMoney"] + $data["medicalCompanyMoney"];
                        $data["is_use"] = "1";
                    } else {
                        $data["medical"] = round((($list['medicalHighestBase'] * $list["medicalRatio"] + $list['medicalHighestBase'] * $list["largeMedicalRatio"]) / 100) + $list["medicalFixedFee"] + $list["largeMedicalFixedFee"], 2);//个人
                        $data["medicalTwo"] = round((($list['medicalHighestBase'] * $list["medicalRatioTwo"] + $list['medicalHighestBase'] * $list["largeMedicalRatioTwo"]) / 100) + $list["medicalFixedFeeTwo"] + $list["largeMedicalFixedFeeTwo"], 2);//公司
                        $data["is_use"] = "1";
                        $data["medicalSelfMoney"] = $data["medical"];
                        $data["medicalCompanyMoney"] = $data["medicalTwo"];
                        $data["medicalCount"] = $data["medicalSelfMoney"] + $data["medicalCompanyMoney"];
                        $data["is_use"] = "1";
                    }

                }

                //养老基数
                if ($list["pensionBase"] > $data['payBase']) {
                    $data["pension"] = round((($list["pensionBase"] * $list["pensionRatio"]) / 100) + $list["pensionFixedFee"], 2);
                    $data["pensionTwo"] = round((($list["pensionBase"] * $list["pensionRatioTwo"]) / 100) + $list["pensionFixedFeeTwo"], 2);
                    $data["pensionSelfMoney"] = $data["pension"];
                    $data["pensionCompanyMoney"] = $data["pensionTwo"];
                    $data["pensionCount"] = $data["pensionSelfMoney"] + $data["pensionCompanyMoney"];
                } else {
                    if ($data["payBase"] < $list["pensionHighestBase"]) {
                        $data["pension"] = round((($data["payBase"] * $list["pensionRatio"] / 100)) + $list["pensionFixedFee"], 2);
                        $data["pensionTwo"] = round((($data["payBase"] * $list["pensionRatioTwo"] / 100)) + $list["pensionFixedFeeTwo"], 2);
                        $data["pensionSelfMoney"] = $data["pension"];
                        $data["pensionCompanyMoney"] = $data["pensionTwo"];
                        $data["pensionCount"] = $data["pensionSelfMoney"] + $data["pensionCompanyMoney"];
                    } else {
                        $data["pension"] = round((($list["pensionHighestBase"] * $list["pensionRatio"]) / 100) + $list["pensionFixedFee"], 2);
                        $data["pensionTwo"] = round((($list["pensionHighestBase"] * $list["pensionRatioTwo"]) / 100) + $list["pensionFixedFeeTwo"], 2);
                        $data["pensionSelfMoney"] = $data["pension"];
                        $data["pensionCompanyMoney"] = $data["pensionTwo"];
                        $data["pensionCount"] = $data["pensionSelfMoney"] + $data["pensionCompanyMoney"];
                    }

                }
                //失业基数
                if ($list["unemploymentBase"] > $data["payBase"]) {
                    $data["unemployment"] = round((($list["unemploymentBase"] * $list["unemploymentRatio"]) / 100) + $list["unemploymentFixedFee"], 2);
                    $data["unemploymentTwo"] = round((($list["unemploymentBase"] * $list["unemploymentRatioTwo"]) / 100) + $list["unemploymentFixedFeeTwo"], 2);
                    $data["unemploymentSelfMoney"] = $data["unemployment"];
                    $data["unemploymentCompanyMoney"] = $data["unemploymentTwo"];
                    $data["unemploymentCount"] = $data["unemploymentSelfMoney"] + $data["unemploymentCompanyMoney"];
                } else {
                    if ($data["payBase"] < $list["unemploymentHighestBase"]) {
                        $data["unemployment"] = round((($data["payBase"] * $list["unemploymentRatio"]) / 100) + $list["unemploymentFixedFee"], 2);
                        $data["unemploymentTwo"] = round((($data["payBase"] * $list["unemploymentRatioTwo"]) / 100) + $list["unemploymentFixedFeeTwo"], 2);
                        $data["unemploymentSelfMoney"] = $data["unemployment"];
                        $data["unemploymentCompanyMoney"] = $data["unemploymentTwo"];
                        $data["unemploymentCount"] = $data["unemploymentSelfMoney"] + $data["unemploymentCompanyMoney"];
                    } else {
                        $data["unemployment"] = round((($list["unemploymentHighestBase"] * $list["unemploymentRatio"]) / 100) + $list["unemploymentFixedFee"], 2);
                        $data["unemploymentTwo"] = round((($list["unemploymentHighestBase"] * $list["unemploymentRatioTwo"]) / 100) + $list["unemploymentFixedFeeTwo"], 2);
                        $data["unemploymentSelfMoney"] = $data["unemployment"];
                        $data["unemploymentCompanyMoney"] = $data["unemploymentTwo"];
                        $data["unemploymentCount"] = $data["unemploymentSelfMoney"] + $data["unemploymentCompanyMoney"];
                    }

                }
                //公积金基数
                if ($list["foudBase"] > $data["foudBase"]) {
                    $data["fund"] = round((($list["foudBase"] * $list["foudRatio"]) / 100) + $list["foudBaseFixedFee"], 2);
                    $data["fundTwo"] = round((($list["foudBase"] * $list["foudRatioTwo"]) / 100) + $list["foudBaseFixedFeeTwo"], 2);
                    $data["foudSelfMoney"] = $data["fund"];
                    $data["foudCompanyMoney"] = $data["fundTwo"];
                    $data["foudCount"] = $data["foudSelfMoney"] + $data["foudCompanyMoney"];
                } else {
                    if ($data["foudBase"] < $list["highestfoud"]) {
                        $data["fund"] = round((($data["foudBase"] * $list["foudRatio"]) / 100) + $list["foudBaseFixedFee"], 2);
                        $data["fundTwo"] = round((($data["foudBase"] * $list["foudRatioTwo"]) / 100) + $list["foudBaseFixedFeeTwo"], 2);
                        $data["foudSelfMoney"] = $data["fund"];
                        $data["foudCompanyMoney"] = $data["fundTwo"];
                        $data["foudCount"] = $data["foudSelfMoney"] + $data["foudCompanyMoney"];
                    } else {
                        $data["fund"] = round((($list["highestfoud"] * $list["foudRatio"]) / 100) + $list["foudBaseFixedFee"], 2);
                        $data["fundTwo"] = round((($list["highestfoud"] * $list["foudRatioTwo"]) / 100) + $list["foudBaseFixedFeeTwo"], 2);
                        $data["foudSelfMoney"] = $data["fund"];
                        $data["foudCompanyMoney"] = $data["fundTwo"];
                        $data["foudCount"] = $data["foudSelfMoney"] + $data["foudCompanyMoney"];
                    }

                }
                //工伤
                if ($list["hurtedBase"] > $data["payBase"]) {
                    $data["hurted"] = round((($list["hurtedBase"] * $list["hurtedRatio"]) / 100) + $list["hurtedFixedFee"], 2);
                    $data["hurtedTwo"] = round((($list["hurtedBase"] * $list["hurtedRatioTwo"]) / 100) + $list["hurtedFixedFeeTwo"], 2);
                    $data["useHurted"] = $data["hurted"];
                    $data["hurtedCompanyMoney"] = $data["hurtedTwo"];
                } else {
                    if ($data["payBase"] < $list["hurtedHighestBase"]) {
                        $data["hurted"] = round((($data["payBase"] * $list["hurtedRatio"]) / 100) + $list["hurtedFixedFee"], 2);
                        $data["hurtedTwo"] = round((($data["payBase"] * $list["hurtedRatioTwo"]) / 100) + $list["hurtedFixedFeeTwo"], 2);
                        $data["useHurted"] = $data["hurted"];
                        $data["hurtedCompanyMoney"] = $data["hurtedTwo"];
                    } else {
                        $data["hurted"] = round((($list["hurtedHighestBase"] * $list["hurtedRatio"]) / 100) + $list["hurtedFixedFee"], 2);
                        $data["hurtedTwo"] = round((($list["hurtedHighestBase"] * $list["hurtedRatioTwo"]) / 100) + $list["hurtedFixedFeeTwo"], 2);
                        $data["useHurted"] = $data["hurted"];
                        $data["hurtedCompanyMoney"] = $data["hurtedTwo"];
                    }

                }
                //生育
                if ($list["birthedBase"] > $data["payBase"]) {
                    $data["birthed"] = round((($list["birthedBase"] * $list["birthedRatio"]) / 100) + $list["birthedFixedFee"], 2);
                    $data["birthedTwo"] = round((($list["birthedBase"] * $list["birthedRatioTwo"]) / 100) + $list["birthedFixedFeeTwo"], 2);
                    $data["useBirthed"] = $data["birthed"];
                    $data["birthedCompanyMoney"] = $data["birthedTwo"];
                } else {
                    if ($data["payBase"] < $list["birthedHighestBase"]) {
                        $data["birthed"] = round((($data["payBase"] * $list["birthedRatio"]) / 100) + $list["birthedFixedFee"], 2);
                        $data["birthedTwo"] = round((($data["payBase"] * $list["birthedRatioTwo"]) / 100) + $list["birthedFixedFeeTwo"], 2);
                        $data["useBirthed"] = $data["birthed"];
                        $data["birthedCompanyMoney"] = $data["birthedTwo"];
                    } else {
                        $data["birthed"] = round((($list["birthedHighestBase"] * $list["birthedRatio"]) / 100) + $list["birthedFixedFee"], 2);
                        $data["birthedTwo"] = round((($list["birthedHighestBase"] * $list["birthedRatioTwo"]) / 100) + $list["birthedFixedFeeTwo"], 2);
                        $data["useBirthed"] = $data["birthed"];
                        $data["birthedCompanyMoney"] = $data["birthedTwo"];
                    }

                }
                $data["socialSelfCount"] = $data["medicalSelfMoney"] + $data["pensionSelfMoney"] + $data["unemploymentSelfMoney"];
                $data["socialCompanyCount"] = $data["medicalCompanyMoney"] + $data["pensionCompanyMoney"] + $data["unemploymentCompanyMoney"] +
                    $data["hurtedCompanyMoney"] + $data["birthedCompanyMoney"];
                $data["socialCount"] = $data["socialSelfCount"] + $data["socialCompanyCount"];
                $data["selfSocialAndFoudCount"] = $data["socialSelfCount"] + $data["foudSelfMoney"];
                $data["companySocialAndFoudCount"] = $data["socialCompanyCount"] + $data["foudCompanyMoney"];
                $data["selfAndCompanyAllCount"] = $data["selfSocialAndFoudCount"] + $data["companySocialAndFoudCount"];
                $datas = $socialParameterInformation->create($data);
                if ($datas) {
                    $socialParameterInformation->add($datas);
                }
            }
        }
        if ($con["type"] == '2') {
            $upload = new \Think\Upload();
            $upload->maxSize = 3145728;
            $upload->exts = array();// 设置附件上传类型
            $upload->rootPath = './Public/Uploads/socialParameter/';
            $upload->saveName = time() . rand(10000, 99999);
            $info = $upload->upload();
            if (!$info) {
                $this->error($upload->getError());
            } else {
                $url = "./Public/Uploads/socialParameter/" . $info[0]['savepath'] . $info[0]['savename'];
            }
            if (!$url) {
                //文件不存在
                $error = 2;
            }
            $con["url"] = $url;
            $finename = $url;
            $type = pathinfo($finename);
            $type = strtolower($type["extension"]);
            $type = $type === 'csv' ? $type : 'Excel2007';
            Vendor('PHPExcel.PHPExcel');
            $objReader = \PHPExcel_IOFactory::createReader($type);
            $objPHPExcel = $objReader->load($finename);
            $sheet = $objPHPExcel->getSheet(0);
            // 取得总行数
            $highestRow = $sheet->getHighestRow();
            // 取得总列数
            $highestColumn = $sheet->getHighestColumn();
            $socialArchives = D("SocialArchives");
            for ($row = 3; $row <> $highestRow; $row++) {
                $rowData = $sheet->rangeToArray('A' . $row . ':' . $highestColumn . $row, NULL, TRUE, FALSE);

                $parentId = $socialArchives->field("id,bid,name,unumber,department_id,socialStarTime,socialEndTime")->where("name=" . "'" . $rowData[0][2] . "'")->find();
                $rowData[0]['department_id'] = $parentId["department_id"];
                $rowData[0]["bid"] = $parentId["bid"];
                $rowData[0]['socialStarTime'] = $parentId["socialStarTime"];
                $rowData[0]['socialEndTime'] = $parentId["socialEndTime"];
                $cons["department_id"] = $rowData[0]["department_id"];
                $cons["socialStarTime"] = $rowData[0]["socialStarTime"];
                $cons["socialEndTime"] = $rowData[0]["socialEndTime"];
                $cons["bid"] = $rowData[0]["bid"];
                $cons["unumber"] = $rowData[0]['1'];
                $cons["name"] = $rowData[0]['2'];
                $cons["department"] = $rowData[0]["3"];
                $cons["payLand"] = $rowData[0]["4"];
                $cons["householdType"] = $rowData[0]["5"];
                $cons["payAccount"] = $rowData[0]["6"];
                $cons["medicalPayBase"] = $rowData[0]["7"];
                $cons["medicalRatio"] = $rowData[0]["8"];
                $cons["medicalFixedFee"] = $rowData[0]["9"];
                $cons["medicalSelfMoney"] = $rowData[0]["10"];
                $cons["medicalRatioTwo"] = $rowData[0]["11"];
                $cons["medicalCompanyMoney"] = $rowData[0]["12"];
                $cons["medicalCount"] = $rowData[0]["13"];
                $cons["pensionPayBase"] = $rowData[0]["14"];
                $cons["pensionRatio"] = $rowData[0]["15"];
                $cons["pensionSelfMoney"] = $rowData[0]["16"];
                $cons["pensionRatioTwo"] = $rowData[0]["17"];
                $cons["pensionCompanyMoney"] = $rowData[0]["18"];
                $cons["pensionCount"] = $rowData[0]["19"];
                $cons["unemploymentPayBase"] = $rowData[0]["20"];
                $cons["unemploymentRatio"] = $rowData[0]["21"];
                $cons["unemploymentSelfMoney"] = $rowData[0]["22"];
                $cons["unemploymentRatioTwo"] = $rowData[0]["23"];
                $cons["unemploymentCompanyMoney"] = $rowData[0]["24"];
                $cons["unemploymentCount"] = $rowData[0]["25"];
                $cons["hurtedPayBase"] = $rowData[0]["26"];
                $cons["hurtedRatioTwo"] = $rowData[0]["27"];
                $cons["hurtedCompanyMoney"] = $rowData[0]["28"];
                $cons["birthedPayBase"] = $rowData[0]["29"];
                $cons["birthedRatioTwo"] = $rowData[0]["30"];
                $cons["birthedCompanyMoney"] = $rowData[0]["31"];
                $cons["socialSelfCount"] = $rowData[0]["32"];
                $cons["socialCompanyCount"] = $rowData[0]["33"];
                $cons["socialCount"] = $rowData[0]["34"];
                $cons["foudBase"] = $rowData[0]["35"];
                $cons["foudRatio"] = $rowData[0]["36"];
                $cons["foudSelfMoney"] = $rowData[0]["37"];
                $cons["foudRatioTwo"] = $rowData[0]["38"];
                $cons["foudCompanyMoney"] = $rowData[0]["39"];
                $cons["foudCount"] = $rowData[0]["40"];
                $cons["selfSocialAndFoudCount"] = $rowData[0]["41"];
                $cons["companySocialAndFoudCount"] = $rowData[0]["42"];
                $cons["selfAndCompanyAllCount"] = $rowData[0]["43"];
                $cons["time"] = $con["parameterTime"];

                $datas = $socialParameterInformation->create($cons);
                if ($datas) {
                    $socialParameterInformation->add($datas);
                }
            }
        }

        $socialParameter = D("SocialParameter");
        $parameterTime = $socialParameter->field("parameterTime")->where("parameterTime=" . $con["parameterTime"])->find();
        if (!$parameterTime) {
            $const = $socialParameter->create($con);
            if ($const) {
                $result = $socialParameter->add($const);
            }
            if ($result) {
                $error = 0;
            } else {
                $error = 1;
            }
            self::jsons($error, $result);

        } else {
            self::jsons($error = 1, $result = "月度台账时间已经存在，请重新创建");
        }

    }

    //4.4点击查看某个月份的人员社保台账
    public function clickSocialParameter()
    {

        //工号
        if (I("unumber")) {
            $map['unumber'] = array('like', '%' . I('unumber') . '%');
        }
        //姓名
        if (I("name")) {
            $map['name'] = array('like', '%' . I('name') . '%');
        }
        //部门
        if (I("department")) {
            $map['department'] = I("department");
        }
        //社保缴纳地
        if (I("payLand")) {
            $map['payLand'] = I("payLand");
        }
        //户口类型
        if (I("householdType")) {
            $map['householdType'] = I("householdType");
        }

        //台账月份
        if (I("parameterTime")) {
            $map['time'] = strtotime(I("parameterTime"));
        }

        //缴纳账户
        if (I("payAccount_id")) {
            $map['payAccount_id'] = I("payAccount_id");
        }

        //增员和减员筛选
        if (I("addPerson") == '1') {

            $map['socialStarTime'] = strtotime(date('Y-m', time()));
        }

        if (I("minusPerson") == '1') {
            $map['socialEndTime'] = strtotime(date("Y-m", strtotime("-1 month", time())));
        }


        $pages = I("pages");
        $socialParameterInformation = D("SocialParameterInformation");
        $count = $socialParameterInformation->field("id,bid,unumber,name,department,payLand,householdType,payAccount,medicalPayBase,medicalRatio,
            medicalFixedFee,medicalSelfMoney,medicalRatioTwo,medicalCompanyMoney,medicalCount,pensionPayBase,pensionRatio,pensionSelfMoney,
            pensionRatioTwo,pensionCompanyMoney,pensionCount,unemploymentPayBase,unemploymentRatio,unemploymentSelfMoney,unemploymentRatioTwo,payAccount_id,
            unemploymentCompanyMoney,unemploymentCount,hurtedPayBase,hurtedRatioTwo,hurtedCompanyMoney,birthedPayBase,birthedRatioTwo,birthedCompanyMoney,
            socialSelfCount,socialCompanyCount,socialCount,foudBase,foudRatio,foudSelfMoney,foudRatioTwo,foudCompanyMoney,foudCount,selfSocialAndFoudCount,
            companySocialAndFoudCount,selfAndCompanyAllCount,time,department_id,socialStarTime,socialEndTime")->where($map)->count();

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
        $list = $socialParameterInformation->field("id,bid,unumber,name,department,payLand,householdType,payAccount,medicalPayBase,medicalRatio,
            medicalFixedFee,medicalSelfMoney,medicalRatioTwo,medicalCompanyMoney,medicalCount,pensionPayBase,pensionRatio,pensionSelfMoney,
            pensionRatioTwo,pensionCompanyMoney,pensionCount,unemploymentPayBase,unemploymentRatio,unemploymentSelfMoney,unemploymentRatioTwo,payAccount_id,
            unemploymentCompanyMoney,unemploymentCount,hurtedPayBase,hurtedRatioTwo,hurtedCompanyMoney,birthedPayBase,birthedRatioTwo,birthedCompanyMoney,
            socialSelfCount,socialCompanyCount,socialCount,foudBase,foudRatio,foudSelfMoney,foudRatioTwo,foudCompanyMoney,foudCount,selfSocialAndFoudCount,
            companySocialAndFoudCount,selfAndCompanyAllCount,time,department_id,socialStarTime,socialEndTime")
            ->where($map)->limit($offset, $pages)->select();
//        echo $socialParameterInformation->getLastsql();
        foreach ($list as &$val) {
            $val['socialStarTime'] = date('Y-m-d', $val['socialStarTime']);
            $val['socialEndTime'] = date('Y-m-d', $val['socialEndTime']);
        }

        //遍历得到使用的基金和社保以及计算后的基金和社保
        foreach ($list as $key => $value) {
            $bid = $value["bid"];

            //个人医疗合计
            $medicalSelfCount[] = $value["medicalSelfMoney"];
            //公司医疗合计
            $medicalCompanyCount[] = $value["medicalCompanyMoney"];
            //公司和个人医疗的合计
            $medicalSelfAndCompanyCount[] = $value["medicalCount"];
            //养老个人合计
            $pensionSelfCount[] = $value["pensionSelfMoney"];
            //养老公司合计
            $pensionCompanyCount[] = $value["pensionCompanyMoney"];
            //养老公司和个人的合计
            $pensionSelfAndCompanyCount[] = $value["pensionCount"];
            //失业个人合计
            $unemploymentSelfCount[] = $value["unemploymentSelfMoney"];
            //失业公司合计
            $unemploymentCompanyCount[] = $value["unemploymentCompanyMoney"];
            //失业公司和个人的合计
            $unemploymentSelfAndCompanyCount[] = $value["unemploymentCount"];
            //工伤金额合计
            $hurtedCount[] = $value["hurtedCompanyMoney"];
            //生育金额
            $birthedCount[] = $value["birthedCompanyMoney"];
            //社保个人合计
            $socialSelfCount[] = $value["socialSelfCount"];
            //社保公司合计
            $socialCompanyCount[] = $value["socialCompanyCount"];
            //社保合计
            $socialSelfAndCompanyCount[] = $value["socialCount"];
            //公积金个人金额
            $fondSelfCount[] = $value["foudSelfMoney"];
            //公积金公司金额
            $fondCompanyCount[] = $value["foudCompanyMoney"];
            //公积金个人和公司和
            $fondSelfAndCompanyCount[] = $value["foudCount"];
            //个人社保和公积金和
            $selfAllCount[] = $value["selfSocialAndFoudCount"];
            //公司社保和公积金和
            $companyAllCount[] = $value["companySocialAndFoudCount"];
            //个人和公司所有的一起的和
            $selfAndCompanyAllCount[] = $value["selfAndCompanyAllCount"];
        }
        $sum["medicalSelfMoney"] = array_sum($medicalSelfCount);
        $sum["medicalCompanyMoney"] = array_sum($medicalCompanyCount);
        $sum["medicalCount"] = array_sum($medicalSelfAndCompanyCount);
        $sum["pensionSelfMoney"] = array_sum($pensionSelfCount);
        $sum["pensionCompanyMoney"] = array_sum($pensionCompanyCount);
        $sum["pensionCount"] = array_sum($pensionSelfAndCompanyCount);
        $sum["unemploymentSelfMoney"] = array_sum($unemploymentSelfCount);
        $sum["unemploymentCompanyMoney"] = array_sum($unemploymentCompanyCount);
        $sum["unemploymentCount"] = array_sum($unemploymentSelfAndCompanyCount);
        $sum["hurtedCompanyMoney"] = array_sum($hurtedCount);
        $sum["birthedCompanyMoney"] = array_sum($birthedCount);
        $sum["socialSelfCount"] = array_sum($socialSelfCount);
        $sum["socialCompanyCount"] = array_sum($socialCompanyCount);
        $sum["socialCount"] = array_sum($socialSelfAndCompanyCount);
        $sum["foudSelfMoney"] = array_sum($fondSelfCount);
        $sum["foudCompanyMoney"] = array_sum($fondCompanyCount);
        $sum["foudCount"] = array_sum($fondSelfAndCompanyCount);
        $sum["selfSocialAndFoudCount"] = array_sum($selfAllCount);
        $sum["companySocialAndFoudCount"] = array_sum($companyAllCount);
        $sum["selfAndCompanyAllCount"] = array_sum($selfAndCompanyAllCount);

        $result = array(
            'page' => $page,
            'pageNum' => $pageNum,
            'result' => $list,
            'sum' => $sum
        );
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //4.4社保台账
    public function socialParameterList()
    {

        //按照时间搜索
        $starTime = strtotime(I("starTime"));

        $endTime = strtotime(I("endTime"));

        if ($starTime != '' && $endTime != '') {
            $map['parameterTime'] = array('between', "$starTime,$endTime");
        }
        $pages = I("pages");
        $socialParameter = D("SocialParameter");
        $count = $socialParameter->field("id,parameterTime,type")->count();

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
        $list = $socialParameter->field("id,parameterTime,type")->where($map)->order("parameterTime desc")->limit($offset, $pages)->select();
        foreach ($list as &$val) {
            $val['parameterTime'] = date('Y-m', $val['parameterTime']);
        }
        $result = array(
            'page' => $page,
            'pageNum' => $pageNum,
            'result' => $list
        );
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //4.4数据导出模板
    public function socialParameterExportExcel($title = array(), $title_1 = array(), $row = 2, $data = array(), $fileName = '', $savePath = './Public/Download/export/', $isDown = false)
    {
        Vendor('PHPExcel.PHPExcel');
        $obj = new \PHPExcel();

        //横向单元格标识
        $cellName = array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ');

        $obj->getActiveSheet(0)->setTitle('sheet名称');   //设置sheet名称
        if ($title) {
            foreach ($title as $k => $v) {
                $obj->getActiveSheet(0)->mergeCells($v[1] . ':' . $v[2]);   //合并单元格
                $obj->setActiveSheetIndex(0)->setCellValue($v[1], $v[0]);  //设置合并后的单元格内容
            }
            foreach ($title_1 as $k => $v) {
                $k = str_split($k);
                $_cnt = array_search($k[0], $cellName);
                foreach ($v as $kk => $vv) {
                    $obj->setActiveSheetIndex(0)->setCellValue($cellName[$_cnt] . $k[1], $vv);  //设置横向的单元格表头
                    $_cnt++;
                }
            }
            // $str='A'.$_row.':'.$cellName[$_cnt-1].$_row;
            // $obj->getActiveSheet(0)->mergeCells($str);   //合并单元格
            // $obj->setActiveSheetIndex(0)->setCellValue('A'.$_row, '数据导出：'.date('Y-m-d H:i:s'));  //设置合并后的单元格内容
            // $_row++;
            // $i = 0;
            // foreach($title AS $v){   //设置列标题
            // 	$obj->setActiveSheetIndex(0)->setCellValue($cellName[$i].$_row, $v);
            // 	$i++;
            // }
            // $_row++;
        }

        //填写数据
        if ($data) {
            $i = 0;
            foreach ($data AS $_v) {
                $j = 0;
                foreach ($_v AS $_cell) {
                    $obj->getActiveSheet(0)->setCellValue($cellName[$j] . ($i + $row), $_cell);
                    $j++;
                }
                $i++;
            }
        }

        //文件名处理
        if (!$fileName) {
            $fileName = uniqid(time(), true);
        }

        $objWrite = \PHPExcel_IOFactory::createWriter($obj, 'Excel2007');

        if ($isDown) {   //网页下载
            header('pragma:public');
            header("Content-Disposition:attachment;filename=$fileName.xlsx");
            $objWrite->save('php://output');
            exit;
        }

        $_fileName = iconv("utf-8", "gb2312", $fileName);   //转码
        $_savePath = $savePath . $_fileName . '.xlsx';
        $objWrite->save($_savePath);
        return $savePath . $fileName . '.xlsx';
    }

    //4.4社保台账数据导出
    public function socialParameterExport()
    {
        //工号
        if (I("unumber")) {
            $map['unumber'] = array('like', '%' . I('unumber') . '%');
        }
        //姓名
        if (I("name")) {
            $map['name'] = array('like', '%' . I('name') . '%');
        }
        //部门
        if (I("department")) {
            $map['department'] = I("department");
        }
        //社保缴纳地
        if (I("payLand")) {
            $map['payLand'] = I("payLand");
        }
        //户口类型
        if (I("householdType")) {
            $map['householdType'] = I("householdType");
        }

        //台账月份
        if (I("parameterTime")) {
            $map['time'] = strtotime(I("parameterTime"));
        }

        //缴纳账户
        if (I("payAccount_id")) {
            $map['payAccount_id'] = I("payAccount_id");
        }

        //增员和减员筛选
        if (I("addPerson") == '1') {

            $map['socialStarTime'] = strtotime(date('Y-m', time()));
        }

        if (I("minusPerson") == '1') {
            $map['socialEndTime'] = strtotime(date("Y-m", strtotime("-1 month", time())));
        }

        $pages = I("pages");

        $socialParameterInformation = D("SocialParameterInformation");
        $count = $socialParameterInformation->field("id,unumber,name,department,payLand,householdType,payAccount,medicalPayBase,medicalRatio,
            medicalFixedFee,medicalSelfMoney,medicalRatioTwo,medicalCompanyMoney,medicalCount,pensionPayBase,pensionRatio,pensionSelfMoney,
            pensionRatioTwo,pensionCompanyMoney,pensionCount,unemploymentPayBase,unemploymentRatio,unemploymentSelfMoney,unemploymentRatioTwo,
            unemploymentCompanyMoney,unemploymentCount,hurtedPayBase,hurtedRatioTwo,hurtedCompanyMoney,birthedPayBase,birthedRatioTwo,birthedCompanyMoney,
            socialSelfCount,socialCompanyCount,socialCount,foudBase,foudRatio,foudSelfMoney,foudRatioTwo,foudCompanyMoney,foudCount,selfSocialAndFoudCount,
            companySocialAndFoudCount,selfAndCompanyAllCount")->where($map)->count();

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
        $data = $socialParameterInformation->field("id,unumber,name,department,payLand,householdType,payAccount,medicalPayBase,medicalRatio,
            medicalFixedFee,medicalSelfMoney,medicalRatioTwo,medicalCompanyMoney,medicalCount,pensionPayBase,pensionRatio,pensionSelfMoney,
            pensionRatioTwo,pensionCompanyMoney,pensionCount,unemploymentPayBase,unemploymentRatio,unemploymentSelfMoney,unemploymentRatioTwo,
            unemploymentCompanyMoney,unemploymentCount,hurtedPayBase,hurtedRatioTwo,hurtedCompanyMoney,birthedPayBase,birthedRatioTwo,birthedCompanyMoney,
            socialSelfCount,socialCompanyCount,socialCount,foudBase,foudRatio,foudSelfMoney,foudRatioTwo,foudCompanyMoney,foudCount,selfSocialAndFoudCount,
            companySocialAndFoudCount,selfAndCompanyAllCount")
            ->where($map)->limit($offset, $pages)->select();
        $title = [
            ['序号', 'A1', 'A2'],
            ['工号', 'B1', 'B2'],
            ['姓名', 'C1', 'C2'],
            ['部门', 'D1', 'D2'],
            ['社保缴纳地', 'E1', 'E2'],
            ['户口类型', 'F1', 'F2'],
            ['缴纳账户', 'G1', 'G2'],
            ['医疗（含大额）', 'H1', 'N1'],
            ['养老', 'O1', 'T1'],
            ['失业', 'U1', 'Z1'],
            ['工伤', 'AA1', 'AC1'],
            ['生育', 'AD1', 'AF1'],
            ['社保合计', 'AG1', 'AI1'],
            ['公积金', 'AJ1', 'AO1'],
            ['社保公积金合计', 'AP1', 'AR1'],

        ];
        $arr = ['H2' => [
            '基数', '个人比例%', '固定费用', '个人金额', '公司比例%', '公司金额', '小计',
            '基数', '个人比例%', '个人金额', '公司比例%', '公司金额', '小计',
            '基数', '个人比例%', '个人金额', '公司比例%', '公司金额', '小计',
            '基数', '公司比例%', '公司金额',
            '基数', '公司比例%', '公司金额',
            '社保个人小计', '社保公司小计', '社保合计',
            '基数', '个人比例%', '个人金额', '公司比例%', '公司金额', '公积金合计',
            '个人合计', '公司合计', '总计',
        ]
        ];

        $url = self::socialParameterExportExcel($title, $arr, 3, $data);
        $urls = $_SERVER['SERVER_NAME'] . ltrim($url, ".");
        if ($urls) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $urls);
    }

    //4.4删除社保台账
    public function deleteSocialParameter()
    {
        $id = I("post.id");
        $length = strlen($id);
        $socialParameter = D("SocialParameter");
        if ($length == 1) {
            $where = 'id=' . $id;
        } else {
            $id = array($id);
            $where = 'id in(' . implode(',', $id) . ')';
        }
        $result = $socialParameter->where($where)->delete();
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //4.5社保补缴excel数据导出
    public function socialPaymentExport()
    {
        //实际补缴时间
        if (I("times")) {
            $map['paymentTime'] = strtotime(I("times"));
        }

        //工号
        if (I("unumber")) {
            $map['unumber'] = array('like', '%' . I('unumber') . '%');
        }
        //姓名
        if (I("name")) {
            $map['name'] = array('like', '%' . I('name') . '%');
        }

        //部门
        if (I("department")) {
            $map['department'] = I("department");
        }
        //社保缴纳地
        if (I("payLand")) {
            $map['payLand'] = I("payLand");
        }
        //户口性质
        if (I("householdType")) {
            $map['householdType'] = I("householdType");
        }
        //缴纳账户
        if (I("payAccount_id")) {
            $map['payAccount_id'] = I("payAccount_id");
        }
        //补缴形式
        if (I("payment_type")) {
            $map['type'] = I("payment_type");
        }


        $pages = I("pages");
        $socialPaymentInformation = D("SocialPaymentInformation");
        $count = $socialPaymentInformation->field("id,bid,unumber,name,department,cardNum,payLand,householdType,payAccount,type,
        paymentStarTime,paymentEndTime,paymentNum,medicalPayBase,medicalRatio,medicalFixedFee,medicalSelfMoney,medicalRatioTwo,
        medicalCompanyMoney,medicalCount,is_medical,pensionPayBase,pensionRatio,pensionSelfMoney,pensionRatioTwo,pensionCompanyMoney,
        pensionCount,is_pension,unemploymentPayBase,unemploymentRatio,unemploymentSelfMoney,unemploymentRatioTwo,unemploymentCompanyMoney,
        unemploymentCount,is_unemployment,hurtedPayBase,hurtedRatioTwo,hurtedCompanyMoney,is_hurted,birthedPayBase,birthedRatioTwo,
        birthedCompanyMoney,is_birthed,socialSelfCount,socialCompanyCount,socialCount,foudBase,foudRatio,foudSelfMoney,foudRatioTwo,payAccount_id,
        foudCompanyMoney,foudCount,is_foud,selfSocialAndFoudCount,companySocialAndFoudCount,selfAndCompanyAllCount,paymentTime,department_id")
            ->where($map)->count();

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
        $list = $socialPaymentInformation->field("id,bid,unumber,name,department,cardNum,payLand,householdType,payAccount,type,
        paymentStarTime,paymentEndTime,paymentNum,medicalPayBase,medicalRatio,medicalFixedFee,medicalSelfMoney,medicalRatioTwo,
        medicalCompanyMoney,medicalCount,is_medical,pensionPayBase,pensionRatio,pensionSelfMoney,pensionRatioTwo,pensionCompanyMoney,
        pensionCount,is_pension,unemploymentPayBase,unemploymentRatio,unemploymentSelfMoney,unemploymentRatioTwo,unemploymentCompanyMoney,
        unemploymentCount,is_unemployment,hurtedPayBase,hurtedRatioTwo,hurtedCompanyMoney,is_hurted,birthedPayBase,birthedRatioTwo,
        birthedCompanyMoney,is_birthed,socialSelfCount,socialCompanyCount,socialCount,foudBase,foudRatio,foudSelfMoney,foudRatioTwo,payAccount_id,
        foudCompanyMoney,foudCount,is_foud,selfSocialAndFoudCount,companySocialAndFoudCount,selfAndCompanyAllCount,paymentTime,department_id")
            ->where($map)->limit($offset, $pages)->select();
        foreach ($list as &$val) {
            $val['paymentStarTime'] = date('Y-m', $val['paymentStarTime']);
            $val['paymentEndTime'] = date('Y-m', $val['paymentEndTime']);
            $val['paymentTime'] = date('Y-m', $val['paymentTime']);
        }
        foreach ($list as $key => $value) {
            $data[$key]["id"] = $value["id"];
            $data[$key]["unumber"] = $value["unumber"];
            $data[$key]["name"] = $value["name"];
            $data[$key]["department"] = $value["department"];
            $data[$key]["cardNum"] = $value["cardNum"];
            $data[$key]["payLand"] = $value["payLand"];
            $data[$key]["householdType"] = $value["householdType"];
            $data[$key]["payAccount"] = $value["payAccount"];
            $data[$key]["type"] = $value["type"];
            $data[$key]["paymentStarTime"] = $value["paymentStarTime"];
            $data[$key]["paymentEndTime"] = $value["paymentEndTime"];
            $data[$key]["paymentNum"] = $value["paymentNum"];
            $data[$key]["medicalPayBase"] = $value["medicalPayBase"];
            $data[$key]["medicalRatio"] = $value["medicalRatio"];
            $data[$key]["medicalFixedFee"] = $value["medicalFixedFee"];
            $data[$key]["medicalSelfMoney"] = $value["medicalSelfMoney"];
            $data[$key]["medicalRatioTwo"] = $value["medicalRatioTwo"];
            $data[$key]["medicalCompanyMoney"] = $value["medicalCompanyMoney"];
            $data[$key]["medicalCount"] = $value["medicalCount"];
            $data[$key]["pensionPayBase"] = $value["pensionPayBase"];
            $data[$key]["pensionRatio"] = $value["pensionRatio"];
            $data[$key]["pensionSelfMoney"] = $value["pensionSelfMoney"];
            $data[$key]["pensionRatioTwo"] = $value["pensionRatioTwo"];
            $data[$key]["pensionCompanyMoney"] = $value["pensionCompanyMoney"];
            $data[$key]["pensionCount"] = $value["pensionCount"];
            $data[$key]["unemploymentPayBase"] = $value["unemploymentPayBase"];
            $data[$key]["unemploymentRatio"] = $value["unemploymentRatio"];
            $data[$key]["unemploymentSelfMoney"] = $value["unemploymentSelfMoney"];
            $data[$key]["unemploymentRatioTwo"] = $value["unemploymentRatioTwo"];
            $data[$key]["unemploymentCompanyMoney"] = $value["unemploymentCompanyMoney"];
            $data[$key]["unemploymentCount"] = $value["unemploymentCount"];
            $data[$key]["hurtedPayBase"] = $value["hurtedPayBase"];
            $data[$key]["hurtedRatioTwo"] = $value["hurtedRatioTwo"];
            $data[$key]["hurtedCompanyMoney"] = $value["hurtedCompanyMoney"];
            $data[$key]["birthedPayBase"] = $value["birthedPayBase"];
            $data[$key]["birthedRatioTwo"] = $value["birthedRatioTwo"];
            $data[$key]["birthedCompanyMoney"] = $value["birthedCompanyMoney"];
            $data[$key]["socialSelfCount"] = $value["socialSelfCount"];
            $data[$key]["socialCompanyCount"] = $value["socialCompanyCount"];
            $data[$key]["socialCount"] = $value["socialCount"];
            $data[$key]["foudBase"] = $value["foudBase"];
            $data[$key]["foudRatio"] = $value["foudRatio"];
            $data[$key]["foudSelfMoney"] = $value["foudSelfMoney"];
            $data[$key]["foudRatioTwo"] = $value["foudRatioTwo"];
            $data[$key]["foudCompanyMoney"] = $value["foudCompanyMoney"];
            $data[$key]["foudCount"] = $value["foudCount"];
            $data[$key]["selfSocialAndFoudCount"] = $value["selfSocialAndFoudCount"];
            $data[$key]["companySocialAndFoudCount"] = $value["companySocialAndFoudCount"];
            $data[$key]["selfAndCompanyAllCount"] = $value["selfAndCompanyAllCount"];
            $data[$key]["paymentTime"] = $value["paymentTime"];
        }
        if ($data) {
            foreach ($data as &$val) {
                $val['type'] = $val['type'] == 1 ? '个人承担' : '公司承担';
            }
        }
        $title = [
            ['序号', 'A1', 'A2'],
            ['工号', 'B1', 'B2'],
            ['姓名', 'C1', 'C2'],
            ['部门', 'D1', 'D2'],
            ['证件号码', 'E1', 'E2'],
            ['缴纳城市', 'F1', 'F2'],
            ['户口类型', 'G1', 'G2'],
            ['缴纳账户', 'H1', 'H2'],
            ['缴纳形式', 'I1', 'I2'],
            ['补缴起始月', 'J1', 'J2'],
            ['补缴结束月', 'K1', 'K2'],
            ['补缴月', 'L1', 'L2'],
            ['医疗（含大额）', 'M1', 'S1'],
            ['养老', 'T1', 'Y1'],
            ['失业', 'Z1', 'AE1'],
            ['工伤', 'AF1', 'AH1'],
            ['生育', 'AI1', 'AK1'],
            ['社保合计', 'AL1', 'AN1'],
            ['公积金', 'AO1', 'AT1'],
            ['社保公积金合计', 'AU1', 'AW1'],
            ['实际缴费月份', 'AX1', 'AX2'],
        ];
        $arr = ['M2' => [
            '基数', '个人比例%', '固定费用', '个人金额', '公司比例%', '公司金额', '小计',
            '基数', '个人比例%', '个人金额', '公司比例%', '公司金额', '小计',
            '基数', '个人比例%', '个人金额', '公司比例%', '公司金额', '小计',
            '基数', '公司比例%', '公司金额',
            '基数', '公司比例%', '公司金额',
            '社保个人小计', '社保公司小计', '社保合计',
            '基数', '个人比例%', '个人金额', '公司比例%', '公司金额', '公积金合计',
            '个人合计', '公司合计', '总计',
        ]
        ];
        $url = self::socialParameterExportExcel($title, $arr, 3, $data);
        $urls = $_SERVER['SERVER_NAME'] . ltrim($url, ".");
        if ($urls) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $urls);
    }

    //4.6部门社保统计excel数据导出
    public function socialDepartmentStatisticExport()
    {
        if (I("department_id")) {
            $map['department_id'] = I('department_id');
            $cons['department_id'] = I('department_id');
        }

        $starTime = strtotime(I("starTime"));

        $endTime = strtotime(I("endTime"));

        if ($starTime != '' && $endTime != '') {
            $map['time'] = array('between', "$starTime,$endTime");
            $cons['paymentStarTime'] = $starTime;
            $cons['paymentEndTime'] = $endTime;
        }


        $pages = I("pages");
        $socialParameterInformation = D("SocialParameterInformation");
        $count = $socialParameterInformation->field('id,unumber,name,department,payLand,householdType,payAccount,medicalPayBase,medicalRatio,
            medicalFixedFee,medicalSelfMoney,medicalRatioTwo,medicalCompanyMoney,medicalCount,pensionPayBase,pensionRatio,pensionSelfMoney,
            pensionRatioTwo,pensionCompanyMoney,pensionCount,unemploymentPayBase,unemploymentRatio,unemploymentSelfMoney,unemploymentRatioTwo,
            unemploymentCompanyMoney,unemploymentCount,hurtedPayBase,hurtedRatioTwo,hurtedCompanyMoney,birthedPayBase,birthedRatioTwo,birthedCompanyMoney,
            socialSelfCount,socialCompanyCount,socialCount,foudBase,foudRatio,foudSelfMoney,foudRatioTwo,foudCompanyMoney,foudCount,selfSocialAndFoudCount,
            companySocialAndFoudCount,selfAndCompanyAllCount,time,department_id')->where($map)->count();
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

        //社保台账
        $list = $socialParameterInformation->field('id,unumber,name,department,payLand,householdType,payAccount,medicalPayBase,medicalRatio,
            medicalFixedFee,medicalSelfMoney,medicalRatioTwo,medicalCompanyMoney,medicalCount,pensionPayBase,pensionRatio,pensionSelfMoney,
            pensionRatioTwo,pensionCompanyMoney,pensionCount,unemploymentPayBase,unemploymentRatio,unemploymentSelfMoney,unemploymentRatioTwo,
            unemploymentCompanyMoney,unemploymentCount,hurtedPayBase,hurtedRatioTwo,hurtedCompanyMoney,birthedPayBase,birthedRatioTwo,birthedCompanyMoney,
            socialSelfCount,socialCompanyCount,socialCount,foudBase,foudRatio,foudSelfMoney,foudRatioTwo,foudCompanyMoney,foudCount,selfSocialAndFoudCount,
            companySocialAndFoudCount,selfAndCompanyAllCount,time,department_id')->where($map)->limit($offset, $pages)->select();
        $item = array();
        foreach ($list as $k => $v) {
            if (!isset($v['department_id'])) {
                $item[$v['department_id']] = $v;
            } else {
                $item[$v['department_id']]['department_id'] = $v['department_id'];
                $item[$v['department_id']]['department'] = $v['department'];
                $item[$v['department_id']]['medical'] += $v['medicalSelfMoney'];
                $item[$v['department_id']]['pension'] += $v['pensionSelfMoney'];
                $item[$v['department_id']]['unemployment'] += $v['unemploymentSelfMoney'];
                $item[$v['department_id']]['fund'] += $v['foudSelfMoney'];
                $item[$v['department_id']]['medicalTwo'] += $v['medicalCompanyMoney'];
                $item[$v['department_id']]['pensionTwo'] += $v['pensionCompanyMoney'];
                $item[$v['department_id']]['unemploymentTwo'] += $v['unemploymentCompanyMoney'];
                $item[$v['department_id']]['hurted'] += $v['hurtedCompanyMoney'];
                $item[$v['department_id']]['birthed'] += $v['birthedCompanyMoney'];
                $item[$v['department_id']]['fundTwo'] += $v['foudCompanyMoney'];
            }
        }
        //补缴信息
        $socialPaymentInformation = D("SocialPaymentInformation");
        $condition = $socialPaymentInformation->field('id,bid,unumber,name,department,cardNum,payLand,householdType,payAccount,type,
        paymentStarTime,paymentEndTime,paymentNum,medicalPayBase,medicalRatio,medicalFixedFee,medicalSelfMoney,medicalRatioTwo,
        medicalCompanyMoney,medicalCount,is_medical,pensionPayBase,pensionRatio,pensionSelfMoney,pensionRatioTwo,pensionCompanyMoney,
        pensionCount,is_pension,unemploymentPayBase,unemploymentRatio,unemploymentSelfMoney,unemploymentRatioTwo,unemploymentCompanyMoney,
        unemploymentCount,is_unemployment,hurtedPayBase,hurtedRatioTwo,hurtedCompanyMoney,is_hurted,birthedPayBase,birthedRatioTwo,
        birthedCompanyMoney,is_birthed,socialSelfCount,socialCompanyCount,socialCount,foudBase,foudRatio,foudSelfMoney,foudRatioTwo,
        foudCompanyMoney,foudCount,is_foud,selfSocialAndFoudCount,companySocialAndFoudCount,selfAndCompanyAllCount,paymentTime,department_id')
            ->where($cons)->select();
        $arr = array();
        foreach ($condition as $key => $value) {
            if (!isset($value['department_id'])) {
                $arr[$value['department_id']] = $value;
            } else {
                //个人补缴
                if ($value["type"] == "1") {
                    $arr[$value['department_id']]['department_id'] = $value['department_id'];
                    $arr[$value['department_id']]['department'] = $value['department'];
                    $arr[$value['department_id']]['medical'] += $value['medicalSelfMoney'];
                    $arr[$value['department_id']]['pension'] += $value['pensionSelfMoney'];
                    $arr[$value['department_id']]['unemployment'] += $value['unemploymentSelfMoney'];
                    $arr[$value['department_id']]['fund'] += $value['foudSelfMoney'];
                    $arr[$value['department_id']]['medicalTwo'] += $value['medicalCompanyMoney'];
                    $arr[$value['department_id']]['pensionTwo'] += $value['pensionCompanyMoney'];
                    $arr[$value['department_id']]['unemploymentTwo'] += $value['unemploymentCompanyMoney'];
                    $arr[$value['department_id']]['hurted'] += $value['hurtedCompanyMoney'];
                    $arr[$value['department_id']]['birthed'] += $value['birthedCompanyMoney'];
                    $arr[$value['department_id']]['fundTwo'] += $value['foudCompanyMoney'];

                    $li[$value['department_id']]['medical'] = $arr[$value['department_id']]['medical'] + $arr[$value['department_id']]['medicalTwo'];
                    $li[$value['department_id']]['pension'] = $arr[$value['department_id']]['pension'] + $arr[$value['department_id']]['pensionTwo'];
                    $li[$value['department_id']]['unemployment'] = $arr[$value['department_id']]['unemployment'] + $arr[$value['department_id']]['unemploymentTwo'];
                    $li[$value['department_id']]['fund'] = $arr[$value['department_id']]['fund'] + $arr[$value['department_id']]['fundTwo'];
                    $li[$value['department_id']]['hurted'] += $value['hurtedCompanyMoney'];
                    $li[$value['department_id']]['birthed'] += $value['birthedCompanyMoney'];
                    $li[$value['department_id']]['medicalTwo'] = 0;
                    $li[$value['department_id']]['pensionTwo'] = 0;
                    $li[$value['department_id']]['unemploymentTwo'] = 0;
                    $li[$value['department_id']]['fundTwo'] = 0;

                }
                if ($value["type"] == '2') {
                    $li[$value['department_id']]['medical'] += $value['medicalSelfMoney'];
                    $li[$value['department_id']]['pension'] += $value['pensionSelfMoney'];
                    $li[$value['department_id']]['unemployment'] += $value['unemploymentSelfMoney'];
                    $li[$value['department_id']]['fund'] += $value['foudSelfMoney'];
                    $li[$value['department_id']]['medicalTwo'] += $value['medicalCompanyMoney'];
                    $li[$value['department_id']]['pensionTwo'] += $value['pensionCompanyMoney'];
                    $li[$value['department_id']]['unemploymentTwo'] += $value['unemploymentCompanyMoney'];
                    $li[$value['department_id']]['hurted'] += $value['hurtedCompanyMoney'];
                    $li[$value['department_id']]['birthed'] += $value['birthedCompanyMoney'];
                    $li[$value['department_id']]['fundTwo'] += $value['foudCompanyMoney'];
                }
            }
        }
        //算出来每一项的和
        foreach ($item as $k1 => $v1) {
            foreach ($v1 as $k2 => $v2) {
                if ($k2 != 'department') {
                    $item[$k1][$k2] += $li[$k1][$k2];
                }
            }
        }

        foreach ($item as $ki => $vi) {
            if ($ki != 'department') {
                $con[$ki]['department'] = $vi["department"];
            }
            //个人社保总和
            $con[$ki]["medicalSelfCount"] = $vi["medical"] + $vi["pension"] + $vi["unemployment"];
            //公司社保总和
            $con[$ki]["medicalCompanyCount"] = $vi["medicalTwo"] + $vi["pensionTwo"] + $vi["unemploymentTwo"] + $vi["hurted"] + $vi["birthed"];
            //个人和公司社保总和
            $con[$ki]["medicalCount"] = $con[$ki]["medicalSelfCount"] + $con[$ki]["medicalCompanyCount"];
            //个人公积金
            $con[$ki]["fundSelfCount"] = $vi["fund"];
            //公司公积金
            $con[$ki]["fundTwoCount"] = $vi["fundTwo"];
            //公积金总和
            $con[$ki]["fundCount"] = $con[$ki]["fundSelfCount"] + $con[$ki]["fundTwoCount"];
            //个人社保和个人公积金
            $con[$ki]["selfMedicalAndFundCount"] = $con[$ki]["medicalSelfCount"] + $con[$ki]["fundCount"];
            //公司社保和公司公积金
            $con[$ki]["companyMedicalAndFundCount"] = $con[$ki]["medicalCompanyCount"] + $con[$ki]["fundTwoCount"];
            //社保和公积金总和
            $con[$ki]["medicalAndFundCount"] = $con[$ki]["selfMedicalAndFundCount"] + $con[$ki]["companyMedicalAndFundCount"];
        }

        foreach ($item as $key => $value) {
            $data[$key]["department"] = $value["department"];
            $data[$key]["medical"] = $value["medical"];
            $data[$key]["medicalTwo"] = $value["medicalTwo"];
            $data[$key]["pension"] = $value["pension"];
            $data[$key]["pensionTwo"] = $value["pensionTwo"];
            $data[$key]["unemployment"] = $value["unemployment"];
            $data[$key]["unemploymentTwo"] = $value["unemploymentTwo"];
            $data[$key]["hurted"] = $value["hurted"];
            $data[$key]["birthed"] = $value["birthed"];
            foreach ($con as $k => $v) {
                if ($k == $key) {
                    $data[$key]["medicalSelfCount"] = $v["medicalSelfCount"];
                    $data[$key]["medicalCompanyCount"] = $v["medicalCompanyCount"];
                    $data[$key]["medicalCount"] = $v["medicalCount"];
                    $data[$key]["fund"] = $value["fund"];
                    $data[$key]["fundTwo"] = $value["fundTwo"];
                    $data[$key]["fundCount"] = $v["fundCount"];
                    $data[$key]["selfMedicalAndFundCount"] = $v["selfMedicalAndFundCount"];
                    $data[$key]["companyMedicalAndFundCount"] = $v["companyMedicalAndFundCount"];
                    $data[$key]["medicalAndFundCount"] = $v["medicalAndFundCount"];
                }
            }
        }
        $title = [
            ['部门', 'A1', 'A2'],
            ['医疗小计', 'B1', 'C1'],
            ['养老小计', 'D1', 'E1'],
            ['失业小计', 'F1', 'G1'],
            ['工伤小计', 'H1', 'H1'],
            ['生育小计', 'I1', 'I1'],
            ['社保合计', 'J1', 'L1'],
            ['公积金合计', 'M1', 'O1'],
            ['社保公积金合计', 'P1', 'R1'],
        ];
        $arr = ['B2' => [
            '个人', '公司',
            '个人', '公司',
            '个人', '公司',
            '公司',
            '公司',
            '个人合计', '公司合计', '社保总计',
            '个人合计', '公司合计', '公积金总计',
            '个人合计', '公司合计', '总计',
        ]
        ];
        $url = self::socialParameterExportExcel($title, $arr, 3, $data);
        $urls = $_SERVER['SERVER_NAME'] . ltrim($url, ".");
        if ($urls) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $urls);
    }

    //4.7公司社保统计excel数据导出
    public function companySocialStatisticalExport()
    {
        if (I("payAccount_id")) {
            $map['payAccount_id'] = I('payAccount_id');
            $cons['payAccount_id'] = I('payAccount_id');
        }
        $starTime = strtotime(I("starTime"));

        $endTime = strtotime(I("endTime"));

        if ($starTime != '' && $endTime != '') {
            $map['time'] = array('between', "$starTime,$endTime");
            $cons['paymentStarTime'] = $starTime;
            $cons['paymentEndTime'] = $endTime;
        }
        $pages = I("pages");
        $socialParameterInformation = D("SocialParameterInformation");

        $count = $socialParameterInformation->field('id,unumber,name,department,payLand,householdType,payAccount,medicalPayBase,medicalRatio,
            medicalFixedFee,medicalSelfMoney,medicalRatioTwo,medicalCompanyMoney,medicalCount,pensionPayBase,pensionRatio,pensionSelfMoney,
            pensionRatioTwo,pensionCompanyMoney,pensionCount,unemploymentPayBase,unemploymentRatio,unemploymentSelfMoney,unemploymentRatioTwo,
            unemploymentCompanyMoney,unemploymentCount,hurtedPayBase,hurtedRatioTwo,hurtedCompanyMoney,birthedPayBase,birthedRatioTwo,birthedCompanyMoney,
            socialSelfCount,socialCompanyCount,socialCount,foudBase,foudRatio,foudSelfMoney,foudRatioTwo,foudCompanyMoney,foudCount,selfSocialAndFoudCount,
            companySocialAndFoudCount,selfAndCompanyAllCount,time,department_id,payAccount_id')->where($map)->count();
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

        //社保台账
        $list = $socialParameterInformation->field('id,unumber,name,department,payLand,householdType,payAccount,medicalPayBase,medicalRatio,
            medicalFixedFee,medicalSelfMoney,medicalRatioTwo,medicalCompanyMoney,medicalCount,pensionPayBase,pensionRatio,pensionSelfMoney,
            pensionRatioTwo,pensionCompanyMoney,pensionCount,unemploymentPayBase,unemploymentRatio,unemploymentSelfMoney,unemploymentRatioTwo,
            unemploymentCompanyMoney,unemploymentCount,hurtedPayBase,hurtedRatioTwo,hurtedCompanyMoney,birthedPayBase,birthedRatioTwo,birthedCompanyMoney,
            socialSelfCount,socialCompanyCount,socialCount,foudBase,foudRatio,foudSelfMoney,foudRatioTwo,foudCompanyMoney,foudCount,selfSocialAndFoudCount,
            companySocialAndFoudCount,selfAndCompanyAllCount,time,department_id,payAccount_id')->where($map)->limit($offset, $pages)->select();
        $item = array();
        foreach ($list as $k => $v) {
            if (!isset($v['payAccount_id'])) {
                $item[$v['payAccount_id']] = $v;
            } else {
                $item[$v['payAccount_id']]['payAccount_id'] = $v['payAccount_id'];
                $item[$v['payAccount_id']]['payAccount'] = $v['payAccount'];
                $item[$v['payAccount_id']]['medical'] += $v['medicalSelfMoney'];
                $item[$v['payAccount_id']]['pension'] += $v['pensionSelfMoney'];
                $item[$v['payAccount_id']]['unemployment'] += $v['unemploymentSelfMoney'];
                $item[$v['payAccount_id']]['fund'] += $v['foudSelfMoney'];
                $item[$v['payAccount_id']]['medicalTwo'] += $v['medicalCompanyMoney'];
                $item[$v['payAccount_id']]['pensionTwo'] += $v['pensionCompanyMoney'];
                $item[$v['payAccount_id']]['unemploymentTwo'] += $v['unemploymentCompanyMoney'];
                $item[$v['payAccount_id']]['hurted'] += $v['hurtedCompanyMoney'];
                $item[$v['payAccount_id']]['birthed'] += $v['birthedCompanyMoney'];
                $item[$v['payAccount_id']]['fundTwo'] += $v['foudCompanyMoney'];
            }
        }
        //补缴信息
        $socialPaymentInformation = D("SocialPaymentInformation");
        $condition = $socialPaymentInformation->field('id,bid,unumber,name,department,cardNum,payLand,householdType,payAccount,type,
        paymentStarTime,paymentEndTime,paymentNum,medicalPayBase,medicalRatio,medicalFixedFee,medicalSelfMoney,medicalRatioTwo,
        medicalCompanyMoney,medicalCount,is_medical,pensionPayBase,pensionRatio,pensionSelfMoney,pensionRatioTwo,pensionCompanyMoney,
        pensionCount,is_pension,unemploymentPayBase,unemploymentRatio,unemploymentSelfMoney,unemploymentRatioTwo,unemploymentCompanyMoney,
        unemploymentCount,is_unemployment,hurtedPayBase,hurtedRatioTwo,hurtedCompanyMoney,is_hurted,birthedPayBase,birthedRatioTwo,
        birthedCompanyMoney,is_birthed,socialSelfCount,socialCompanyCount,socialCount,foudBase,foudRatio,foudSelfMoney,foudRatioTwo,
        foudCompanyMoney,foudCount,is_foud,selfSocialAndFoudCount,companySocialAndFoudCount,selfAndCompanyAllCount,paymentTime,department_id')
            ->where($cons)->select();
        $arr = array();
        foreach ($condition as $key => $value) {
            if (!isset($value['payAccount'])) {
                $arr[$value['payAccount']] = $value;
            } else {
                //个人补缴
                if ($value["type"] == "1") {
                    $arr[$value['payAccount_id']]['payAccount_id'] = $value['payAccount_id'];
                    $arr[$value['payAccount_id']]['payAccount'] = $value['payAccount'];
                    $arr[$value['payAccount_id']]['medical'] += $value['medicalSelfMoney'];
                    $arr[$value['payAccount_id']]['pension'] += $value['pensionSelfMoney'];
                    $arr[$value['payAccount_id']]['unemployment'] += $value['unemploymentSelfMoney'];
                    $arr[$value['payAccount_id']]['fund'] += $value['foudSelfMoney'];
                    $arr[$value['payAccount_id']]['medicalTwo'] += $value['medicalCompanyMoney'];
                    $arr[$value['payAccount_id']]['pensionTwo'] += $value['pensionCompanyMoney'];
                    $arr[$value['payAccount_id']]['unemploymentTwo'] += $value['unemploymentCompanyMoney'];
                    $arr[$value['payAccount_id']]['hurted'] += $value['hurtedCompanyMoney'];
                    $arr[$value['payAccount_id']]['birthed'] += $value['birthedCompanyMoney'];
                    $arr[$value['payAccount_id']]['fundTwo'] += $value['foudCompanyMoney'];

                    $li[$value['payAccount_id']]['medical'] = $arr[$value['payAccount_id']]['medical'] + $arr[$value['payAccount_id']]['medicalTwo'];
                    $li[$value['payAccount_id']]['pension'] = $arr[$value['payAccount_id']]['pension'] + $arr[$value['payAccount_id']]['pensionTwo'];
                    $li[$value['payAccount_id']]['unemployment'] = $arr[$value['payAccount_id']]['unemployment'] + $arr[$value['payAccount_id']]['unemploymentTwo'];
                    $li[$value['payAccount_id']]['fund'] = $arr[$value['payAccount_id']]['fund'] + $arr[$value['payAccount_id']]['fundTwo'];
                    $li[$value['payAccount_id']]['hurted'] += $value['hurtedCompanyMoney'];
                    $li[$value['payAccount_id']]['birthed'] += $value['birthedCompanyMoney'];
                    $li[$value['payAccount_id']]['medicalTwo'] = 0;
                    $li[$value['payAccount_id']]['pensionTwo'] = 0;
                    $li[$value['payAccount_id']]['unemploymentTwo'] = 0;
                    $li[$value['payAccount_id']]['fundTwo'] = 0;

                }
                if ($value["type"] == '2') {
                    $li[$value['payAccount_id']]['medical'] += $value['medicalSelfMoney'];
                    $li[$value['payAccount_id']]['pension'] += $value['pensionSelfMoney'];
                    $li[$value['payAccount_id']]['unemployment'] += $value['unemploymentSelfMoney'];
                    $li[$value['payAccount_id']]['fund'] += $value['foudSelfMoney'];
                    $li[$value['payAccount_id']]['medicalTwo'] += $value['medicalCompanyMoney'];
                    $li[$value['payAccount_id']]['pensionTwo'] += $value['pensionCompanyMoney'];
                    $li[$value['payAccount_id']]['unemploymentTwo'] += $value['unemploymentCompanyMoney'];
                    $li[$value['payAccount_id']]['hurted'] += $value['hurtedCompanyMoney'];
                    $li[$value['payAccount_id']]['birthed'] += $value['birthedCompanyMoney'];
                    $li[$value['payAccount_id']]['fundTwo'] += $value['foudCompanyMoney'];
                }
            }
        }
        //算出来每一项的和
        foreach ($item as $k1 => $v1) {
            foreach ($v1 as $k2 => $v2) {
                if ($k2 != 'payAccount') {
                    $item[$k1][$k2] += $li[$k1][$k2];
                }
            }
        }
        foreach ($item as $ki => $vi) {
            if ($ki != 'payAccount_id') {
                $con[$ki]['payAccount'] = $vi["payAccount"];
            }
            //个人社保总和
            $con[$ki]["medicalSelfCount"] = $vi["medical"] + $vi["pension"] + $vi["unemployment"];
            //公司社保总和
            $con[$ki]["medicalCompanyCount"] = $vi["medicalTwo"] + $vi["pensionTwo"] + $vi["unemploymentTwo"] + $vi["hurted"] + $vi["birthed"];
            //个人和公司社保总和
            $con[$ki]["medicalCount"] = $con[$ki]["medicalSelfCount"] + $con[$ki]["medicalCompanyCount"];

            //个人公积金
            $con[$ki]["fundSelfCount"] = $vi["fund"];
            //公司公积金
            $con[$ki]["fundTwoCount"] = $vi["fundTwo"];
            //公积金总和
            $con[$ki]["fundCount"] = $con[$ki]["fundSelfCount"] + $con[$ki]["fundTwoCount"];
            //个人社保和个人公积金
            $con[$ki]["selfMedicalAndFundCount"] = $con[$ki]["medicalSelfCount"] + $con[$ki]["fundCount"];
            //公司社保和公司公积金
            $con[$ki]["companyMedicalAndFundCount"] = $con[$ki]["medicalCompanyCount"] + $con[$ki]["fundTwoCount"];
            //社保和公积金总和
            $con[$ki]["medicalAndFundCount"] = $con[$ki]["selfMedicalAndFundCount"] + $con[$ki]["companyMedicalAndFundCount"];
        }

        foreach ($item as $key => $value) {
            $data[$key]["payAccount"] = $value["payAccount"];

            $data[$key]["medical"] = $value["medical"];
            $data[$key]["medicalTwo"] = $value["medicalTwo"];
            $data[$key]["pension"] = $value["pension"];
            $data[$key]["pensionTwo"] = $value["pensionTwo"];
            $data[$key]["unemployment"] = $value["unemployment"];
            $data[$key]["unemploymentTwo"] = $value["unemploymentTwo"];
            $data[$key]["hurted"] = $value["hurted"];
            $data[$key]["birthed"] = $value["birthed"];
            foreach ($con as $k => $v) {
                if ($k == $key) {
                    $data[$key]["medicalSelfCount"] = $v["medicalSelfCount"];
                    $data[$key]["medicalCompanyCount"] = $v["medicalCompanyCount"];
                    $data[$key]["medicalCount"] = $v["medicalCount"];
                    $data[$key]["fundSelfCount"] = $v["fundSelfCount"];
                    $data[$key]["fundTwoCount"] = $v["fundTwoCount"];
                    $data[$key]["fundCount"] = $v["fundCount"];
                    $data[$key]["selfMedicalAndFundCount"] = $v["selfMedicalAndFundCount"];
                    $data[$key]["companyMedicalAndFundCount"] = $v["companyMedicalAndFundCount"];
                    $data[$key]["medicalAndFundCount"] = $v["medicalAndFundCount"];
                }

            }

        }
        $title = [
            ['缴纳账户', 'A1', 'A2'],
            ['医疗小计', 'B1', 'C1'],
            ['养老小计', 'D1', 'E1'],
            ['失业小计', 'F1', 'G1'],
            ['工伤小计', 'H1', 'H1'],
            ['生育小计', 'I1', 'I1'],
            ['社保合计', 'J1', 'L1'],
            ['公积金合计', 'M1', 'O1'],
            ['社保公积金合计', 'P1', 'R1'],
        ];
        $arr = ['B2' => [
            '个人', '公司',
            '个人', '公司',
            '个人', '公司',
            '公司',
            '公司',
            '个人合计', '公司合计', '社保总计',
            '个人合计', '公司合计', '公积金总计',
            '个人合计', '公司合计', '总计',
        ]
        ];
        $url = self::socialParameterExportExcel($title, $arr, 3, $data);
        $urls = $_SERVER['SERVER_NAME'] . ltrim($url, ".");
        if ($urls) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $urls);
    }

    //4.8个人社保明细excel数据导出
    public function selfSocialStatisticalExport()
    {
        if (I("department_id")) {
            $map['department_id'] = I('department_id');
            $cond['department_id'] = I('department_id');
        }
        if (I("payAccount_id")) {
            $map['payAccount_id'] = I('payAccount_id');
            $cond['payAccount_id'] = I('payAccount_id');
        }

        if (I("name")) {
            $map['name'] = array('like', '%' . I('name') . '%');
            $cond['name'] = array('like', '%' . I('name') . '%');
        }

        $starTime = strtotime(I("starTime"));

        $endTime = strtotime(I("endTime"));

        if ($starTime != '' && $endTime != '') {
            $map['time'] = array('between', "$starTime,$endTime");
        }

        $pages = I("pages");
        $socialParameterInformation = D("SocialParameterInformation");
        $count = $socialParameterInformation->field('id,bid,unumber,name,department,payLand,householdType,payAccount,medicalPayBase,medicalRatio,
            medicalFixedFee,medicalSelfMoney,medicalRatioTwo,medicalCompanyMoney,medicalCount,pensionPayBase,pensionRatio,pensionSelfMoney,
            pensionRatioTwo,pensionCompanyMoney,pensionCount,unemploymentPayBase,unemploymentRatio,unemploymentSelfMoney,unemploymentRatioTwo,
            unemploymentCompanyMoney,unemploymentCount,hurtedPayBase,hurtedRatioTwo,hurtedCompanyMoney,birthedPayBase,birthedRatioTwo,birthedCompanyMoney,
            socialSelfCount,socialCompanyCount,socialCount,foudBase,foudRatio,foudSelfMoney,foudRatioTwo,foudCompanyMoney,foudCount,selfSocialAndFoudCount,
            companySocialAndFoudCount,selfAndCompanyAllCount,time,department_id')->where($map)->count();
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

        //社保台账
        $list = $socialParameterInformation->field('id,bid,unumber,name,department,payLand,householdType,payAccount,medicalPayBase,medicalRatio,
            medicalFixedFee,medicalSelfMoney,medicalRatioTwo,medicalCompanyMoney,medicalCount,pensionPayBase,pensionRatio,pensionSelfMoney,
            pensionRatioTwo,pensionCompanyMoney,pensionCount,unemploymentPayBase,unemploymentRatio,unemploymentSelfMoney,unemploymentRatioTwo,
            unemploymentCompanyMoney,unemploymentCount,hurtedPayBase,hurtedRatioTwo,hurtedCompanyMoney,birthedPayBase,birthedRatioTwo,birthedCompanyMoney,
            socialSelfCount,socialCompanyCount,socialCount,foudBase,foudRatio,foudSelfMoney,foudRatioTwo,foudCompanyMoney,foudCount,selfSocialAndFoudCount,
            companySocialAndFoudCount,selfAndCompanyAllCount,time,department_id')->where($map)->limit($offset, $pages)->select();

        //补缴信息
        $socialPaymentInformation = D("SocialPaymentInformation");
        $condition = $socialPaymentInformation->field('id,bid,unumber,name,department,cardNum,payLand,householdType,payAccount,type,
                paymentStarTime,paymentEndTime,paymentNum,medicalPayBase,medicalRatio,medicalFixedFee,medicalSelfMoney,medicalRatioTwo,
                medicalCompanyMoney,medicalCount,is_medical,pensionPayBase,pensionRatio,pensionSelfMoney,pensionRatioTwo,pensionCompanyMoney,
                pensionCount,is_pension,unemploymentPayBase,unemploymentRatio,unemploymentSelfMoney,unemploymentRatioTwo,unemploymentCompanyMoney,
                unemploymentCount,is_unemployment,hurtedPayBase,hurtedRatioTwo,hurtedCompanyMoney,is_hurted,birthedPayBase,birthedRatioTwo,
                birthedCompanyMoney,is_birthed,socialSelfCount,socialCompanyCount,socialCount,foudBase,foudRatio,foudSelfMoney,foudRatioTwo,
                foudCompanyMoney,foudCount,is_foud,selfSocialAndFoudCount,companySocialAndFoudCount,selfAndCompanyAllCount,paymentTime,department_id,payAccount_id')
            ->where($cond)->select();

        foreach ($condition as $key => $value) {
            if (!isset($value['department_id'])) {
                $arr[$value['department_id']] = $value;
            } else {
                foreach ($list as $k => $v) {
                    if ($value['bid'] == $v['bid']) {
                        if ($value["type"] == '1') {
                            $arr[$v['bid']]['bid'] = $v['bid'];
                            $arr[$v['bid']]['department'] = $v['department'];
                            $arr[$v['bid']]['name'] = $value['name'];
                            $arr[$v['bid']]['time'] = date("Y-m", $v['time']);
                            $arr[$v['bid']]['unumber'] = $v['unumber'];
                            $arr[$v['bid']]['payLand'] = $v['payLand'];
                            $arr[$v['bid']]['householdType'] = $v['householdType'];
                            $arr[$v['bid']]['payAccount'] = $v['payAccount'];
                            $arr[$v['bid']]['medicalPayBase'] = $v['medicalPayBase'];
                            $arr[$v['bid']]['foudBase'] = $v['foudBase'];
                            //个人
                            $arr[$value['bid']]['medical'] = $v['medicalSelfMoney'] + $value['medicalSelfMoney'] + $value['medicalCompanyMoney'];
                            $arr[$value['bid']]['pension'] = $v['pensionSelfMoney'] + $value['pensionSelfMoney'] + $value['pensionCompanyMoney'];
                            $arr[$value['bid']]['unemployment'] = $v['unemploymentSelfMoney'] + $value['unemploymentSelfMoney'] + $value['unemploymentCompanyMoney'];
                            $arr[$value['bid']]['fund'] = $v['foudSelfMoney'] + $value['foudSelfMoney'] + $value['foudCompanyMoney'];
                            $arr[$value['bid']]['selfHurted'] = $value['hurtedCompanyMoney'];
                            $arr[$value['bid']]['selfBirthed'] = $value['birthedCompanyMoney'];
                            //公司
                            $arr[$value['bid']]['medicalTwo'] = $v['medicalCompanyMoney'];
                            $arr[$value['bid']]['pensionTwo'] = $v['pensionCompanyMoney'];
                            $arr[$value['bid']]['unemploymentTwo'] = $v['unemploymentCompanyMoney'];
                            $arr[$value['bid']]['hurtedTwo'] = $v['hurtedCompanyMoney'];
                            $arr[$value['bid']]['birthedTwo'] = $v['birthedCompanyMoney'];
                            $arr[$value['bid']]['fundTwo'] = $v['foudCompanyMoney'];
                        }
                        if ($value["type"] == '2') {
                            $arr[$v['bid']]['bid'] = $v['bid'];
                            $arr[$v['bid']]['department'] = $v['department'];
                            $arr[$v['bid']]['name'] = $value['name'];
                            $arr[$v['bid']]['time'] = date("Y-m", $v['time']);
                            $arr[$v['bid']]['unumber'] = $v['unumber'];
                            $arr[$v['bid']]['payLand'] = $v['payLand'];
                            $arr[$v['bid']]['householdType'] = $v['householdType'];
                            $arr[$v['bid']]['payAccount'] = $v['payAccount'];
                            $arr[$v['bid']]['medicalPayBase'] = $v['medicalPayBase'];
                            $arr[$v['bid']]['foudBase'] = $v['foudBase'];
                            //个人
                            $arr[$value['bid']]['medical'] = $v['medicalSelfMoney'] + $value['medicalSelfMoney'];
                            $arr[$value['bid']]['pension'] = $v['pensionSelfMoney'] + $value['pensionSelfMoney'];
                            $arr[$value['bid']]['unemployment'] = $v['unemploymentSelfMoney'] + $value['unemploymentSelfMoney'];
                            $arr[$value['bid']]['fund'] = $v['foudSelfMoney'] + $value['foudSelfMoney'];
                            $arr[$value['bid']]['selfHurted'] = 0;
                            $arr[$value['bid']]['selfBirthed'] = 0;
                            //公司
                            $arr[$value['bid']]['medicalTwo'] = $v['medicalCompanyMoney'] + $value['medicalCompanyMoney'];
                            $arr[$value['bid']]['pensionTwo'] = $v['pensionCompanyMoney'] + $value['pensionCompanyMoney'];
                            $arr[$value['bid']]['unemploymentTwo'] = $v['unemploymentCompanyMoney'] + $value['unemploymentCompanyMoney'];
                            $arr[$value['bid']]['hurtedTwo'] = $v['hurtedCompanyMoney'] + $value['hurtedCompanyMoney'];
                            $arr[$value['bid']]['birthedTwo'] = $v['birthedCompanyMoney'] + $value['birthedCompanyMoney'];
                            $arr[$value['bid']]['fundTwo'] = $v['foudCompanyMoney'] + $value['foudCompanyMoney'];
                        }
                    }
                }
            }
        }

        foreach ($arr as $ki => $vi) {
            if ($ki != 'department') {
                $con[$ki]['bid'] = $vi["bid"];
                $con[$ki]['department'] = $vi["department"];
            }
            if ($ki != 'payAccount') {
                $con[$ki]['bid'] = $vi["bid"];
                $con[$ki]['payAccount'] = $vi["payAccount"];
            }
            //个人社保总和
            $con[$ki]["medicalSelfCount"] = $vi["medical"] + $vi["pension"] + $vi["unemployment"] + $vi["selfHurted"] + $vi["selfBirthed"];
            //公司社保总和
            $con[$ki]["medicalCompanyCount"] = $vi["medicalTwo"] + $vi["pensionTwo"] + $vi["unemploymentTwo"] + $vi["hurtedTwo"] + $vi["birthedTwo"];
            //个人和公司社保总和
            $con[$ki]["medicalCount"] = $con[$ki]["medicalSelfCount"] + $con[$ki]["medicalCompanyCount"];
            //个人公积金
            $con[$ki]["fundSelfCount"] = $vi["fund"];
            //公司公积金
            $con[$ki]["fundCompanyCount"] = $vi["fundTwo"];
            //公积金总和
            $con[$ki]["fundCount"] = $con[$ki]["fundSelfCount"] + $con[$ki]["fundCompanyCount"];
            //个人社保和公积金总和
            $con[$ki]["selfMedicalAndFundCount"] = $con[$ki]["medicalSelfCount"] + $con[$ki]["fundSelfCount"];
            //公司社保和公积金总和
            $con[$ki]["companyMedicalAndFundCount"] = $con[$ki]["medicalCompanyCount"] + $con[$ki]["fundCompanyCount"];
            //总计
            $con[$ki]["allCount"] = $con[$ki]["selfMedicalAndFundCount"] + $con[$ki]["companyMedicalAndFundCount"];

        }

        foreach ($arr as $key => $value) {
            $data[$key]["name"] = $value["name"];
            $data[$key]["department"] = $value["department"];
            $data[$key]["payAccount"] = $value["payAccount"];
            $data[$key]["time"] = $value["time"];
            $data[$key]["payLand"] = $value["payLand"];
            $data[$key]["householdType"] = $value["householdType"];
            $data[$key]["medicalPayBase"] = $value["medicalPayBase"];
            $data[$key]["medical"] = $value["medical"];
            $data[$key]["medicalTwo"] = $value["medicalTwo"];
            $data[$key]["pension"] = $value["pension"];
            $data[$key]["pensionTwo"] = $value["pensionTwo"];
            $data[$key]["unemployment"] = $value["unemployment"];
            $data[$key]["unemploymentTwo"] = $value["unemploymentTwo"];
            $data[$key]["selfHurted"] = $value["selfHurted"];
            $data[$key]["hurtedTwo"] = $value["hurtedTwo"];
            $data[$key]["selfBirthed"] = $value["selfBirthed"];
            $data[$key]["birthedTwo"] = $value["birthedTwo"];
            foreach ($con as $k => $v) {
                if ($k == $key) {
                    $data[$key]["medicalSelfCount"] = $v["medicalSelfCount"];
                    $data[$key]["medicalCompanyCount"] = $v["medicalCompanyCount"];
                    $data[$key]["medicalCount"] = $v["medicalCount"];
                    $data[$key]["foudBase"] = $value["foudBase"];
                    $data[$key]["fundSelfCount"] = $v["fundSelfCount"];
                    $data[$key]["fundCompanyCount"] = $v["fundCompanyCount"];
                    $data[$key]["fundCount"] = $v["fundCount"];
                    $data[$key]["selfMedicalAndFundCount"] = $v["selfMedicalAndFundCount"];
                    $data[$key]["companyMedicalAndFundCount"] = $v["companyMedicalAndFundCount"];
                    $data[$key]["allCount"] = $v["allCount"];
                }
            }

        }
        $title = [
            ['员工', 'A1', 'A2'],
            ['部门', 'B1', 'B2'],
            ['缴纳账户', 'C1', 'C2'],
            ['期间', 'D1', 'D2'],
            ['社保缴纳地', 'E1', 'E2'],
            ['户口性质', 'F1', 'F2'],
            ['社保基数', 'G1', 'G2'],
            ['医疗', 'H1', 'I1'],
            ['养老', 'J1', 'K1'],
            ['失业', 'L1', 'M1'],
            ['工伤', 'N1', 'O1'],
            ['生育', 'P1', 'Q1'],
            ['社保合计', 'R1', 'T1'],
            ['公积金基数', 'U1', 'U2'],
            ['公积金合计', 'V1', 'X1'],
            ['社保公积金合计', 'Y1', 'AA1'],
        ];
        $arr = ['H2' => [
            '个人', '公司',
            '个人', '公司',
            '个人', '公司',
            '个人', '公司',
            '个人', '公司',
            '个人合计', '公司合计', '社保总计',
            '',
            '个人合计', '公司合计', '公积金总计',
            '个人合计', '公司合计', '总计',
        ]
        ];
        $url = self::socialParameterExportExcel($title, $arr, 3, $data);
        $urls = $_SERVER['SERVER_NAME'] . ltrim($url, ".");
        if ($urls) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $urls);
    }

    //4.6部门社保统计
    public function socialDepartmentStatistic()
    {
        if (I("department_id")) {
            $map['department_id'] = I('department_id');
            $cons['department_id'] = I('department_id');
        }

        $starTime = strtotime(I("starTime"));

        $endTime = strtotime(I("endTime"));

        if ($starTime != '' && $endTime != '') {
            $map['time'] = array('between', "$starTime,$endTime");
            $cons['paymentStarTime'] = $starTime;
            $cons['paymentEndTime'] = $endTime;
        }


        $pages = I("pages");
        $socialParameterInformation = D("SocialParameterInformation");
        $count = $socialParameterInformation->field('id,unumber,name,department,payLand,householdType,payAccount,medicalPayBase,medicalRatio,
            medicalFixedFee,medicalSelfMoney,medicalRatioTwo,medicalCompanyMoney,medicalCount,pensionPayBase,pensionRatio,pensionSelfMoney,
            pensionRatioTwo,pensionCompanyMoney,pensionCount,unemploymentPayBase,unemploymentRatio,unemploymentSelfMoney,unemploymentRatioTwo,
            unemploymentCompanyMoney,unemploymentCount,hurtedPayBase,hurtedRatioTwo,hurtedCompanyMoney,birthedPayBase,birthedRatioTwo,birthedCompanyMoney,
            socialSelfCount,socialCompanyCount,socialCount,foudBase,foudRatio,foudSelfMoney,foudRatioTwo,foudCompanyMoney,foudCount,selfSocialAndFoudCount,
            companySocialAndFoudCount,selfAndCompanyAllCount,time,department_id')->where($map)->count();
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

        //社保台账
        $list = $socialParameterInformation->field('id,unumber,name,department,payLand,householdType,payAccount,medicalPayBase,medicalRatio,
            medicalFixedFee,medicalSelfMoney,medicalRatioTwo,medicalCompanyMoney,medicalCount,pensionPayBase,pensionRatio,pensionSelfMoney,
            pensionRatioTwo,pensionCompanyMoney,pensionCount,unemploymentPayBase,unemploymentRatio,unemploymentSelfMoney,unemploymentRatioTwo,
            unemploymentCompanyMoney,unemploymentCount,hurtedPayBase,hurtedRatioTwo,hurtedCompanyMoney,birthedPayBase,birthedRatioTwo,birthedCompanyMoney,
            socialSelfCount,socialCompanyCount,socialCount,foudBase,foudRatio,foudSelfMoney,foudRatioTwo,foudCompanyMoney,foudCount,selfSocialAndFoudCount,
            companySocialAndFoudCount,selfAndCompanyAllCount,time,department_id')->where($map)->limit($offset, $pages)->select();
        $item = array();
        foreach ($list as $k => $v) {
            if (!isset($v['department_id'])) {
                $item[$v['department_id']] = $v;
            } else {
                $item[$v['department_id']]['department_id'] = $v['department_id'];
                $item[$v['department_id']]['department'] = $v['department'];
                $item[$v['department_id']]['medical'] += $v['medicalSelfMoney'];
                $item[$v['department_id']]['pension'] += $v['pensionSelfMoney'];
                $item[$v['department_id']]['unemployment'] += $v['unemploymentSelfMoney'];
                $item[$v['department_id']]['fund'] += $v['foudSelfMoney'];
                $item[$v['department_id']]['medicalTwo'] += $v['medicalCompanyMoney'];
                $item[$v['department_id']]['pensionTwo'] += $v['pensionCompanyMoney'];
                $item[$v['department_id']]['unemploymentTwo'] += $v['unemploymentCompanyMoney'];
                $item[$v['department_id']]['hurted'] += $v['hurtedCompanyMoney'];
                $item[$v['department_id']]['birthed'] += $v['birthedCompanyMoney'];
                $item[$v['department_id']]['fundTwo'] += $v['foudCompanyMoney'];
            }
        }
        //补缴信息
        $socialPaymentInformation = D("SocialPaymentInformation");
        $condition = $socialPaymentInformation->field('id,bid,unumber,name,department,cardNum,payLand,householdType,payAccount,type,
        paymentStarTime,paymentEndTime,paymentNum,medicalPayBase,medicalRatio,medicalFixedFee,medicalSelfMoney,medicalRatioTwo,
        medicalCompanyMoney,medicalCount,is_medical,pensionPayBase,pensionRatio,pensionSelfMoney,pensionRatioTwo,pensionCompanyMoney,
        pensionCount,is_pension,unemploymentPayBase,unemploymentRatio,unemploymentSelfMoney,unemploymentRatioTwo,unemploymentCompanyMoney,
        unemploymentCount,is_unemployment,hurtedPayBase,hurtedRatioTwo,hurtedCompanyMoney,is_hurted,birthedPayBase,birthedRatioTwo,
        birthedCompanyMoney,is_birthed,socialSelfCount,socialCompanyCount,socialCount,foudBase,foudRatio,foudSelfMoney,foudRatioTwo,
        foudCompanyMoney,foudCount,is_foud,selfSocialAndFoudCount,companySocialAndFoudCount,selfAndCompanyAllCount,paymentTime,department_id')
            ->where($cons)->select();
        $arr = array();
        foreach ($condition as $key => $value) {
            if (!isset($value['department_id'])) {
                $arr[$value['department_id']] = $value;
            } else {
                //个人补缴
                if ($value["type"] == "1") {
                    $arr[$value['department_id']]['department_id'] = $value['department_id'];
                    $arr[$value['department_id']]['department'] = $value['department'];
                    $arr[$value['department_id']]['medical'] += $value['medicalSelfMoney'];
                    $arr[$value['department_id']]['pension'] += $value['pensionSelfMoney'];
                    $arr[$value['department_id']]['unemployment'] += $value['unemploymentSelfMoney'];
                    $arr[$value['department_id']]['fund'] += $value['foudSelfMoney'];
                    $arr[$value['department_id']]['medicalTwo'] += $value['medicalCompanyMoney'];
                    $arr[$value['department_id']]['pensionTwo'] += $value['pensionCompanyMoney'];
                    $arr[$value['department_id']]['unemploymentTwo'] += $value['unemploymentCompanyMoney'];
                    $arr[$value['department_id']]['hurted'] += $value['hurtedCompanyMoney'];
                    $arr[$value['department_id']]['birthed'] += $value['birthedCompanyMoney'];
                    $arr[$value['department_id']]['fundTwo'] += $value['foudCompanyMoney'];

                    $li[$value['department_id']]['medical'] = $arr[$value['department_id']]['medical'] + $arr[$value['department_id']]['medicalTwo'];
                    $li[$value['department_id']]['pension'] = $arr[$value['department_id']]['pension'] + $arr[$value['department_id']]['pensionTwo'];
                    $li[$value['department_id']]['unemployment'] = $arr[$value['department_id']]['unemployment'] + $arr[$value['department_id']]['unemploymentTwo'];
                    $li[$value['department_id']]['fund'] = $arr[$value['department_id']]['fund'] + $arr[$value['department_id']]['fundTwo'];
                    $li[$value['department_id']]['hurted'] += $value['hurtedCompanyMoney'];
                    $li[$value['department_id']]['birthed'] += $value['birthedCompanyMoney'];
                    $li[$value['department_id']]['medicalTwo'] = 0;
                    $li[$value['department_id']]['pensionTwo'] = 0;
                    $li[$value['department_id']]['unemploymentTwo'] = 0;
                    $li[$value['department_id']]['fundTwo'] = 0;

                }
                if ($value["type"] == '2') {
                    $li[$value['department_id']]['medical'] += $value['medicalSelfMoney'];
                    $li[$value['department_id']]['pension'] += $value['pensionSelfMoney'];
                    $li[$value['department_id']]['unemployment'] += $value['unemploymentSelfMoney'];
                    $li[$value['department_id']]['fund'] += $value['foudSelfMoney'];
                    $li[$value['department_id']]['medicalTwo'] += $value['medicalCompanyMoney'];
                    $li[$value['department_id']]['pensionTwo'] += $value['pensionCompanyMoney'];
                    $li[$value['department_id']]['unemploymentTwo'] += $value['unemploymentCompanyMoney'];
                    $li[$value['department_id']]['hurted'] += $value['hurtedCompanyMoney'];
                    $li[$value['department_id']]['birthed'] += $value['birthedCompanyMoney'];
                    $li[$value['department_id']]['fundTwo'] += $value['foudCompanyMoney'];
                }
            }
        }
        //算出来每一项的和
        foreach ($item as $k1 => $v1) {
            foreach ($v1 as $k2 => $v2) {
                if ($k2 != 'department') {
                    $item[$k1][$k2] += $li[$k1][$k2];
                }
            }
        }
        foreach ($item as $ki => $vi) {
            if ($ki != 'department') {
                $con[$ki]['department'] = $vi["department"];
            }
            //个人社保总和
            $con[$ki]["medicalSelfCount"] = $vi["medical"] + $vi["pension"] + $vi["unemployment"];
            //公司社保总和
            $con[$ki]["medicalCompanyCount"] = $vi["medicalTwo"] + $vi["pensionTwo"] + $vi["unemploymentTwo"] + $vi["hurted"] + $vi["birthed"];
            //个人和公司社保总和
            $con[$ki]["medicalCount"] = $con[$ki]["medicalSelfCount"] + $con[$ki]["medicalCompanyCount"];
            //个人公积金
            $con[$ki]["fundSelfCount"] = $vi["fund"];
            //公司公积金
            $con[$ki]["fundTwoCount"] = $vi["fundTwo"];
            //公积金总和
            $con[$ki]["fundCount"] = $con[$ki]["fundSelfCount"] + $con[$ki]["fundTwoCount"];
            //个人社保和个人公积金
            $con[$ki]["selfMedicalAndFundCount"] = $con[$ki]["medicalSelfCount"] + $con[$ki]["fundCount"];
            //公司社保和公司公积金
            $con[$ki]["companyMedicalAndFundCount"] = $con[$ki]["medicalCompanyCount"] + $con[$ki]["fundTwoCount"];
            //社保和公积金总和
            $con[$ki]["medicalAndFundCount"] = $con[$ki]["selfMedicalAndFundCount"] + $con[$ki]["companyMedicalAndFundCount"];
        }

        $item = array_values($item);
        $con = array_values($con);
        $result = array(
            'page' => $page,
            'pageNum' => $pageNum,
            'item' => $item,
            'con' => $con
        );

        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //4.7公司社保统计
    public function companySocialStatistical()
    {
        if (I("payAccount_id")) {
            $map['payAccount_id'] = I('payAccount_id');
            $cons['payAccount_id'] = I('payAccount_id');
        }
        $starTime = strtotime(I("starTime"));

        $endTime = strtotime(I("endTime"));

        if ($starTime != '' && $endTime != '') {
            $map['time'] = array('between', "$starTime,$endTime");
            $cons['paymentStarTime'] = $starTime;
            $cons['paymentEndTime'] = $endTime;
        }
        $pages = I("pages");
        $socialParameterInformation = D("SocialParameterInformation");

        $count = $socialParameterInformation->field('id,unumber,name,department,payLand,householdType,payAccount,medicalPayBase,medicalRatio,
            medicalFixedFee,medicalSelfMoney,medicalRatioTwo,medicalCompanyMoney,medicalCount,pensionPayBase,pensionRatio,pensionSelfMoney,
            pensionRatioTwo,pensionCompanyMoney,pensionCount,unemploymentPayBase,unemploymentRatio,unemploymentSelfMoney,unemploymentRatioTwo,
            unemploymentCompanyMoney,unemploymentCount,hurtedPayBase,hurtedRatioTwo,hurtedCompanyMoney,birthedPayBase,birthedRatioTwo,birthedCompanyMoney,
            socialSelfCount,socialCompanyCount,socialCount,foudBase,foudRatio,foudSelfMoney,foudRatioTwo,foudCompanyMoney,foudCount,selfSocialAndFoudCount,
            companySocialAndFoudCount,selfAndCompanyAllCount,time,department_id,payAccount_id')->where($map)->count();
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

        //社保台账
        $list = $socialParameterInformation->field('id,unumber,name,department,payLand,householdType,payAccount,medicalPayBase,medicalRatio,
            medicalFixedFee,medicalSelfMoney,medicalRatioTwo,medicalCompanyMoney,medicalCount,pensionPayBase,pensionRatio,pensionSelfMoney,
            pensionRatioTwo,pensionCompanyMoney,pensionCount,unemploymentPayBase,unemploymentRatio,unemploymentSelfMoney,unemploymentRatioTwo,
            unemploymentCompanyMoney,unemploymentCount,hurtedPayBase,hurtedRatioTwo,hurtedCompanyMoney,birthedPayBase,birthedRatioTwo,birthedCompanyMoney,
            socialSelfCount,socialCompanyCount,socialCount,foudBase,foudRatio,foudSelfMoney,foudRatioTwo,foudCompanyMoney,foudCount,selfSocialAndFoudCount,
            companySocialAndFoudCount,selfAndCompanyAllCount,time,department_id,payAccount_id')->where($map)->limit($offset, $pages)->select();
        $item = array();
        foreach ($list as $k => $v) {
            if (!isset($v['payAccount_id'])) {
                $item[$v['payAccount_id']] = $v;
            } else {
                $item[$v['payAccount_id']]['payAccount_id'] = $v['payAccount_id'];
                $item[$v['payAccount_id']]['payAccount'] = $v['payAccount'];
                $item[$v['payAccount_id']]['medical'] += $v['medicalSelfMoney'];
                $item[$v['payAccount_id']]['pension'] += $v['pensionSelfMoney'];
                $item[$v['payAccount_id']]['unemployment'] += $v['unemploymentSelfMoney'];
                $item[$v['payAccount_id']]['fund'] += $v['foudSelfMoney'];
                $item[$v['payAccount_id']]['medicalTwo'] += $v['medicalCompanyMoney'];
                $item[$v['payAccount_id']]['pensionTwo'] += $v['pensionCompanyMoney'];
                $item[$v['payAccount_id']]['unemploymentTwo'] += $v['unemploymentCompanyMoney'];
                $item[$v['payAccount_id']]['hurted'] += $v['hurtedCompanyMoney'];
                $item[$v['payAccount_id']]['birthed'] += $v['birthedCompanyMoney'];
                $item[$v['payAccount_id']]['fundTwo'] += $v['foudCompanyMoney'];
            }
        }
        //补缴信息
        $socialPaymentInformation = D("SocialPaymentInformation");
        $condition = $socialPaymentInformation->field('id,bid,unumber,name,department,cardNum,payLand,householdType,payAccount,type,
        paymentStarTime,paymentEndTime,paymentNum,medicalPayBase,medicalRatio,medicalFixedFee,medicalSelfMoney,medicalRatioTwo,
        medicalCompanyMoney,medicalCount,is_medical,pensionPayBase,pensionRatio,pensionSelfMoney,pensionRatioTwo,pensionCompanyMoney,
        pensionCount,is_pension,unemploymentPayBase,unemploymentRatio,unemploymentSelfMoney,unemploymentRatioTwo,unemploymentCompanyMoney,
        unemploymentCount,is_unemployment,hurtedPayBase,hurtedRatioTwo,hurtedCompanyMoney,is_hurted,birthedPayBase,birthedRatioTwo,
        birthedCompanyMoney,is_birthed,socialSelfCount,socialCompanyCount,socialCount,foudBase,foudRatio,foudSelfMoney,foudRatioTwo,
        foudCompanyMoney,foudCount,is_foud,selfSocialAndFoudCount,companySocialAndFoudCount,selfAndCompanyAllCount,paymentTime,department_id')
            ->where($cons)->select();
        $arr = array();
        foreach ($condition as $key => $value) {
            if (!isset($value['payAccount'])) {
                $arr[$value['payAccount']] = $value;
            } else {
                //个人补缴
                if ($value["type"] == "1") {
                    $arr[$value['payAccount_id']]['payAccount_id'] = $value['payAccount_id'];
                    $arr[$value['payAccount_id']]['payAccount'] = $value['payAccount'];
                    $arr[$value['payAccount_id']]['medical'] += $value['medicalSelfMoney'];
                    $arr[$value['payAccount_id']]['pension'] += $value['pensionSelfMoney'];
                    $arr[$value['payAccount_id']]['unemployment'] += $value['unemploymentSelfMoney'];
                    $arr[$value['payAccount_id']]['fund'] += $value['foudSelfMoney'];
                    $arr[$value['payAccount_id']]['medicalTwo'] += $value['medicalCompanyMoney'];
                    $arr[$value['payAccount_id']]['pensionTwo'] += $value['pensionCompanyMoney'];
                    $arr[$value['payAccount_id']]['unemploymentTwo'] += $value['unemploymentCompanyMoney'];
                    $arr[$value['payAccount_id']]['hurted'] += $value['hurtedCompanyMoney'];
                    $arr[$value['payAccount_id']]['birthed'] += $value['birthedCompanyMoney'];
                    $arr[$value['payAccount_id']]['fundTwo'] += $value['foudCompanyMoney'];

                    $li[$value['payAccount_id']]['medical'] = $arr[$value['payAccount_id']]['medical'] + $arr[$value['payAccount_id']]['medicalTwo'];
                    $li[$value['payAccount_id']]['pension'] = $arr[$value['payAccount_id']]['pension'] + $arr[$value['payAccount_id']]['pensionTwo'];
                    $li[$value['payAccount_id']]['unemployment'] = $arr[$value['payAccount_id']]['unemployment'] + $arr[$value['payAccount_id']]['unemploymentTwo'];
                    $li[$value['payAccount_id']]['fund'] = $arr[$value['payAccount_id']]['fund'] + $arr[$value['payAccount_id']]['fundTwo'];
                    $li[$value['payAccount_id']]['hurted'] += $value['hurtedCompanyMoney'];
                    $li[$value['payAccount_id']]['birthed'] += $value['birthedCompanyMoney'];
                    $li[$value['payAccount_id']]['medicalTwo'] = 0;
                    $li[$value['payAccount_id']]['pensionTwo'] = 0;
                    $li[$value['payAccount_id']]['unemploymentTwo'] = 0;
                    $li[$value['payAccount_id']]['fundTwo'] = 0;

                }
                if ($value["type"] == '2') {
                    $li[$value['payAccount_id']]['medical'] += $value['medicalSelfMoney'];
                    $li[$value['payAccount_id']]['pension'] += $value['pensionSelfMoney'];
                    $li[$value['payAccount_id']]['unemployment'] += $value['unemploymentSelfMoney'];
                    $li[$value['payAccount_id']]['fund'] += $value['foudSelfMoney'];
                    $li[$value['payAccount_id']]['medicalTwo'] += $value['medicalCompanyMoney'];
                    $li[$value['payAccount_id']]['pensionTwo'] += $value['pensionCompanyMoney'];
                    $li[$value['payAccount_id']]['unemploymentTwo'] += $value['unemploymentCompanyMoney'];
                    $li[$value['payAccount_id']]['hurted'] += $value['hurtedCompanyMoney'];
                    $li[$value['payAccount_id']]['birthed'] += $value['birthedCompanyMoney'];
                    $li[$value['payAccount_id']]['fundTwo'] += $value['foudCompanyMoney'];
                }
            }
        }
        //算出来每一项的和
        foreach ($item as $k1 => $v1) {
            foreach ($v1 as $k2 => $v2) {
                if ($k2 != 'payAccount') {
                    $item[$k1][$k2] += $li[$k1][$k2];
                }
            }
        }
        foreach ($item as $ki => $vi) {
            if ($ki != 'payAccount_id') {
                $con[$ki]['payAccount'] = $vi["payAccount"];
            }
            //个人社保总和
            $con[$ki]["medicalSelfCount"] = $vi["medical"] + $vi["pension"] + $vi["unemployment"];
            //公司社保总和
            $con[$ki]["medicalCompanyCount"] = $vi["medicalTwo"] + $vi["pensionTwo"] + $vi["unemploymentTwo"] + $vi["hurted"] + $vi["birthed"];
            //个人和公司社保总和
            $con[$ki]["medicalCount"] = $con[$ki]["medicalSelfCount"] + $con[$ki]["medicalCompanyCount"];

            //个人公积金
            $con[$ki]["fundSelfCount"] = $vi["fund"];
            //公司公积金
            $con[$ki]["fundTwoCount"] = $vi["fundTwo"];
            //公积金总和
            $con[$ki]["fundCount"] = $con[$ki]["fundSelfCount"] + $con[$ki]["fundTwoCount"];
            //个人社保和个人公积金
            $con[$ki]["selfMedicalAndFundCount"] = $con[$ki]["medicalSelfCount"] + $con[$ki]["fundCount"];
            //公司社保和公司公积金
            $con[$ki]["companyMedicalAndFundCount"] = $con[$ki]["medicalCompanyCount"] + $con[$ki]["fundTwoCount"];
            //社保和公积金总和
            $con[$ki]["medicalAndFundCount"] = $con[$ki]["selfMedicalAndFundCount"] + $con[$ki]["companyMedicalAndFundCount"];
        }

        $item = array_values($item);
        $con = array_values($con);
        $result = array(
            'page' => $page,
            'pageNum' => $pageNum,
            'item' => $item,
            'con' => $con
        );

        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);


    }

    //4.8个人社保明细表
    public function selfSocialdetail()
    {
        if (I("department_id")) {
            $map['department_id'] = I('department_id');
            $cond['department_id'] = I('department_id');
        }
        if (I("payAccount_id")) {
            $map['payAccount_id'] = I('payAccount_id');
            $cond['payAccount_id'] = I('payAccount_id');
        }

        if (I("name")) {
            $map['name'] = array('like', '%' . I('name') . '%');
            $cond['name'] = array('like', '%' . I('name') . '%');
        }

        $starTime = strtotime(I("starTime"));

        $endTime = strtotime(I("endTime"));

        if ($starTime != '' && $endTime != '') {
            $map['time'] = array('between', "$starTime,$endTime");
        }

        $pages = I("pages");
        $socialParameterInformation = D("SocialParameterInformation");
        $count = $socialParameterInformation->field('id,bid,unumber,name,department,payLand,householdType,payAccount,medicalPayBase,medicalRatio,
            medicalFixedFee,medicalSelfMoney,medicalRatioTwo,medicalCompanyMoney,medicalCount,pensionPayBase,pensionRatio,pensionSelfMoney,
            pensionRatioTwo,pensionCompanyMoney,pensionCount,unemploymentPayBase,unemploymentRatio,unemploymentSelfMoney,unemploymentRatioTwo,
            unemploymentCompanyMoney,unemploymentCount,hurtedPayBase,hurtedRatioTwo,hurtedCompanyMoney,birthedPayBase,birthedRatioTwo,birthedCompanyMoney,
            socialSelfCount,socialCompanyCount,socialCount,foudBase,foudRatio,foudSelfMoney,foudRatioTwo,foudCompanyMoney,foudCount,selfSocialAndFoudCount,
            companySocialAndFoudCount,selfAndCompanyAllCount,time,department_id')->where($map)->count();
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

        //社保台账
        $list = $socialParameterInformation->field('id,bid,unumber,name,department,payLand,householdType,payAccount,medicalPayBase,medicalRatio,
            medicalFixedFee,medicalSelfMoney,medicalRatioTwo,medicalCompanyMoney,medicalCount,pensionPayBase,pensionRatio,pensionSelfMoney,
            pensionRatioTwo,pensionCompanyMoney,pensionCount,unemploymentPayBase,unemploymentRatio,unemploymentSelfMoney,unemploymentRatioTwo,
            unemploymentCompanyMoney,unemploymentCount,hurtedPayBase,hurtedRatioTwo,hurtedCompanyMoney,birthedPayBase,birthedRatioTwo,birthedCompanyMoney,
            socialSelfCount,socialCompanyCount,socialCount,foudBase,foudRatio,foudSelfMoney,foudRatioTwo,foudCompanyMoney,foudCount,selfSocialAndFoudCount,
            companySocialAndFoudCount,selfAndCompanyAllCount,time,department_id')->where($map)->limit($offset, $pages)->select();
//        echo $socialParameterInformation->getLastsql();

        //补缴信息
        $socialPaymentInformation = D("SocialPaymentInformation");
        $condition = $socialPaymentInformation->field('id,bid,unumber,name,department,cardNum,payLand,householdType,payAccount,type,
                paymentStarTime,paymentEndTime,paymentNum,medicalPayBase,medicalRatio,medicalFixedFee,medicalSelfMoney,medicalRatioTwo,
                medicalCompanyMoney,medicalCount,is_medical,pensionPayBase,pensionRatio,pensionSelfMoney,pensionRatioTwo,pensionCompanyMoney,
                pensionCount,is_pension,unemploymentPayBase,unemploymentRatio,unemploymentSelfMoney,unemploymentRatioTwo,unemploymentCompanyMoney,
                unemploymentCount,is_unemployment,hurtedPayBase,hurtedRatioTwo,hurtedCompanyMoney,is_hurted,birthedPayBase,birthedRatioTwo,
                birthedCompanyMoney,is_birthed,socialSelfCount,socialCompanyCount,socialCount,foudBase,foudRatio,foudSelfMoney,foudRatioTwo,
                foudCompanyMoney,foudCount,is_foud,selfSocialAndFoudCount,companySocialAndFoudCount,selfAndCompanyAllCount,paymentTime,department_id,payAccount_id')
            ->where($cond)->select();
//        echo $socialPaymentInformation->getLastsql();
        foreach ($list as $k => $v) {
            if (!isset($v['department_id'])) {
                $arr[$v['department_id']] = $v;
            } else {
                foreach ($condition as $key => $value) {
                    if ($value['bid'] == $v['bid'] && $value['paymentTime'] == $v["time"]) {
                        if ($value["type"] == '1') {
                            $arr[$v['bid']]['bid'] = $v['bid'];
                            $arr[$v['bid']]['department'] = $v['department'];
                            $arr[$v['bid']]['name'] = $value['name'];
                            $arr[$v['bid']]['time'] = date("Y-m", $v['time']);
                            $arr[$v['bid']]['unumber'] = $v['unumber'];
                            $arr[$v['bid']]['payLand'] = $v['payLand'];
                            $arr[$v['bid']]['householdType'] = $v['householdType'];
                            $arr[$v['bid']]['payAccount'] = $v['payAccount'];
                            $arr[$v['bid']]['medicalPayBase'] = $v['medicalPayBase'];
                            $arr[$v['bid']]['foudBase'] = $v['foudBase'];

                            //个人
                            $arr[$v['bid']]['medical'] = $v['medicalSelfMoney'] + $value['medicalSelfMoney'] + $value['medicalCompanyMoney'];
                            $arr[$v['bid']]['pension'] = $v['pensionSelfMoney'] + $value['pensionSelfMoney'] + $value['pensionCompanyMoney'];
                            $arr[$v['bid']]['unemployment'] = $v['unemploymentSelfMoney'] + $value['unemploymentSelfMoney'] + $value['unemploymentCompanyMoney'];
                            $arr[$v['bid']]['fund'] = $v['foudSelfMoney'] + $value['foudSelfMoney'] + $value['foudCompanyMoney'];
                            $arr[$v['bid']]['selfHurted'] = $value['hurtedCompanyMoney'];
                            $arr[$v['bid']]['selfBirthed'] = $value['birthedCompanyMoney'];
                            //公司
                            $arr[$v['bid']]['medicalTwo'] = $v['medicalCompanyMoney'];
                            $arr[$v['bid']]['pensionTwo'] = $v['pensionCompanyMoney'];
                            $arr[$v['bid']]['unemploymentTwo'] = $v['unemploymentCompanyMoney'];
                            $arr[$v['bid']]['hurtedTwo'] = $v['hurtedCompanyMoney'];
                            $arr[$v['bid']]['birthedTwo'] = $v['birthedCompanyMoney'];
                            $arr[$v['bid']]['fundTwo'] = $v['foudCompanyMoney'];
                        }
                        if ($value["type"] == '2') {
                            $arr[$v['bid']]['bid'] = $v['bid'];
                            $arr[$v['bid']]['department'] = $v['department'];
                            $arr[$v['bid']]['name'] = $value['name'];
                            $arr[$v['bid']]['time'] = date("Y-m", $v['time']);
                            $arr[$v['bid']]['unumber'] = $v['unumber'];
                            $arr[$v['bid']]['payLand'] = $v['payLand'];
                            $arr[$v['bid']]['householdType'] = $v['householdType'];
                            $arr[$v['bid']]['payAccount'] = $v['payAccount'];
                            $arr[$v['bid']]['medicalPayBase'] = $v['medicalPayBase'];
                            $arr[$v['bid']]['foudBase'] = $v['foudBase'];

                            $arr[$v['bid']]['medical'] = $v['medicalSelfMoney'] + $value['medicalSelfMoney'];
                            $arr[$v['bid']]['pension'] = $v['pensionSelfMoney'] + $value['pensionSelfMoney'];
                            $arr[$v['bid']]['unemployment'] = $v['unemploymentSelfMoney'] + $value['unemploymentSelfMoney'];
                            $arr[$v['bid']]['fund'] = $v['foudSelfMoney'] + $value['foudSelfMoney'];
                            $arr[$v['bid']]['selfHurted'] = 0;
                            $arr[$v['bid']]['selfBirthed'] = 0;
                            //公司
                            $arr[$v['bid']]['medicalTwo'] = $v['medicalCompanyMoney'] + $value['medicalCompanyMoney'];
                            $arr[$v['bid']]['pensionTwo'] = $v['pensionCompanyMoney'] + $value['pensionCompanyMoney'];
                            $arr[$v['bid']]['unemploymentTwo'] = $v['unemploymentCompanyMoney'] + $value['unemploymentCompanyMoney'];
                            $arr[$v['bid']]['hurtedTwo'] = $v['hurtedCompanyMoney'] + $value['hurtedCompanyMoney'];
                            $arr[$v['bid']]['birthedTwo'] = $v['birthedCompanyMoney'] + $value['birthedCompanyMoney'];
                            $arr[$v['bid']]['fundTwo'] = $v['foudCompanyMoney'] + $value['foudCompanyMoney'];
                        }
                    }else{
                        $arr[$v['bid']]['bid'] = $v['bid'];
                        $arr[$v['bid']]['department'] = $v['department'];
                        $arr[$v['bid']]['name'] = $v['name'];
                        $arr[$v['bid']]['time'] = date("Y-m", $v['time']);
                        $arr[$v['bid']]['unumber'] = $v['unumber'];
                        $arr[$v['bid']]['payLand'] = $v['payLand'];
                        $arr[$v['bid']]['householdType'] = $v['householdType'];
                        $arr[$v['bid']]['payAccount'] = $v['payAccount'];
                        $arr[$v['bid']]['medicalPayBase'] = $v['medicalPayBase'];
                        $arr[$v['bid']]['foudBase'] = $v['foudBase'];

                        //个人
                        $arr[$v['bid']]['medical'] = $v['medicalSelfMoney'];
                        $arr[$v['bid']]['pension'] = $v['pensionSelfMoney'];
                        $arr[$v['bid']]['unemployment'] = $v['unemploymentSelfMoney'];
                        $arr[$v['bid']]['fund'] = $v['foudSelfMoney'];
                        $arr[$v['bid']]['selfHurted'] = $v['hurtedCompanyMoney'];
                        $arr[$v['bid']]['selfBirthed'] = $v['birthedCompanyMoney'];
                        //公司
                        $arr[$v['bid']]['medicalTwo'] = $v['medicalCompanyMoney'];
                        $arr[$v['bid']]['pensionTwo'] = $v['pensionCompanyMoney'];
                        $arr[$v['bid']]['unemploymentTwo'] = $v['unemploymentCompanyMoney'];
                        $arr[$v['bid']]['hurtedTwo'] = $v['hurtedCompanyMoney'];
                        $arr[$v['bid']]['birthedTwo'] = $v['birthedCompanyMoney'];
                        $arr[$v['bid']]['fundTwo'] = $v['foudCompanyMoney'];
                    }
                }
            }
        }

        //个人
        foreach ($arr as $ki => $vi) {
            if ($ki != 'department') {
                $con[$ki]['bid'] = $vi["bid"];
                $con[$ki]['department'] = $vi["department"];
            }
            if ($ki != 'payAccount') {
                $con[$ki]['bid'] = $vi["bid"];
                $con[$ki]['payAccount'] = $vi["payAccount"];
            }
            //个人社保总和
            $con[$ki]["medicalSelfCount"] = $vi["medical"] + $vi["pension"] + $vi["unemployment"] + $vi["selfHurted"] + $vi["selfBirthed"];
            //公司社保总和
            $con[$ki]["medicalCompanyCount"] = $vi["medicalTwo"] + $vi["pensionTwo"] + $vi["unemploymentTwo"] + $vi["hurtedTwo"] + $vi["birthedTwo"];
            //个人和公司社保总和
            $con[$ki]["medicalCount"] = $con[$ki]["medicalSelfCount"] + $con[$ki]["medicalCompanyCount"];
            //个人公积金
            $con[$ki]["fundSelfCount"] = $vi["fund"];
            //公司公积金
            $con[$ki]["fundCompanyCount"] = $vi["fundTwo"];
            //公积金总和
            $con[$ki]["fundCount"] = $con[$ki]["fundSelfCount"] + $con[$ki]["fundCompanyCount"];
            //个人社保和公积金总和
            $con[$ki]["selfMedicalAndFundCount"] = $con[$ki]["medicalSelfCount"] + $con[$ki]["fundSelfCount"];
            //公司社保和公积金总和
            $con[$ki]["companyMedicalAndFundCount"] = $con[$ki]["medicalCompanyCount"] + $con[$ki]["fundCompanyCount"];
            //总计
            $con[$ki]["allCount"] = $con[$ki]["selfMedicalAndFundCount"] + $con[$ki]["companyMedicalAndFundCount"];
        }

        $item = array_values($arr);
        $con = array_values($con);
        $result = array(
            'page' => $page,
            'pageNum' => $pageNum,
            'item' => $item,
            'con' => $con
        );
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);

    }

    //4.5社保补缴
    public function socialPayment()
    {
        //工号
        if (I("unumber")) {
            $map['unumber'] = array('like', '%' . I('unumber') . '%');
        }
        //姓名
        if (I("name")) {
            $map['name'] = array('like', '%' . I('name') . '%');
        }
        //部门
        if (I("department_id")) {
            $map['department_id'] = array('like', '%' . I('department_id') . '%');
        }
        //缴纳账户
        if (I("payAccount")) {
            $map['payAccount'] = array('like', '%' . I('payAccount') . '%');
        }
        //社保缴纳地
        if (I("payLand")) {
            $map['payLand'] = array('like', '%' . I('payLand') . '%');
        }
        //户口类型
        if (I("householdType")) {
            $map['householdType'] = array('like', '%' . I('householdType') . '%');
        }

        $map['status'] = array('neq', '2');
        $pages = I("pages");
        $socialArchives = D("SocialArchives");
        $count = $socialArchives->field("id,bid,name,unumber,cardNum,department,payLand,householdType,
                payBase,socialStarTime,socialEndTime,fundBase,fundStarTime,fundEndTime,payAccount,status,department_id")->where($map)->count();
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
        $list = $socialArchives->field("id,bid,name,unumber,cardNum,department,payLand,householdType,
                payBase,socialStarTime,socialEndTime,fundBase,fundStarTime,fundEndTime,payAccount,status,department_id")->where($map)->limit($offset, $pages)->select();
        $result = array(
            'page' => $page,
            'pageNum' => $pageNum,
            'result' => $list
        );
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);

    }

    //4.5增加社保补缴信息
    public function addSocialPayment()
    {
        //得到被补缴社保人的id
        $id = I("post.bid");
        $data["type"] = I("post.type");
        $data["is_medical"] = I("post.is_medical");
        $data["is_pension"] = I("post.is_pension");
        $data["is_unemployment"] = I("post.is_unemployment");
        $data["is_hurted"] = I("post.is_hurted");
        $data["is_birthed"] = I("post.is_birthed");
        $data["is_foud"] = I("post.is_foud");
        $data["is_largeMedical"] = I("post.is_largeMedical");
        $data["paymentStarTime"] = strtotime(I("post.paymentStarTime"));
        $data["paymentEndTime"] = strtotime(I("post.paymentEndTime"));
        //实际补缴月份
        $data["paymentTime"] = strtotime(I("post.paymentTime"));
        $socialArchives = D("SocialArchives");
        $condition = $socialArchives->field("id,bid,unumber,name,cardNum,department,householdType,payLand,payBase,fundBase,payAccount,payAccount_id,department_id")
            ->where("bid=" . $id)->find();
        $data["medicalPayBase"] = $condition["payBase"];
        $data["pensionPayBase"] = $condition["payBase"];
        $data["unemploymentPayBase"] = $condition["payBase"];
        $data["hurtedPayBase"] = $condition["payBase"];
        $data["birthedPayBase"] = $condition["payBase"];
        $data["foudBase"] = $condition["fundBase"];
        $data["bid"] = $condition["bid"];
        $data["unumber"] = $condition["unumber"];
        $data["name"] = $condition["name"];
        $data["householdType"] = $condition["householdType"];
        $data["payLand"] = $condition["payLand"];
        $data["payBase"] = $condition["payBase"];
        $data["payAccount"] = $condition["payAccount"];
        $data["department"] = $condition["department"];
        $data["cardNum"] = $condition["cardNum"];
        $data["department_id"] = $condition["department_id"];
        $socialSecurityInformation = D("SocialSecurityInformation");
        $socialResult = $socialSecurityInformation->field('id,bid,payAccount')->where("bid=" . $data["bid"])->find();
        $data["payAccount_id"] = $socialResult["payAccount"];
        //给谁补缴社保，提供这个人的社保缴纳地和户口类型，来匹配相应的方案
        $payLand = $condition["payLand"];
        $householdType = $condition["householdType"];
        $socialSecurityPlan = D("SocialSecurityPlan");
        $list = $socialSecurityPlan->field("id,city,householdType,medicalBase,medicalRatio,pensionBase,pensionRatio,hurtedBase,
                    hurtedRatio,unemploymentBase,unemploymentRatio,birthedBase,birthedRatio,medicalRatioTwo,pensionRatioTwo,
                    hurtedRatioTwo,unemploymentRatioTwo,birthedRatioTwo,foudBase,foudRatio,foudRatioTwo,largeMedicalBase,largeMedicalRatio,
                    largeMedicalRatioTwo,effectiveDate,expiryDate,is_use,highestfoud,pensionHighestBase,hurtedHighestBase,unemploymentHighestBase,
                    birthedHighestBase,medicalHighestBase,largeMedicalHighestBase,medicalFixedFee,medicalFixedFeeTwo,pensionFixedFee,pensionFixedFeeTwo,
                    hurtedFixedFee,hurtedFixedFeeTwo,unemploymentFixedFee,unemploymentFixedFeeTwo,birthedFixedFee,birthedFixedFeeTwo,foudBaseFixedFee,
                    foudBaseFixedFeeTwo,largeMedicalFixedFee,largeMedicalFixedFeeTwo")
            ->where("city='{$payLand}' and householdType='{$householdType}' and expiryDate is null")->find();

        $data["medicalFixedFee"] = $list["medicalFixedFee"];
        $data["medicalRatio"] = $list["medicalRatio"];
        $data["medicalRatioTwo"] = $list["medicalRatioTwo"] + $list["largeMedicalRatioTwo"];
        $data["pensionRatio"] = $list["pensionRatio"];
        $data["pensionRatioTwo"] = $list["pensionRatioTwo"];
        $data["unemploymentRatio"] = $list["unemploymentRatio"];
        $data["unemploymentRatioTwo"] = $list["unemploymentRatioTwo"];

        $data["hurtedRatioTwo"] = $list["hurtedRatioTwo"];
        $data["birthedRatioTwo"] = $list["birthedRatioTwo"];
        $data["foudRatio"] = $list["foudRatio"];
        $data["foudRatioTwo"] = $list["foudRatioTwo"];

        if ($data["is_medical"] == '2') {
            $data["medical"] = 0;
            $data["medicalTwo"] = 0;
            $data["medicalSelfMoney"] = 0;
            $data["medicalCompanyMoney"] = 0;
            $data["medicalCount"] = 0;
        }
        if ($data["is_medical"] == '1' && $data["is_largeMedical"] == '1') {
            //医疗基数和社保基数对比，谁大用谁
            if ($list["medicalBase"] > $data['payBase']) {
                //用大的值乘以比例数
                $data["medical"] = round((($list["medicalBase"] * $list["medicalRatio"] + $list["medicalBase"] * $list["largeMedicalRatio"]) / 100) + $list["medicalFixedFee"] + $list["largeMedicalFixedFee"], 2);//个人
                $data["medicalTwo"] = round((($list["medicalBase"] * $list["medicalRatioTwo"] + $list["medicalBase"] * $list["largeMedicalRatioTwo"]) / 100) + $list["medicalFixedFeeTwo"] + $list["largeMedicalFixedFeeTwo"], 2);//公司
                $data["is_use"] = "1";

                //把使用的基数存到数据库里
                $data["medicalSelfMoney"] = $data["medical"];
                $data["medicalCompanyMoney"] = $data["medicalTwo"];
                $data["medicalCount"] = $data["medicalSelfMoney"] + $data["medicalCompanyMoney"];
            } else {
                if ($data['payBase'] < $list["medicalHighestBase"]) {
                    $data["medical"] = round((($data['payBase'] * $list["medicalRatio"] + $data['payBase'] * $list["largeMedicalRatio"]) / 100) + $list["medicalFixedFee"] + $list["largeMedicalFixedFee"], 2);//个人
                    $data["medicalTwo"] = round((($data['payBase'] * $list["medicalRatioTwo"] + $data['payBase'] * $list["largeMedicalRatioTwo"]) / 100) + $list["medicalFixedFeeTwo"] + $list["largeMedicalFixedFeeTwo"], 2);//公司
                    $data["is_use"] = "1";
                    $data["medicalSelfMoney"] = $data["medical"];
                    $data["medicalCompanyMoney"] = $data["medicalTwo"];
                    $data["medicalCount"] = $data["medicalSelfMoney"] + $data["medicalCompanyMoney"];
                    $data["is_use"] = "1";
                } else {
                    $data["medical"] = round((($list['medicalHighestBase'] * $list["medicalRatio"] + $list['medicalHighestBase'] * $list["largeMedicalRatio"]) / 100) + $list["medicalFixedFee"] + $list["largeMedicalFixedFee"], 2);//个人
                    $data["medicalTwo"] = round((($list['medicalHighestBase'] * $list["medicalRatioTwo"] + $list['medicalHighestBase'] * $list["largeMedicalRatioTwo"]) / 100) + $list["medicalFixedFeeTwo"] + $list["largeMedicalFixedFeeTwo"], 2);//公司
                    $data["is_use"] = "1";
                    $data["medicalSelfMoney"] = $data["medical"];
                    $data["medicalCompanyMoney"] = $data["medicalTwo"];
                    $data["medicalCount"] = $data["medicalSelfMoney"] + $data["medicalCompanyMoney"];
                    $data["is_use"] = "1";
                }

            }
        }
        if ($data["is_medical"] == '1' && $data["is_largeMedical"] == '2') {
            //医疗基数和社保基数对比，谁大用谁
            if ($list["medicalBase"] > $data['payBase']) {
                //用大的值乘以比例数
                $data["medical"] = round((($list["medicalBase"] * $list["medicalRatio"]) / 100) + $list["medicalFixedFee"] + $list["largeMedicalFixedFee"], 2);//个人
                $data["medicalTwo"] = round((($list["medicalBase"] * $list["medicalRatioTwo"]) / 100) + $list["medicalFixedFeeTwo"] + $list["largeMedicalFixedFeeTwo"], 2);//公司
                $data["is_use"] = "1";

                //把使用的基数存到数据库里
                $data["medicalSelfMoney"] = $data["medical"];
                $data["medicalCompanyMoney"] = $data["medicalTwo"];
                $data["medicalCount"] = $data["medicalSelfMoney"] + $data["medicalCompanyMoney"];
            } else {
                if ($data['payBase'] < $list["medicalHighestBase"]) {
                    $data["medical"] = round((($data['payBase'] * $list["medicalRatio"]) / 100) + $list["medicalFixedFee"] + $list["largeMedicalFixedFee"], 2);//个人
                    $data["medicalTwo"] = round((($data['payBase'] * $list["medicalRatioTwo"]) / 100) + $list["medicalFixedFeeTwo"] + $list["largeMedicalFixedFeeTwo"], 2);//公司
                    $data["is_use"] = "1";
                    $data["medicalSelfMoney"] = $data["medical"];
                    $data["medicalCompanyMoney"] = $data["medicalTwo"];
                    $data["medicalCount"] = $data["medicalSelfMoney"] + $data["medicalCompanyMoney"];
                    $data["is_use"] = "1";
                } else {
                    $data["medical"] = round((($list['medicalHighestBase'] * $list["medicalRatio"]) / 100) + $list["medicalFixedFee"] + $list["largeMedicalFixedFee"], 2);//个人
                    $data["medicalTwo"] = round((($list['medicalHighestBase'] * $list["medicalRatioTwo"]) / 100) + $list["medicalFixedFeeTwo"] + $list["largeMedicalFixedFeeTwo"], 2);//公司
                    $data["is_use"] = "1";
                    $data["medicalSelfMoney"] = $data["medical"];
                    $data["medicalCompanyMoney"] = $data["medicalTwo"];
                    $data["medicalCount"] = $data["medicalSelfMoney"] + $data["medicalCompanyMoney"];
                    $data["is_use"] = "1";
                }

            }
        }
        if ($data["is_pension"] == '2') {
            $data["pension"] = 0;
            $data["pensionTwo"] = 0;
            $data["pensionSelfMoney"] = 0;
            $data["pensionCompanyMoney"] = 0;
            $data["pensionCount"] = 0;
        }
        if ($data["is_pension"] == '1') {
            //养老基数
            if ($list["pensionBase"] > $data['payBase']) {
                $data["pension"] = round(($list["pensionBase"] * $list["pensionRatio"] / 100) + $list["pensionFixedFee"], 2);
                $data["pensionTwo"] = round($list["pensionBase"] * $list["pensionRatioTwo"] / 100 + $list["pensionFixedFeeTwo"], 2);
                $data["pensionSelfMoney"] = $data["pension"];
                $data["pensionCompanyMoney"] = $data["pensionTwo"];
                $data["pensionCount"] = $data["pensionSelfMoney"] + $data["pensionCompanyMoney"];
            } else {
                if ($data["payBase"] < $list["pensionHighestBase"]) {
                    $data["pension"] = round($data["payBase"] * $list["pensionRatio"] / 100 + $list["pensionFixedFee"], 2);
                    $data["pensionTwo"] = round($data["payBase"] * $list["pensionRatioTwo"] / 100 + $list["pensionFixedFeeTwo"], 2);
                    $data["pensionSelfMoney"] = $data["pension"];
                    $data["pensionCompanyMoney"] = $data["pensionTwo"];
                    $data["pensionCount"] = $data["pensionSelfMoney"] + $data["pensionCompanyMoney"];
                } else {
                    $data["pension"] = round($list["pensionHighestBase"] * $list["pensionRatio"] / 100 + $list["pensionFixedFee"], 2);
                    $data["pensionTwo"] = round($list["pensionHighestBase"] * $list["pensionRatioTwo"] / 100 + $list["pensionFixedFeeTwo"], 2);
                    $data["pensionSelfMoney"] = $data["pension"];
                    $data["pensionCompanyMoney"] = $data["pensionTwo"];
                    $data["pensionCount"] = $data["pensionSelfMoney"] + $data["pensionCompanyMoney"];
                }

            }
        }
        if ($data["is_unemployment"] == '2') {
            $data["unemployment"] = 0;
            $data["unemploymentTwo"] = 0;
            $data["unemploymentSelfMoney"] = 0;
            $data["unemploymentCompanyMoney"] = 0;
            $data["unemploymentCount"] = 0;
        }
        if ($data["is_unemployment"] == '1') {
            //失业基数
            if ($list["unemploymentBase"] > $data["payBase"]) {
                $data["unemployment"] = round($list["unemploymentBase"] * $list["unemploymentRatio"] / 100 + $list["unemploymentFixedFee"], 2);
                $data["unemploymentTwo"] = round($list["unemploymentBase"] * $list["unemploymentRatioTwo"] / 100 + $list["unemploymentFixedFeeTwo"], 2);
                $data["unemploymentSelfMoney"] = $data["unemployment"];
                $data["unemploymentCompanyMoney"] = $data["unemploymentTwo"];
                $data["unemploymentCount"] = $data["unemploymentSelfMoney"] + $data["unemploymentCompanyMoney"];
            } else {
                if ($data["payBase"] < $list["unemploymentHighestBase"]) {
                    $data["unemployment"] = round($data["payBase"] * $list["unemploymentRatio"] / 100 + $list["unemploymentFixedFee"], 2);
                    $data["unemploymentTwo"] = round($data["payBase"] * $list["unemploymentRatioTwo"] / 100 + $list["unemploymentFixedFeeTwo"], 2);
                    $data["unemploymentSelfMoney"] = $data["unemployment"];
                    $data["unemploymentCompanyMoney"] = $data["unemploymentTwo"];
                    $data["unemploymentCount"] = $data["unemploymentSelfMoney"] + $data["unemploymentCompanyMoney"];
                } else {
                    $data["unemployment"] = round($list["unemploymentHighestBase"] * $list["unemploymentRatio"] / 100 + $list["unemploymentFixedFee"], 2);
                    $data["unemploymentTwo"] = round($list["unemploymentHighestBase"] * $list["unemploymentRatioTwo"] / 100 + $list["unemploymentFixedFeeTwo"], 2);
                    $data["unemploymentSelfMoney"] = $data["unemployment"];
                    $data["unemploymentCompanyMoney"] = $data["unemploymentTwo"];
                    $data["unemploymentCount"] = $data["unemploymentSelfMoney"] + $data["unemploymentCompanyMoney"];
                }

            }
        }


        if ($data["is_hurted"] == '2') {
            $data["hurted"] = 0;
            $data["hurtedTwo"] = 0;
            $data["useHurted"] = 0;
            $data["hurtedCompanyMoney"] = 0;
        }
        if ($data["is_hurted"] == '1') {
            //工伤
            if ($list["hurtedBase"] > $data["payBase"]) {
                $data["hurted"] = round($list["hurtedBase"] * $list["hurtedRatio"] / 100 + $list["hurtedFixedFee"], 2);
                $data["hurtedTwo"] = round($list["hurtedBase"] * $list["hurtedRatioTwo"] / 100 + $list["hurtedFixedFeeTwo"], 2);
                $data["useHurted"] = $data["hurted"];
                $data["hurtedCompanyMoney"] = $data["hurtedTwo"];
            } else {
                if ($data["payBase"] < $list["hurtedHighestBase"]) {
                    $data["hurted"] = round($data["payBase"] * $list["hurtedRatio"] / 100 + $list["hurtedFixedFee"], 2);
                    $data["hurtedTwo"] = round($data["payBase"] * $list["hurtedRatioTwo"] / 100 + $list["hurtedFixedFeeTwo"], 2);
                    $data["useHurted"] = $data["hurted"];
                    $data["hurtedCompanyMoney"] = $data["hurtedTwo"];
                } else {
                    $data["hurted"] = round($list["hurtedHighestBase"] * $list["hurtedRatio"] / 100 + $list["hurtedFixedFee"], 2);
                    $data["hurtedTwo"] = round($list["hurtedHighestBase"] * $list["hurtedRatioTwo"] / 100 + $list["hurtedFixedFeeTwo"], 2);
                    $data["useHurted"] = $data["hurted"];
                    $data["hurtedCompanyMoney"] = $data["hurtedTwo"];
                }

            }
        }
        if ($data["is_birthed"] == '2') {
            $data["birthed"] = 0;
            $data["birthedTwo"] = 0;
            $data["useBirthed"] = 0;
            $data["birthedCompanyMoney"] = 0;
        }
        if ($data["is_birthed"] == '1') {
            //生育
            if ($list["birthedBase"] > $data["payBase"]) {
                $data["birthed"] = round($list["birthedBase"] * $list["birthedRatio"] / 100 + $list["birthedFixedFee"], 2);
                $data["birthedTwo"] = round($list["birthedBase"] * $list["birthedRatioTwo"] / 100 + $list["birthedFixedFeeTwo"], 2);
                $data["useBirthed"] = $data["birthed"];
                $data["birthedCompanyMoney"] = $data["birthedTwo"];
            } else {
                if ($data["payBase"] < $list["birthedHighestBase"]) {
                    $data["birthed"] = round($data["payBase"] * $list["birthedRatio"] / 100 + $list["birthedFixedFee"], 2);
                    $data["birthedTwo"] = round($data["payBase"] * $list["birthedRatioTwo"] / 100 + $list["birthedFixedFeeTwo"], 2);
                    $data["useBirthed"] = $data["birthed"];
                    $data["birthedCompanyMoney"] = $data["birthedTwo"];
                } else {
                    $data["birthed"] = round($list["birthedHighestBase"] * $list["birthedRatio"] / 100 + $list["birthedFixedFee"], 2);
                    $data["birthedTwo"] = round($list["birthedHighestBase"] * $list["birthedRatioTwo"] / 100 + $list["birthedFixedFeeTwo"], 2);
                    $data["useBirthed"] = $data["birthed"];
                    $data["birthedCompanyMoney"] = $data["birthedTwo"];
                }

            }
        }
        if ($data["is_foud"] == '2') {
            $data["fund"] = 0;
            $data["fundTwo"] = 0;
            $data["foudSelfMoney"] = 0;
            $data["foudCompanyMoney"] = 0;
            $data["foudCount"] = 0;
        }
        if ($data["is_foud"] == '1') {
            //公积金基数
            if ($list["foudBase"] > $data["foudBase"]) {
                $data["fund"] = round($list["foudBase"] * $list["foudRatio"] / 100 + $list["foudBaseFixedFee"], 2);
                $data["fundTwo"] = round($list["foudBase"] * $list["foudRatioTwo"] / 100 + $list["foudBaseFixedFeeTwo"], 2);
                $data["foudSelfMoney"] = $data["fund"];
                $data["foudCompanyMoney"] = $data["fundTwo"];
                $data["foudCount"] = $data["foudSelfMoney"] + $data["foudCompanyMoney"];
            } else {
                if ($data["foudBase"] < $list["highestfoud"]) {
                    $data["fund"] = round($data["foudBase"] * $list["foudRatio"] / 100 + $list["foudBaseFixedFee"], 2);
                    $data["fundTwo"] = round($data["foudBase"] * $list["foudRatioTwo"] / 100 + $list["foudBaseFixedFeeTwo"], 2);
                    $data["foudSelfMoney"] = $data["fund"];
                    $data["foudCompanyMoney"] = $data["fundTwo"];
                    $data["foudCount"] = $data["foudSelfMoney"] + $data["foudCompanyMoney"];
                } else {
                    $data["fund"] = round($list["highestfoud"] * $list["foudRatio"] / 100 + $list["foudBaseFixedFee"], 2);
                    $data["fundTwo"] = round($list["highestfoud"] * $list["foudRatioTwo"] / 100 + $list["foudBaseFixedFeeTwo"], 2);
                    $data["foudSelfMoney"] = $data["fund"];
                    $data["foudCompanyMoney"] = $data["fundTwo"];
                    $data["foudCount"] = $data["foudSelfMoney"] + $data["foudCompanyMoney"];
                }

            }
        }
        $data["socialSelfCount"] = $data["medicalSelfMoney"] + $data["pensionSelfMoney"] + $data["unemploymentSelfMoney"];
        $data["socialCompanyCount"] = $data["medicalCompanyMoney"] + $data["pensionCompanyMoney"] + $data["unemploymentCompanyMoney"] +
            $data["hurtedCompanyMoney"] + $data["birthedCompanyMoney"];
        $data["socialCount"] = $data["socialSelfCount"] + $data["socialCompanyCount"];
        $data["selfSocialAndFoudCount"] = $data["socialSelfCount"] + $data["foudSelfMoney"];
        $data["companySocialAndFoudCount"] = $data["socialCompanyCount"] + $data["foudCompanyMoney"];
        $data["selfAndCompanyAllCount"] = $data["selfSocialAndFoudCount"] + $data["companySocialAndFoudCount"];
        $socialPaymentInformation = D("SocialPaymentInformation");
        $datas = $socialPaymentInformation->create($data);
        if ($datas) {
            $result = $socialPaymentInformation->add($datas);
            $arr["spid"] = $result;
            $socialSecurityInformation = D("SocialSecurityInformation");
            $arrs = $socialSecurityInformation->create($arr);
            $socialSecurityInformation->where("bid=" . $data["bid"])->save($arrs);
        }
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //4.5社保补缴统计
    public function socialPaymentStatistical()
    {
        //实际补缴时间
        if (I("times")) {
            $map['paymentTime'] = strtotime(I("times"));
        }

        //工号
        if (I("unumber")) {
            $map['unumber'] = array('like', '%' . I('unumber') . '%');
        }
        //姓名
        if (I("name")) {
            $map['name'] = array('like', '%' . I('name') . '%');
        }

        //部门
        if (I("department")) {
            $map['department'] = I("department");
        }
        //社保缴纳地
        if (I("payLand")) {
            $map['payLand'] = I("payLand");
        }
        //户口性质
        if (I("householdType")) {
            $map['householdType'] = I("householdType");
        }
        //缴纳账户
        if (I("payAccount_id")) {
            $map['payAccount_id'] = I("payAccount_id");
        }
        //补缴形式
        if (I("payment_type")) {
            $map['type'] = I("payment_type");
        }


        $pages = I("pages");
        $socialPaymentInformation = D("SocialPaymentInformation");
        $count = $socialPaymentInformation->field("id,bid,unumber,name,department,cardNum,payLand,householdType,payAccount,type,
        paymentStarTime,paymentEndTime,paymentNum,medicalPayBase,medicalRatio,medicalFixedFee,medicalSelfMoney,medicalRatioTwo,
        medicalCompanyMoney,medicalCount,is_medical,pensionPayBase,pensionRatio,pensionSelfMoney,pensionRatioTwo,pensionCompanyMoney,
        pensionCount,is_pension,unemploymentPayBase,unemploymentRatio,unemploymentSelfMoney,unemploymentRatioTwo,unemploymentCompanyMoney,
        unemploymentCount,is_unemployment,hurtedPayBase,hurtedRatioTwo,hurtedCompanyMoney,is_hurted,birthedPayBase,birthedRatioTwo,
        birthedCompanyMoney,is_birthed,socialSelfCount,socialCompanyCount,socialCount,foudBase,foudRatio,foudSelfMoney,foudRatioTwo,payAccount_id,
        foudCompanyMoney,foudCount,is_foud,selfSocialAndFoudCount,companySocialAndFoudCount,selfAndCompanyAllCount,paymentTime,department_id")
            ->where($map)->count();

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
        $list = $socialPaymentInformation->field("id,bid,unumber,name,department,cardNum,payLand,householdType,payAccount,type,
        paymentStarTime,paymentEndTime,paymentNum,medicalPayBase,medicalRatio,medicalFixedFee,medicalSelfMoney,medicalRatioTwo,
        medicalCompanyMoney,medicalCount,is_medical,pensionPayBase,pensionRatio,pensionSelfMoney,pensionRatioTwo,pensionCompanyMoney,
        pensionCount,is_pension,unemploymentPayBase,unemploymentRatio,unemploymentSelfMoney,unemploymentRatioTwo,unemploymentCompanyMoney,
        unemploymentCount,is_unemployment,hurtedPayBase,hurtedRatioTwo,hurtedCompanyMoney,is_hurted,birthedPayBase,birthedRatioTwo,
        birthedCompanyMoney,is_birthed,socialSelfCount,socialCompanyCount,socialCount,foudBase,foudRatio,foudSelfMoney,foudRatioTwo,payAccount_id,
        foudCompanyMoney,foudCount,is_foud,selfSocialAndFoudCount,companySocialAndFoudCount,selfAndCompanyAllCount,paymentTime,department_id")
            ->where($map)->limit($offset, $pages)->select();
        if ($list) {
            foreach ($list as &$val) {
                $val['type'] = $val['type'] == 1 ? '个人承担' : '公司承担';
            }
        }
        foreach ($list as $key => $value) {
            $star_time = explode('-', date("Y-m", $value["paymentStarTime"]));
            $end_time = explode('-', date("Y-m", $value["paymentEndTime"]));
            $list[$key]["months"] = abs($star_time[0] - $end_time[0]) * 12 + abs($star_time[1] - $end_time[1]) + 1;
        }
        //计算总共交多少个月
        foreach ($list as &$val) {
            $val['paymentStarTime'] = date('Y-m', $val['paymentStarTime']);
            $val['paymentEndTime'] = date('Y-m', $val['paymentEndTime']);
            $val['paymentTime'] = date('Y-m', $val['paymentTime']);
        }


        $result = array(
            'page' => $page,
            'pageNum' => $pageNum,
            'result' => $list
        );
        if ($result) {
            $error = 0;
        } else {
            $error = 1;
        }
        self::jsons($error, $result);
    }

    //4.5社保补缴excel导入数据
    public function uploadSocialPayment()
    {
        $upload = new \Think\Upload();
        $upload->maxSize = 3145728;
        $upload->exts = array();// 设置附件上传类型
        $upload->rootPath = './Public/Uploads/socialPayment/';
        $upload->saveName = time() . rand(10000, 99999);
        $info = $upload->upload();
        if (!$info) {
            $this->error($upload->getError());
        } else {
            $url = "./Public/Uploads/socialPayment/" . $info[0]['savepath'] . $info[0]['savename'];
        }
        if (!$url) {
            //文件不存在
            $error = 2;
        }
        $con["url"] = $url;
        $finename = $url;
        $type = pathinfo($finename);
        $type = strtolower($type["extension"]);
        $type = $type === 'csv' ? $type : 'Excel2007';
        Vendor('PHPExcel.PHPExcel');
        $objReader = \PHPExcel_IOFactory::createReader($type);
        $objPHPExcel = $objReader->load($finename);
        $sheet = $objPHPExcel->getSheet(0);
        // 取得总行数
        $highestRow = $sheet->getHighestRow();
        // 取得总列数
        $highestColumn = $sheet->getHighestColumn();
        $socialArchives = D("SocialArchives");
        for ($row = 3; $row <= $highestRow; $row++) {
            $rowData = $sheet->rangeToArray('A' . $row . ':' . $highestColumn . $row, NULL, TRUE, FALSE);
            $rowData[0][9] = strtotime(gmdate("Y-m-d H:i:s", \PHPExcel_Shared_Date::ExcelToPHP($row[0][9])));
            $rowData[0][10] = strtotime(gmdate("Y-m-d H:i:s", \PHPExcel_Shared_Date::ExcelToPHP($row[0][10])));
            $rowData[0][48] = strtotime(gmdate("Y-m-d H:i:s", \PHPExcel_Shared_Date::ExcelToPHP($row[0][48])));
            if ($rowData[0][8] == "个人补缴") {
                $rowData[0]['type'] = '1';
            }
            if ($rowData[0][8] == "公司补缴") {
                $rowData[0]['type'] = '2';
            }
            $parentId = $socialArchives->field("id,bid,name,unumber,department_id")->where("name=" . "'" . $rowData[0][2] . "'")->find();
            $rowData[0]['department_id'] = $parentId["department_id"];
            $rowData[0]['payAccount_id'] = $parentId["payAccount_id"];
            $cons["department_id"] = $rowData[0]["department_id"];
            $cons["payAccount_id"] = $rowData[0]["payAccount_id"];
            $rowData[0]['bid'] = $parentId["bid"];
            $con["bid"] = $rowData[0]['bid'];
            $cons["unumber"] = $rowData[0]['1'];
            $cons["name"] = $rowData[0]['2'];
            $cons["department"] = $rowData[0]["3"];
            $cons["cardNum"] = $rowData[0]["4"];
            $cons["payLand"] = $rowData[0]["5"];
            $cons["householdType"] = $rowData[0]["6"];
            $cons["payAccount"] = $rowData[0]["7"];
            $cons["type"] = $rowData[0]['type'];
            $cons["paymentStarTime"] = $rowData[0]["9"];
            $cons["paymentEndTime"] = $rowData[0]["10"];
            $cons["paymentNum"] = $rowData[0]["11"];
            $cons["medicalPayBase"] = $rowData[0]["12"];
            $cons["medicalRatio"] = $rowData[0]["13"];
            $cons["medicalFixedFee"] = $rowData[0]["14"];
            $cons["medicalSelfMoney"] = $rowData[0]["15"];
            $cons["medicalRatioTwo"] = $rowData[0]["16"];
            $cons["medicalCompanyMoney"] = $rowData[0]["17"];
            $cons["medicalCount"] = $rowData[0]["18"];
            $cons["pensionPayBase"] = $rowData[0]["19"];
            $cons["pensionRatio"] = $rowData[0]["20"];
            $cons["pensionSelfMoney"] = $rowData[0]["21"];
            $cons["pensionRatioTwo"] = $rowData[0]["22"];
            $cons["pensionCompanyMoney"] = $rowData[0]["23"];
            $cons["pensionCount"] = $rowData[0]["24"];
            $cons["unemploymentPayBase"] = $rowData[0]["20"];
            $cons["unemploymentRatio"] = $rowData[0]["25"];
            $cons["unemploymentSelfMoney"] = $rowData[0]["26"];
            $cons["unemploymentRatioTwo"] = $rowData[0]["27"];
            $cons["unemploymentCompanyMoney"] = $rowData[0]["28"];
            $cons["unemploymentCount"] = $rowData[0]["29"];
            $cons["hurtedPayBase"] = $rowData[0]["30"];
            $cons["hurtedRatioTwo"] = $rowData[0]["31"];
            $cons["hurtedCompanyMoney"] = $rowData[0]["32"];
            $cons["birthedPayBase"] = $rowData[0]["33"];
            $cons["birthedRatioTwo"] = $rowData[0]["34"];
            $cons["birthedCompanyMoney"] = $rowData[0]["35"];
            $cons["socialSelfCount"] = $rowData[0]["36"];
            $cons["socialCompanyCount"] = $rowData[0]["37"];
            $cons["socialCount"] = $rowData[0]["38"];
            $cons["foudBase"] = $rowData[0]["39"];
            $cons["foudRatio"] = $rowData[0]["40"];
            $cons["foudSelfMoney"] = $rowData[0]["41"];
            $cons["foudRatioTwo"] = $rowData[0]["42"];
            $cons["foudCompanyMoney"] = $rowData[0]["43"];
            $cons["foudCount"] = $rowData[0]["44"];
            $cons["selfSocialAndFoudCount"] = $rowData[0]["45"];
            $cons["companySocialAndFoudCount"] = $rowData[0]["46"];
            $cons["selfAndCompanyAllCount"] = $rowData[0]["47"];
            $cons["paymentTime"] = $rowData[0]["48"];
            if ($cons["medicalCompanyMoney"] == '0') {
                $cons["is_medical"] = '1';
                $cons["is_pension"] = '1';
                $cons["is_unemployment"] = '1';
                $cons["is_hurted"] = '1';
                $cons["is_birthed"] = '1';
                $cons["is_foud"] = '1';
            } else {
                $cons["is_medical"] = '2';
                $cons["is_pension"] = '2';
                $cons["is_unemployment"] = '2';
                $cons["is_hurted"] = '2';
                $cons["is_birthed"] = '2';
                $cons["is_foud"] = '2';
            }
            $socialPaymentInformation = D("SocialPaymentInformation");
            $datas = $socialPaymentInformation->create($cons);
            if ($datas) {
                $result = $socialPaymentInformation->add($datas);
            }
            if ($result) {
                $error = 0;
            } else {
                $error = 1;
            }
        }
        self::jsons($error, $result);
    }
}