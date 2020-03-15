<?php


namespace Source\App\Models\Helper;


class StsConn
{

    public static $host = DBHOST;
    public static $user = DBUSER;
    public static $pass = DBPASS;
    public static $dbname = DBNAME;
    private static $connection = null;
    private static function conectar()
    {

        try
        {
            if(self::$connection==null)
            {
                self::$connection = new \PDO('mysql:host='.self::$host.';dbname='.self::$dbname,self::$user,self::$pass,
                    array(\PDO::MYSQL_ATTR_INIT_COMMAND=>'SET NAMES utf8'));
            }
        }
        catch (Exception $e)
        {
            echo "Erro: {$e->getMessage()}";
            die;
        }
        return self::$connection;
    }
    public function getConn()
    {
        return self::conectar();
    }
}