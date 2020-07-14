import React, {useState,useEffect} from 'react';
import Expenses from './Expenses';


import {useHistory} from 'react-router-dom';


import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';


import './style.css';

import user_icon from './user_icon.png';

import Header from '../Header/Header';
import Footer from '../../Footer/Footer';

import api from '../../../services/api';





export default function HomeLogged() {
    document.title = "Home";
    const history = useHistory();
    const [name, setName] = useState("");
    const [metaSpending, setMeta] = useState("");
    const [total_income, setTotalIncome] = useState("");
    const [accountUser, setAccountUser] = useState("");
    
    const [userImg, setUserImg] = useState();
    const [imgTitle, setImgTitle] = useState("");

    const [statusMessage, setStatusMessage] = useState("");
    const [displayButton,setDisplayButton] = useState({
        display:''
    });

    
    
    
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
                    setAccountUser(req.data);
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
                    setImgTitle("Foto de perfil");
                }
                else
                {
                    setUserImg(user_icon);
                    setImgTitle("Adicione uma foto de perfil");
                }
            })
            .catch(e=>console.log(e))
        })
        .catch(e=>console.log(e));
    },[history]);


    
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



    async function redirectToProfile()
    {
        await history.push("/Profile");
    }
   
    async function handleCreateAccount(e)
    {
        e.preventDefault();
        if(!total_income || !metaSpending || total_income<0 || metaSpending<0)
        {
            alert("Digite os dados corretamente");
        }
        else
        {
            setDisplayButton({
                display:'none'
            });
            setStatusMessage("Processando...");
            let data = {
                total_income: total_income,
                meta: metaSpending
            };
            await api.post("/account",data,{
                headers:{
                    authorization: sessionStorage.getItem("token")
                }
            })
            .then((req)=>{
                setDisplayButton({
                    display:''
                });
                setStatusMessage("");
                setAccountUser(req.data);
            })
            .catch((e)=>{
                console.log(e);
                setStatusMessage("Ops, algo deu errado! Tente novamente mais tarde.");
                setTimeout(()=>{
                    setDisplayButton({
                        display:''
                    });
                    setStatusMessage("");
                },2000);
            });
        }
        
    }

    function getAccount()
    {
        if(accountUser)
        {
            return(
                <Card id="todo_card">
                    
                    <img 
                        onClick={()=>redirectToProfile()} 
                        src={userImg} 
                        id="user_icon" 
                        style={{borderRadius:'50%'}} 
                        alt="profilePicture" 
                        title={imgTitle}

                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            Olá, {nameFormat(name)}
                        </Typography>
                            
                            <div className="title">
                                Renda mensal:
                            </div>
                            <div className="val">
                            {"R$"+Number(accountUser.total_income).toLocaleString("pt",{minimumFractionDigits: 2, 
                                    maximumFractionDigits: 2})}
                            </div>
                            
                            
                            <div className="title">
                                Meta mensal de gastos:
                            </div>
                            <div className="val">
                            {"R$"+Number(accountUser.meta).toLocaleString("pt",{minimumFractionDigits: 2, 
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
                    <img 
                        onClick={()=>redirectToProfile()} 
                        src={userImg} id="user_icon" 
                        style={{borderRadius:'50%'}} 
                        alt="profilePicture" 
                        title={imgTitle}
                    />
                    
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            Olá, {nameFormat(name)}
                        </Typography>
                            <div className="create_account">
                                <p>Cadastre seus dados financeiros abaixo para começar!</p>
                                <form onSubmit={handleCreateAccount}>
                                    <label>Sua renda total do mês:<br/>
                                        <input 
                                            type="text"
                                            placeholder="Sua renda" 
                                            required 
                                            value={total_income}
                                            onChange={(e)=>{setTotalIncome(e.target.value)}}
                                        />
                                    </label>
                                    <label>Sua meta mensal de gastos:<br/>
                                        <input 
                                            type="text"
                                            placeholder="Sua meta" 
                                            required 
                                            value={metaSpending}
                                            onChange={(e)=>setMeta(e.target.value)}
                                        />
                                    </label>
                                    <button style={displayButton}  type="submit" title="Cadastrar renda e meta mensais de gasto" >
                                        Cadastrar
                                    </button>
                                    {statusMessage}
                                </form>
                            </div>    
                    </CardContent>
                </Card>
            );
        }
        
    }

    
    return (
        <div className="todo-logged">
            <Header/>
            <div className="logged-container">
                <div className="user_details">
                        {getAccount()}       
                </div>
                <div className="account_details">
                    <Expenses
                        account={accountUser}
                    />
                </div>
            </div>
            <Footer/>
        </div>
    )
}
