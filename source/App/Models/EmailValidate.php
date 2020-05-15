<?php
namespace Source\App\Models;
class EmailValidate
{

    public function index($email)
    {
        filter_var($email,FILTER_SANITIZE_STRING);
        if(filter_var($email,FILTER_SANITIZE_EMAIL))
        {
            if(@checkdnsrr(array_pop(explode("@",$email)),"MX"))
            {
                $return = "success";
            }
            else
            {
                $return = "Email invalido";
            }
        }
        else
        {
            $return = "E-mail em formato incorreto";
        }
        return $return;
    }
}