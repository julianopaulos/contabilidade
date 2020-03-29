create database if not exists contabilidade;
use contabilidade;

create table user(
	id int not null primary key auto_increment,
    name varchar(100) not null, 
    email varchar(100) not null,
    celular varchar(50) not null,
    senha varchar(100) not null
)engine="InnoDB";
select sha1(name) from user where senha=sha1('123') and email='';

create table user_conta_principal(
	id int not null primary key auto_increment,
    id_user int not null,
    renda_total_mes double not null,
    meta_mes double,
    foreign key(id_user) references user(id)
)engine="InnoDB";

create table user_despesas(
	id int not null primary key auto_increment,
    id_conta int not null,
    valor double not null,
    descricao varchar(200) not null,
    data_despesa date not null,
    foreign key(id_conta) references user_conta_principal(id)
)engine="InnoDB";

create table user_img(
	id int not null primary key auto_increment,
    id_user int not null,
    image mediumblob
)engine="InnoDB";


select user.*,user_conta_principal.*, user_despesas.* from user
inner join user_conta_principal on user_conta_principal.id_user = user.id
inner join user_despesas on user_despesas.id_conta=user_conta_principal.id 
where user.email='julianopaulo.santos@hotmail.com' and user.senha='01b307acba4f54f55aafc33bb06bbbf6ca803e9a';

select user.senha from user;	


select * from user_conta_principal where id_user=(select id from user where email='julianopaulo.santos@hotmail.com' and senha='01b307acba4f54f55aafc33bb06bbbf6ca803e9a');