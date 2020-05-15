import React, {useState,useEffect} from 'react';
import Divider from '@material-ui/core/Divider';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';


import './style.css';
import {useHistory} from 'react-router-dom';
import user_icon from './user_icon.png';

import Header from '../Header/Header';
import Footer from '../../Footer/Footer';

import api from '../../../services/api';





export default function HomeLogged() {
    document.title = "Home";
    const history = useHistory();
    const [name, setName] = useState("");
    const [total_income, setTotalIncome] = useState("");
    const [description, setDescription] = useState("");
    const [value, setValue] = useState("");
    const [meta, setMeta] = useState("");
    const [account, setAccount] = useState("");
    const [data,setData] = useState([]);
    const [userImg, setUserImg] = useState();
    
    
    
    useEffect(()=>{
        api.get("/user",{
            headers:{
                authorization: "Bearer "+sessionStorage.getItem("token")
            }
        })
        .then((req)=>{
            if(req.data.router)
            {
                sessionStorage.clear();
                history.push(`/${req.data.router}`);
            }
            if(req.data)
            {
                if(req.data.total_income)
                {
                    setAccount(req.data);
                }
                setName(req.data.name);
            }
            api.get("/img",{
                headers:{
                    Authorization: sessionStorage.getItem("token")
                }
            })
            .then((res)=>{
                
                if(res.data.url)
                {
                    setUserImg(res.data.url);
                }
                else
                {
                    setUserImg(user_icon);
                }
                
            })
            .catch(e=>console.log(e))
        })
        .catch(e=>console.log(e));


        api.get("/expense",{
            headers:{
                authorization: sessionStorage.getItem("token")
            }
        })
        .then((req)=>{
            
            if(req.data)
            {
                setData(req.data);
            }
        })
        .catch(e=>console.log(e));
    },[history]);




    async function handleDelete(id)
    {
        if(window.confirm("Tem certeza que deseja fazer isso?"))
        {
            await api.delete("/expense",{
                headers:{
                    authorization: sessionStorage.getItem("token"),
                    id_expense: id
                }
            })
            .then((req)=>{
                if(req.data.router)
                {
                    history.push(`/${req.data.router}`);
                }
                if(data)
                {
                    setData(data.filter((data)=>data.id!==id));
                }
            })
            .catch(e=>{
                console.log(e);
            });
        }
    }


    function nameFormat(name)
    {
        if(name && (name.indexOf(" ")!==-1))
        {
            let [format,] =  name.split(" ");
            return format;
        }
        else
        {
            return name;
        }
    }

    function dateFormat(date){
        var split = date.split('/');
        const format_date = split[2] + "/" + split[1] + "/" + split[0];
        return format_date;
    }


    async function redirect()
    {
        await history.push("/Profile");
    }
    async function handleCreateExpense(e)
    {
        e.preventDefault();
        if(!description || !value || value<0)
        {
            alert("Digite os dados Corretamente!");
        }
        else
        {
            let d = new Date();
            let day = d.getDate();
            let month = ((d.getMonth()+1)<10)?"0"+(d.getMonth()+1): d.getMonth()+1;
            let year = d.getFullYear();
            if(value.indexOf(",")!==-1)
            {
                alert("Os números devem ser separados por ponto");
            }
            
            let data = {
                value:value,
                description: description,
                date_expense: `${year}/${month}/${day}`
            };
            
            await api.post("/expense",data,{
                headers:{
                    authorization: sessionStorage.getItem("token")
                }
            })
            .then((req)=>{
                api.get("/expense",{
                    headers:{
                        authorization: sessionStorage.getItem("token")
                    }
                })
                .then((req)=>{
                    
                    if(req.data)
                    {
                        setData(req.data);
                    }
                })
                .catch(e=>console.log(e));
                setValue("");
                setDescription("");
            })
            .catch(e=>console.log(e))
        }
    }
    async function handleCreateAccount(e)
    {
        e.preventDefault();
        if(!total_income || !meta || total_income<0 || meta<0)
        {
            alert("Digite os dados corretamente");
        }
        else
        {
            let data = {
                total_income: total_income,
                meta: meta
            };
            await api.post("/account",data,{
                headers:{
                    authorization: sessionStorage.getItem("token")
                }
            })
            .then((req)=>{
                setAccount(req.data);
            })
            .catch(e=>console.log(e));
        }
        
    }

    function getAccount()
    {
        if(account)
        {
            return(
                <Card id="todo_card">
                    
                    <img onClick={()=>redirect()} src={userImg} id="user_icon" style={{borderRadius:'50%'}} alt="profilePicture" />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            Olá, {nameFormat(name)}
                        </Typography>
                            
                            <div className="title">
                                Renda Total:
                            </div>
                            <div className="val">
                            {"R$"+Number(account.total_income).toLocaleString("pt",{minimumFractionDigits: 2, 
                                    maximumFractionDigits: 2})}
                            </div>
                            
                            
                            <div className="title">
                                Meta mensal de gastos:
                            </div>
                            <div className="val">
                            {"R$"+Number(account.meta).toLocaleString("pt",{minimumFractionDigits: 2, 
                                maximumFractionDigits: 2})}
                            </div>
                    </CardContent>
                </Card>  
            );
        }
        else
        {
            return (
                <Card id="todo_card">
                    
                    <img onClick={()=>redirect()} src={userImg} id="user_icon" style={{borderRadius:'50%'}} alt="profilePicture" />
                    
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            Olá, {nameFormat(name)}
                        </Typography>
                            <div className="create_account">
                                <h2>Crie sua conta primeiro</h2>
                                <form onSubmit={handleCreateAccount}>
                                    <label>Sua renda total do mês:
                                        <input 
                                            type="text"
                                            placeholder="Sua renda" 
                                            required 
                                            value={total_income}
                                            onChange={(e)=>{setTotalIncome(e.target.value)}}
                                        />
                                    </label>
                                    <label>Sua meta mensal de gastos:
                                        <input 
                                            type="text"
                                            placeholder="Sua meta" 
                                            required 
                                            value={meta}
                                            onChange={(e)=>setMeta(e.target.value)}
                                        />
                                    </label>
                                    <input type="submit" value="Cadastrar"/>
                                </form>
                            </div>    
                    </CardContent>
                </Card>
            );
        }
        
    }

    
    

    function getExpenses()
    {
        if(account && Array.isArray(data))
        {    
            return (
                <div>
                    <div className="form-expense">
                        <h2>
                            Adicione suas dívidas aqui!
                        </h2>
                        <form onSubmit={(e)=>{handleCreateExpense(e)}}>
                                <label>Descrição da dívida<br/>
                                <input 
                                    type="text" 
                                    placeholder="Descrição"  
                                    required
                                    value={description}
                                    onChange={e=>setDescription(e.target.value)}
                                />
                                </label><br/>
                                <label>Valor da Dívida:<br/>
                                <input 
                                    type="text" 
                                    placeholder="Valor" 
                                    required
                                    value={value}
                                    onChange={e=>setValue(e.target.value)}
                                />
                            </label><br/>
                            <button type="submit">Cadastrar</button>
                        </form>
                    </div>
                    <Divider/>
                    {data.map(d=>{
                    return (
                        <div key={d.id} className="expense">            
                            <div><h4>Data</h4><div>{dateFormat(d.date_expense)}</div></div>
                            <div><h4>Descrição</h4><div>{d.description}</div></div>
                            <div>
                                <h4>Valor</h4>
                                    {"R$"+Number(d.value).toLocaleString("pt",{minimumFractionDigits: 2, 
                                        maximumFractionDigits: 2})}
                            </div>
                            <div>
                                <h4>Ações</h4>
                                <div>
                                    <span>
                                        <EditIcon/>
                                    </span> 
                                    <span>
                                        <DeleteIcon onClick={()=>handleDelete(d.id)} />
                                    </span>
                                </div>
                            </div>
                            <Divider/>
                        </div>
                    );
                })}
                </div>
            );
        }  
        else if(account)
        {
            return (
                <div className="form-expense">
                    <h2>
                        Adicione suas dívidas aqui!
                    </h2>
                    <form onSubmit={e=>handleCreateExpense(e)}>
                        <label>Descrição da dívida<br/>
                            <input 
                                type="text" 
                                placeholder="Descrição"  
                                required
                                value={description}
                                onChange={e=>setDescription(e.target.value)}
                            />
                        </label><br/>
                        <label>Valor da Dívida:<br/>
                            <input 
                                type="text" 
                                placeholder="Valor" 
                                required
                                value={value}
                                onChange={e=>setValue(e.target.value)}
                            />
                        </label><br/>
                        <button type="submit">Cadastrar</button>
                    </form>
                </div>
            );
        }
        else
        {
            return (<div><h2>Primeiro Adicione sua renda e sua meta mensal!</h2></div>);
        }  
    }
    
    return (
        <div className="todo-logged">
            <Header/>
            <div className="logged-container">
                <div className="user_details"><div></div>{getAccount()}</div>
                <div className="account_details">{getExpenses()}</div>
            </div>
            
            <Footer/>
        </div>
    )
}
