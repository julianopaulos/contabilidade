import React, {useState,useEffect} from 'react';

import {useHistory} from 'react-router-dom';


import Header from '../Header/Header';
import Footer from '../../Footer/Footer';

import api from '../../../services/api';

import './style.css';

document.title="Edição de Despesa";
export default function Edit()
{
    const history = useHistory();

    const [description, setDescription] = useState(null);
    const [value, setValue] = useState(null);
    const [dateExpense, setDateExpense] = useState(null);
    const [message,setMessage] = useState("");
    
    
    
    
    useEffect(()=>{
        try
        {
            api.get("/user",{
                headers:{
                    authorization: "Bearer "+sessionStorage.getItem("token")
                }
            })
            .then((res)=>{
                if(res.data.router)
                {
                    history.push(`/${res.data.router}`);
                }
                let url_string = window.location.href; 
                let url = new URL(url_string);
                let id = Number(url.searchParams.get("id"));
                if(id)
                {
                    api.get(`/edit?id=${id}`,{
                        headers:{
                            authorization: sessionStorage.getItem("token")
                        }
                    })
                    .then((res)=>{
                        if(res.data)
                        {
                            setDescription(res.data.description);
                            setDateExpense(res.data.date_expense.replace(/\//g,"-"));
                            setValue(res.data.value);
                        }
                        else
                        {
                            history.push("/Logged");
                        }                        
                    })
                    .catch(e=>console.log(e))
                }
                
            })
            .catch(e=>console.log(e))
        }
        catch(e)
        {
            console.log(e);
        }
    },[history]);

    async function handleSubmit(e)
    {
        e.preventDefault();
        if(description === " " || value === " " || dateExpense === " ")
        {
            alert("Nenhum dado pode ficar vazio")
        }
        else
        {
            let data = {
                "description":description,
                "value":value,
                "date_expense":dateExpense
            }
            let url_string = window.location.href; 
            let url = new URL(url_string);
            let id = Number(url.searchParams.get("id"));
            setMessage("Aguarde...");
            api.put("/expense",data,{
                headers:{
                    authorization: sessionStorage.getItem("token"),
                    id_expense: id
                }
            })
            .then((res)=>{
                if(res.data.message)
                {
                    setMessage(res.data.message);
                    setTimeout(()=>{
                        history.push("/Logged");
                    },1000);
                    
                }
            })
            .catch(e=>{
                console.log(e);
                setMessage("Ops, algo deu errado! Recarregue e tente novamente.");
                setTimeout(()=>{
                    setMessage("");
                },2000);
            });
        }
    }
    
    return (
        <div className="todo-edit">
            <Header/>
            <div className="update_expense">            
                <form onSubmit={(e)=>handleSubmit(e)}>
                    <label htmlFor="date">Data</label>
                    <input 
                        type="date" 
                        defaultValue={dateExpense} 
                        name="date"
                        onKeyUp={(e)=>setDateExpense(e.target.value)} 
                        onChange={(e)=>{setDateExpense(e.target.value)}}
                    />                       
                    <br/>
                    <label htmlFor="description">Descrição</label>
                    <input 
                        name="description"
                        type="text" 
                        defaultValue={description} 
                        onKeyUp={(e)=>setDescription(e.target.value)} 
                    />
                    <br/>
                    <label htmlFor="value">Valor</label>
                    <input 
                        name="value"
                        type="text" 
                        defaultValue={value} 
                        onKeyUp={(e)=>setValue(e.target.value)}
                    />
                    <br/>
                    <button type="submit">Alterar</button>
                    <button type="button" onClick={()=>history.push("/Logged")}>Cancelar</button>
                    <br/><h4 id="message">{message}</h4>
                </form>
            </div>
            <Footer/>
        </div>
        
    );
}