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
    const [displayButton,setDisplayButton] = useState({display:''});

    
    
    
    useEffect(()=>{
        api.get("/user",{
            headers:{
                authorization: "Bearer "+sessionStorage.getItem("token")
            }
        })
        .then((response)=>{
            if(response.data.router)
            {
                sessionStorage.clear();
                history.push(`/${response.data.router}`);
            }
            if(response.data)
            {
                if(response.data.total_income)setAccountUser(response.data);
                setName(response.data.name);
            }
            api.get("/img",{
                headers:{
                    Authorization: sessionStorage.getItem("token")
                }
            })
            .then((response)=>{
                
                if(response.data.url)
                {
                    setUserImg(response.data.url);
                    setImgTitle("Foto de perfil");
                }
                else
                {
                    setUserImg(user_icon);
                    setImgTitle("Adicione uma foto de perfil");
                }
            })
            .catch(error=>console.error(error))
        })
        .catch(error=>console.error(error));
    },[history]);


    useEffect(()=>{
        document.querySelector("div.user_details").classList.add("user_details","animating");
        document.querySelector("div.account_details").classList.add("account_details","animating");
        
        const input = document.querySelector("div.user_details").getElementsByTagName("input");
        for(let i=0;i<input.length;i++)
        {
            input[i].classList.add("animating");
        }
    },[]);    

    function nameFormat(name)
    {
        if(name && (name.indexOf(" ")!==-1))
        {
            let [format,] =  name.split(" ");
            return format;
        }
        return name; 
    }



    async function redirectToProfile()
    {
        await history.push("/Profile");
    }
   
    async function handleCreateAccount(e)
    {
        e.preventDefault();
        if(!total_income || !metaSpending || total_income<=0 || metaSpending<=0)setStatusMessage("Insira os valores corretamente!");
        else
        {
            setDisplayButton({display:'none'});
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
            .then((response)=>{
                setDisplayButton({display:''});
                setStatusMessage("");
                setAccountUser(response.data);
            })
            .catch((error)=>{
                console.error(error);
                setStatusMessage("Ops, algo deu errado! Tente novamente mais tarde.");
                setTimeout(()=>{
                    setDisplayButton({display:''});
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
                                            data-animation="left"
                                        />
                                    </label>
                                    <label>Sua meta mensal de gastos:<br/>
                                        <input 
                                            type="text"
                                            placeholder="Sua meta" 
                                            required 
                                            value={metaSpending}
                                            onChange={(e)=>setMeta(e.target.value)}
                                            data-animation="left"
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
                <div className="user_details" data-animation="top">
                        {getAccount()}       
                </div>
                <div className="account_details" data-animation="top">
                    <Expenses
                        account={accountUser}
                    />
                </div>
            </div>
            <Footer/>
        </div>
    )
}
