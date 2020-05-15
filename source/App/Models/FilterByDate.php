<?php


namespace Source\App\Models;


use Source\App\Models\Helper\StsRead;

class FilterByDate
{
    private $data;
    private $select;
    public function findByDate($data)
    {
        $find = new StsRead();
        $id = (int)$_SESSION["account_id"];
        $url = explode("/",$data);
        $dates = explode("?",end($url));
        $dates=explode("&",$dates[1]);
        $initial_date = explode("=",$dates[0]);
        $final_date = explode("=",$dates[1]);
        $this->select = "select * from user_despesas where data_despesa between '{$initial_date[1]}' and '{$final_date[1]}'";
        $this->select.=" and id_conta={$id}";
        $find->fullRead($this->select);
        if(count($find->getResultado())>0)
        {
            $this->data=$find->getResultado();
        }
        else
        {
            $this->data = null;
        }
        return $this->data;
    }
    public function all()
    {
        $id = (int)$_SESSION["account_id"];
        $this->select = "select * from user_despesas ";
        $this->select .= "where id_conta={$id} and year(data_despesa)=year(curdate()) ";
        $this->select.="and month(data_despesa)=month(curdate()) order by id desc";
        $find = new StsRead();
        $find->fullRead($this->select);
        if(count($find->getResultado())>0)
        {
            $this->data = $find->getResultado();
        }
        else
        {
            $id = (int)$_SESSION["account_id"];
            $this->select = "select * from user_despesas ";
            $this->select .= "where id_conta={$id} and year(data_despesa)=year(curdate()) ";
            $this->select.="and month(data_despesa)=(month(curdate())-1) order by id desc";
            $find = new StsRead();
            $find->fullRead($this->select);
            if(count($find->getResultado())>0)
            {
                $this->data=$find->getResultado();
            }
            else
            {
                $this->data=null;
            }
        }
        return $this->data;
    }
}