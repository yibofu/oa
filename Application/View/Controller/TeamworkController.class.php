<?php
namespace View\Controller;
use Think\Controller;
class TeamworkController extends Controller {
    public function index($debug=0){

        if($debug == 0)
            $this->display("web/teamwork/dist/teamwork");
        else
            $this->display("web/teamwork/teamwork/teamwork");
    }


}