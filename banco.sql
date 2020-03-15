create database if not exists contabilidade;
use contabilidade;

create table user(
	id int not null primary key auto_increment,
    name varchar(100) not null, 
    email varchar(100) not null,
    celular varchar(50) not null,
    senha varchar(100) not null
)engine="InnoDB" DEFAULT CHARSET=latin1;
select sha1(name) from user where senha=sha1('123') and email='';
